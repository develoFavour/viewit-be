/**
 * Sends a premium, sleek verification email to a new merchant.
 * Direct HTTP integration with Brevo API.
 */
export const sendVerificationEmail = async (email, name, token) => {
  const apiKey = process.env.BREVO_API_KEY;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationLink = `${frontendUrl}/verify?token=${token}`;

  const payload = {
    sender: { name: "ViewIt AR", email: process.env.SENDER_EMAIL },
    to: [{ email, name }],
    subject: "Confirm your account on ViewIt AR Studio",
    htmlContent: `
      <html
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px; margin: 0;">
          <div style="max-width: 500px; margin: 0 auto;">
            <div style="margin-bottom: 30px;">
              <h1 style="font-size: 20px; font-weight: 800; color: #000000; letter-spacing: -0.02em; margin: 0;">ViewIt <span style="color: #2563eb;">AR</span></h1>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; letter-spacing: -0.02em;">Verify your email</h2>
            <p style="font-size: 16px; color: #4b5563; line-height: 24px; margin-bottom: 32px;">
              Hello ${name}, thank you for joining ViewIt. To finalize your merchant studio setup, please verify your email address by clicking the button below.
            </p>
            <a href="${verificationLink}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-weight: 600; text-decoration: none; font-size: 15px;">
              Verify Email Address
            </a>
            <div style="margin-top: 48px; border-top: 1px solid #e5e7eb; pt: 24px;">
              <p style="font-size: 13px; color: #9ca3af; line-height: 20px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (response.status !== 201) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
    }
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
};
