import { resend, EMAIL_FROM } from "./resend";
import {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getInvitationEmailTemplate,
  getWelcomeEmailTemplate,
} from "./templates";

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping email verification send.");
    return;
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Verify your email address - Nexora",
    html: getVerificationEmailTemplate(token),
  });

  if (error) console.error("Resend Error (Verification):", error);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping password reset email send.");
    return;
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Reset your password - Nexora",
    html: getPasswordResetEmailTemplate(token),
  });

  if (error) console.error("Resend Error (Password Reset):", error);
};

export const sendInvitationEmail = async (
  email: string,
  inviterName: string,
  orgName: string,
  token: string
) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping invitation email send.");
    return;
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `You've been invited to join ${orgName} on Nexora`,
    html: getInvitationEmailTemplate(inviterName, orgName, token),
  });

  if (error) console.error("Resend Error (Invitation):", error);
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping welcome email send.");
    return;
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Welcome to Nexora!",
    html: getWelcomeEmailTemplate(name),
  });

  if (error) console.error("Resend Error (Welcome):", error);
};
