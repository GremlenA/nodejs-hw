import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { createSession } from "../services/auth.js";
import { Session } from "../models/session.js";
import { setSessionCookies } from "../services/auth.js";
import jwt from "jsonwebtoken";
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { sendEmail } from "../utils/sendMail.js";


export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });
  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);
  res.status(201).json(newUser);
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshUserSession = async (req, res, next) => {

  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  if (!session) {
    return next(createHttpError(401, "Session not found"));
  }

  const isSessionTokenExprired = new Date() > new Date(session.refreshTokenValidUntil);


  if (isSessionTokenExprired) {
    return next(createHttpError(401, "Session token expired"));
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({ message: "Session refreshed", });
};

export const requestResetEmail = async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: "Password reset email sent successfully" });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }, // токен действителен 15 минут
  );
  // укзали путь к шаблону
  const templatePath = path.resolve("src/templates/reset-password-email.html");
  //считали шаблон
  const templateSource = await fs.readFile(templatePath, "utf-8");
  //шаблон до заполнения
  const template = handlebars.compile(templateSource);
  //делаем с HTML документ с динамичными данными
  const html = template({
    name: user.name,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {

    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
    res.status(200).json({ message: "Password reset email sent successfully" });
  }
  catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

};


export const resetPassword = async (req, res, next) => {
  try {
    const { password, token } = req.body;
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch {

      throw createHttpError(401, 'Invalid or expired token');
    }

    const user = await User.findOne({
      _id: decoded.sub,
      email: decoded.email
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: user._id },
      { password: hashedPassword }
    );

    await Session.deleteMany({ userId: user._id });
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({
      message: 'Password reset successfully'
    });

  } catch (error) {

    if (error.status) {
        next(error);
    } else {

        next(createHttpError(500, 'Failed to reset password, please try again later.'));
    }
  }
};
