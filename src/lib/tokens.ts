import crypto from "crypto";
import prisma from "@/lib/prisma";

export const hashToken = (t: string): string => {
  return crypto.createHash("sha256").update(t).digest("hex");
};

export const generateVerificationToken = async (email: string) => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token: hashedToken,
      expiresAt,
    },
  });

  // Return rawToken for delivery via email to the user
  return { ...verificationToken, token: rawToken };
};

export const generatePasswordResetToken = async (email: string) => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token: hashedToken,
      expiresAt,
    },
  });

  // Return rawToken for delivery via email to the user
  return { ...passwordResetToken, token: rawToken };
};
