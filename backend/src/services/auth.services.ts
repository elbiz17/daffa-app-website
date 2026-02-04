import bcrypt from "bcryptjs";
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";
import jwt from "jsonwebtoken";
import { toUTC7 } from "../utils/timeHelper";

const AuthServices = {

  signIn: async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      throw new Error("Email and password is required");
    }
    const passwordValid = await bcrypt.compare(password, user.password);
     if (!passwordValid) throw new Error("Invalid email or password");

    const { token, expiresIn, expiresAt, createdAt } = generateToken({
      user: {
        id: user.id,
        role: user.role,
      },
    });


    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        createdAt,
        expiresAt,
      },
    });

    return {
      token,
      expiresIn,
      expiresAt,
      createdAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: toUTC7(user.createdAt),
      },
    };
  },
  me: async (userId: string, token: string) => {
    const session = await prisma.session.findUnique({
      where: { token },
    });
    if (!session) throw new Error("Session not found or invalid.");
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { token } });
      throw new Error("Session expired. Please sign in.");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    if(!user) throw new Error("User not found");
    return {
        ...user,
        expiredIn:session.expiresAt
    }
  },
};

export default AuthServices;
