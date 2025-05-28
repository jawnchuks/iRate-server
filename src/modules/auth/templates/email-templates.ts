import {
  EmailTemplate,
  VerificationEmailData,
  WelcomeEmailData,
} from '../interfaces/email.interface';

export const emailTemplates: Record<string, EmailTemplate> = {
  verification: {
    subject: 'Verify Your iRate Account',
    html: (data: VerificationEmailData | WelcomeEmailData) => {
      if ('otp' in data) {
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your iRate Account</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #f8f9fa;
                  border-radius: 8px;
                  margin-bottom: 20px;
                }
                .content {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .otp-code {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007bff;
                  text-align: center;
                  padding: 20px;
                  background-color: #f8f9fa;
                  border-radius: 4px;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 12px;
                  color: #6c757d;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Welcome to iRate!</h1>
              </div>
              <div class="content">
                <p>Hi ${data.name || 'there'},</p>
                <p>Thank you for joining iRate! To complete your registration, please use the following verification code:</p>
                <div class="otp-code">${data.otp}</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this verification code, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} iRate. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
              </div>
            </body>
          </html>
        `;
      }
      throw new Error('Invalid data type for verification email');
    },
    text: (data: VerificationEmailData | WelcomeEmailData) => {
      if ('otp' in data) {
        return `
          Welcome to iRate!
          
          Hi ${data.name || 'there'},
          
          Thank you for joining iRate! To complete your registration, please use the following verification code:
          
          ${data.otp}
          
          This code will expire in 10 minutes.
          
          If you didn't request this verification code, please ignore this email.
          
          © ${new Date().getFullYear()} iRate. All rights reserved.
          This is an automated message, please do not reply.
        `;
      }
      throw new Error('Invalid data type for verification email');
    },
  },
  welcome: {
    subject: 'Welcome to iRate!',
    html: (data: VerificationEmailData | WelcomeEmailData) => {
      if ('name' in data && !('otp' in data)) {
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to iRate</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #f8f9fa;
                  border-radius: 8px;
                  margin-bottom: 20px;
                }
                .content {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 12px;
                  color: #6c757d;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Welcome to iRate!</h1>
              </div>
              <div class="content">
                <p>Hi ${data.name},</p>
                <p>Welcome to iRate! We're excited to have you join our community.</p>
                <p>Here's what you can do next:</p>
                <ul>
                  <li>Complete your profile</li>
                  <li>Add your interests</li>
                  <li>Start connecting with others</li>
                </ul>
                <p>If you have any questions, feel free to reach out to our support team.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} iRate. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
              </div>
            </body>
          </html>
        `;
      }
      throw new Error('Invalid data type for welcome email');
    },
    text: (data: VerificationEmailData | WelcomeEmailData) => {
      if ('name' in data && !('otp' in data)) {
        return `
          Welcome to iRate!
          
          Hi ${data.name},
          
          Welcome to iRate! We're excited to have you join our community.
          
          Here's what you can do next:
          - Complete your profile
          - Add your interests
          - Start connecting with others
          
          If you have any questions, feel free to reach out to our support team.
          
          © ${new Date().getFullYear()} iRate. All rights reserved.
          This is an automated message, please do not reply.
        `;
      }
      throw new Error('Invalid data type for welcome email');
    },
  },
};
