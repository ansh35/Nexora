const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const getVerificationEmailTemplate = (token: string) => {
  const verifyUrl = `${NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #070B14; color: #ffffff; border-radius: 12px; border: 1px solid #1f2937;">
      <h2 style="color: #22D3EE; text-align: center;">Verify your email address</h2>
      <p style="color: #d1d5db; font-size: 16px;">Welcome to Nexora! Please verify your email address to complete your registration and unlock all features.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="background-color: #22D3EE; color: #070B14; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;
};

export const getPasswordResetEmailTemplate = (token: string) => {
  const resetUrl = `${NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #070B14; color: #ffffff; border-radius: 12px; border: 1px solid #1f2937;">
      <h2 style="color: #22D3EE; text-align: center;">Reset your password</h2>
      <p style="color: #d1d5db; font-size: 16px;">We received a request to reset the password for your Nexora account. Click the button below to choose a new password.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #22D3EE; color: #070B14; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; text-align: center;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;
};

export const getInvitationEmailTemplate = (inviterName: string, orgName: string, token: string) => {
  const acceptUrl = `${NEXT_PUBLIC_APP_URL}/invite/accept?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #070B14; color: #ffffff; border-radius: 12px; border: 1px solid #1f2937;">
      <h2 style="color: #22D3EE; text-align: center;">You've been invited!</h2>
      <p style="color: #d1d5db; font-size: 16px;"><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> on Nexora.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${acceptUrl}" style="background-color: #22D3EE; color: #070B14; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; text-align: center;">Click the button above to accept the invitation and join the workspace.</p>
    </div>
  `;
};

export const getWelcomeEmailTemplate = (name: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #070B14; color: #ffffff; border-radius: 12px; border: 1px solid #1f2937;">
      <h2 style="color: #22D3EE; text-align: center;">Welcome to Nexora, ${name}!</h2>
      <p style="color: #d1d5db; font-size: 16px;">We're thrilled to have you on board. Nexora is designed to help you and your team manage projects and tasks seamlessly.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #22D3EE; color: #070B14; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; text-align: center;">If you need any help getting started, feel free to reach out to our support team.</p>
    </div>
  `;
};
