// Base interfaces for templates
export interface NotificationTemplate<T> {
  subject: string;
  html?: (data: T) => string;
  text: (data: T) => string;
  sms?: (data: T) => string;
}

// Email-specific interfaces
export interface VerificationData {
  name: string;
  otp: string;
}

export interface WelcomeData {
  name: string;
}

export interface PasswordResetData {
  name: string;
  resetLink: string;
}

export interface SubscriptionConfirmationData {
  name: string;
  planName: string;
  amount: string;
  nextBillingDate: string;
}

export interface PaymentConfirmationData {
  name: string;
  amount: string;
  date: string;
  transactionId: string;
}

export interface RatingNotificationData {
  name: string;
  contentTitle: string;
  rating: number;
  comment?: string;
}

export interface ChatRequestData {
  name: string;
  requesterName: string;
  message: string;
}

// SMS-specific interfaces
export interface SMSVerificationData {
  otp?: string;
}

export interface SMSPasswordResetData {
  resetLink: string;
}

export interface SMSSubscriptionData {
  planName: string;
  amount: string;
}

// Common email styles and components
const emailStyles = {
  container: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  `,
  header: `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  `,
  logo: `
    color: #ffffff;
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    text-decoration: none;
    letter-spacing: -1px;
  `,
  body: `
    padding: 40px 30px;
    background-color: #ffffff;
  `,
  greeting: `
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    margin: 0 0 20px 0;
  `,
  text: `
    font-size: 16px;
    color: #555555;
    margin: 16px 0;
    line-height: 1.6;
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    padding: 16px 32px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
  `,
  codeBox: `
    background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
    border: 2px solid #667eea;
    padding: 24px;
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 8px;
    margin: 30px 0;
    border-radius: 12px;
    color: #667eea;
    font-family: 'Courier New', monospace;
  `,
  infoBox: `
    background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
    border-left: 4px solid #667eea;
    padding: 24px;
    margin: 24px 0;
    border-radius: 0 8px 8px 0;
  `,
  footer: `
    background-color: #f8f9fa;
    padding: 30px;
    text-align: center;
    border-radius: 0 0 8px 8px;
    border-top: 1px solid #e9ecef;
  `,
  footerText: `
    font-size: 14px;
    color: #6c757d;
    margin: 8px 0;
  `,
  divider: `
    height: 1px;
    background: linear-gradient(90deg, transparent, #e9ecef, transparent);
    margin: 30px 0;
    border: none;
  `,
  starRating: `
    color: #ffc107;
    font-size: 20px;
    margin: 8px 0;
  `,
};

const createEmailWrapper = (content: string) => `
  <div style="${emailStyles.container}">
    <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
      ${content}
    </div>
  </div>
`;

const createHeader = (title: string) => `
  <div style="${emailStyles.header}">
    <h1 style="${emailStyles.logo}">iRate</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">${title}</p>
  </div>
`;

const createFooter = () => `
  <div style="${emailStyles.footer}">
    <p style="${emailStyles.footerText}">
      <strong>iRate Team</strong><br>
      Making content discovery better, one rating at a time
    </p>
    <hr style="${emailStyles.divider}">
    <p style="${emailStyles.footerText}">
      This email was sent to you because you have an account with iRate.<br>
      If you have any questions, please contact our support team.
    </p>
    <p style="${emailStyles.footerText}">
      © 2025 iRate. All rights reserved.
    </p>
  </div>
`;

// Email Templates
export const emailTemplates = {
  verification: {
    subject: '🔐 Verify Your iRate Account',
    html: (data: VerificationData) =>
      createEmailWrapper(`
      ${createHeader('Email Verification')}
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">Hi ${data.name}! 👋</p>
        <p style="${emailStyles.text}">
          Welcome to <strong>iRate</strong>! We're thrilled to have you join our community of content enthusiasts.
        </p>
        <p style="${emailStyles.text}">
          To get started, please verify your email address using the code below:
        </p>
        <div style="${emailStyles.codeBox}">
          ${data.otp}
        </div>
        <div style="${emailStyles.infoBox}">
          <p style="margin: 0; font-size: 14px; color: #667eea;">
            <strong>⏰ Important:</strong> This verification code expires in 10 minutes for your security.
          </p>
        </div>
        <p style="${emailStyles.text}">
          Once verified, you'll be able to rate content, connect with other users, and discover amazing new things!
        </p>
        <p style="${emailStyles.text}; color: #888888; font-size: 14px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
      ${createFooter()}
    `),
    text: (data: VerificationData) => `
      🔐 VERIFY YOUR IRATE ACCOUNT

      Hi ${data.name}!

      Welcome to iRate! We're thrilled to have you join our community.

      Please use this verification code: ${data.otp}

      This code expires in 10 minutes.

      If you didn't create this account, please ignore this email.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<VerificationData>,

  welcome: {
    subject: "🎉 Welcome to iRate - Let's Get Started!",
    html: (data: WelcomeData) =>
      createEmailWrapper(`
      ${createHeader('Welcome to iRate!')}
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">Welcome aboard, ${data.name}! 🚀</p>
        <p style="${emailStyles.text}">
          Congratulations! Your account is now verified and ready to use. We're excited to have you as part of the iRate community.
        </p>
        <div style="${emailStyles.infoBox}">
          <h3 style="margin: 0 0 16px 0; color: #667eea;">🌟 What you can do with iRate:</h3>
          <div style="margin-left: 16px;">
            <p style="margin: 8px 0;"><strong style="color: #667eea;">⭐</strong> Rate and review your favorite movies, books, restaurants, and more</p>
            <p style="margin: 8px 0;"><strong style="color: #667eea;">🤝</strong> Connect with like-minded users and build your network</p>
            <p style="margin: 8px 0;"><strong style="color: #667eea;">🎯</strong> Discover personalized content recommendations</p>
            <p style="margin: 8px 0;"><strong style="color: #667eea;">💬</strong> Join discussions and share your opinions</p>
          </div>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="${emailStyles.button}">
            🚀 Start Exploring iRate
          </a>
        </div>
        <p style="${emailStyles.text}">
          Need help getting started? Our support team is here to assist you every step of the way.
        </p>
      </div>
      ${createFooter()}
    `),
    text: (data: WelcomeData) => `
      🎉 WELCOME TO IRATE!

      Welcome aboard, ${data.name}!

      Your account is verified and ready to use. Here's what you can do:

      ⭐ Rate and review your favorite content
      🤝 Connect with other users  
      🎯 Discover personalized recommendations
      💬 Join discussions and share opinions

      Start exploring iRate today!

      Need help? Our support team is here for you.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<WelcomeData>,

  passwordReset: {
    subject: '🔑 Reset Your iRate Password',
    html: (data: PasswordResetData) =>
      createEmailWrapper(`
      ${createHeader('Password Reset Request')}
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">Hi ${data.name},</p>
        <p style="${emailStyles.text}">
          We received a request to reset your password for your iRate account. No worries – it happens to the best of us! 
        </p>
        <p style="${emailStyles.text}">
          Click the button below to securely reset your password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" style="${emailStyles.button}">
            🔑 Reset My Password
          </a>
        </div>
        <div style="${emailStyles.infoBox}">
          <p style="margin: 0; font-size: 14px; color: #667eea;">
            <strong>🛡️ Security Note:</strong> This link will expire in 1 hour for your protection.
          </p>
        </div>
        <p style="${emailStyles.text}; color: #888888; font-size: 14px;">
          If you didn't request this password reset, please ignore this email. Your account remains secure.
        </p>
      </div>
      ${createFooter()}
    `),
    text: (data: PasswordResetData) => `
      🔑 RESET YOUR IRATE PASSWORD

      Hi ${data.name},

      We received a request to reset your password.

      Reset your password here: ${data.resetLink}

      This link expires in 1 hour for security.

      If you didn't request this, please ignore this email.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<PasswordResetData>,

  subscriptionConfirmation: {
    subject: '✅ Subscription Confirmed - Welcome to Premium!',
    html: (data: SubscriptionConfirmationData) =>
      createEmailWrapper(`
      ${createHeader('Subscription Confirmed!')}
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">Congratulations, ${data.name}! 🎉</p>
        <p style="${emailStyles.text}">
          Thank you for upgrading to our <strong>${data.planName}</strong> plan. You now have access to all premium features!
        </p>
        <div style="${emailStyles.infoBox}">
          <h3 style="margin: 0 0 16px 0; color: #667eea;">📋 Subscription Details:</h3>
          <table style="width: 100%; font-size: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #333;">Plan:</td>
              <td style="padding: 8px 0;">${data.planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #333;">Amount:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #667eea;">${data.amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #333;">Next Billing:</td>
              <td style="padding: 8px 0;">${data.nextBillingDate}</td>
            </tr>
          </table>
        </div>
        <p style="${emailStyles.text}">
          You can manage your subscription, update payment methods, or change plans anytime in your account settings.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="${emailStyles.button}">
            🎯 Explore Premium Features
          </a>
        </div>
      </div>
      ${createFooter()}
    `),
    text: (data: SubscriptionConfirmationData) => `
      ✅ SUBSCRIPTION CONFIRMED!

      Congratulations, ${data.name}!

      Thank you for upgrading to ${data.planName}.

      SUBSCRIPTION DETAILS:
      Plan: ${data.planName}
      Amount: ${data.amount}
      Next Billing: ${data.nextBillingDate}

      Manage your subscription in account settings.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<SubscriptionConfirmationData>,

  paymentConfirmation: {
    subject: '💳 Payment Confirmed - Thank You!',
    html: (data: PaymentConfirmationData) =>
      createEmailWrapper(`
      ${createHeader('Payment Confirmed')}
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">Hi ${data.name},</p>
        <p style="${emailStyles.text}">
          Great news! Your payment has been processed successfully. Thank you for your continued support! 💙
        </p>
        <div style="${emailStyles.infoBox}">
          <h3 style="margin: 0 0 16px 0; color: #667eea;">🧾 Payment Details:</h3>
          <table style="width: 100%; font-size: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #333;">Amount:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #667eea;">${data.amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #333;">Date:</td>
              <td style="padding: 8px 0;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #333;">Transaction ID:</td>
              <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 14px;">${data.transactionId}</td>
            </tr>
          </table>
        </div>
        <p style="${emailStyles.text}">
          Keep this email as your receipt. If you have any questions about this payment, please don't hesitate to contact us.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="${emailStyles.button}">
            📊 View Account Dashboard
          </a>
        </div>
      </div>
      ${createFooter()}
    `),
    text: (data: PaymentConfirmationData) => `
      💳 PAYMENT CONFIRMED

      Hi ${data.name},

      Your payment has been processed successfully!

      PAYMENT DETAILS:
      Amount: ${data.amount}
      Date: ${data.date}
      Transaction ID: ${data.transactionId}

      Keep this as your receipt.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<PaymentConfirmationData>,

  ratingNotification: {
    subject: '⭐ New Rating Received!',
    html: (data: RatingNotificationData) =>
      createEmailWrapper(`
      ${createHeader('New Rating Received')}
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">Hi ${data.name}!</p>
        <p style="${emailStyles.text}">
          Exciting news! You've received a new rating for your content. 🎉
        </p>
        <div style="${emailStyles.infoBox}">
          <h3 style="margin: 0 0 16px 0; color: #667eea;">📝 Rating Details:</h3>
          <p style="margin: 8px 0; font-size: 18px; font-weight: 600; color: #333;">
            "${data.contentTitle}"
          </p>
          <div style="${emailStyles.starRating}">
            ${'⭐'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)} (${data.rating}/5)
          </div>
          ${
            data.comment
              ? `
            <div style="background-color: #ffffff; border: 1px solid #e9ecef; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <p style="margin: 0; font-style: italic; color: #555;">"${data.comment}"</p>
            </div>
          `
              : ''
          }
        </div>
        <p style="${emailStyles.text}">
          Thank you for contributing valuable content to our community! Your ratings help others discover great content.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="${emailStyles.button}">
            👀 View Full Rating
          </a>
        </div>
      </div>
      ${createFooter()}
    `),
    text: (data: RatingNotificationData) => `
      ⭐ NEW RATING RECEIVED!

      Hi ${data.name}!

      You've received a new rating for "${data.contentTitle}".

      Rating: ${data.rating}/5 stars
      ${data.comment ? `Comment: "${data.comment}"` : ''}

      Thank you for contributing to our community!

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<RatingNotificationData>,

  chatRequest: {
    subject: '💬 New Chat Request from ${data.requesterName}',
    html: (data: ChatRequestData) =>
      createEmailWrapper(`
      ${createHeader('New Chat Request')}
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">Hi ${data.name}!</p>
        <p style="${emailStyles.text}">
          You have a new chat request from <strong>${data.requesterName}</strong>. They'd like to connect with you! 🤝
        </p>
        <div style="${emailStyles.infoBox}">
          <h3 style="margin: 0 0 16px 0; color: #667eea;">💌 Their Message:</h3>
          <div style="background-color: #ffffff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; font-style: italic;">
            "${data.message}"
          </div>
          <p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">
            — <strong>${data.requesterName}</strong>
          </p>
        </div>
        <p style="${emailStyles.text}">
          Building connections is what makes iRate special. Log in to respond to this chat request and start a conversation!
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="${emailStyles.button}">
            💬 Respond to Chat Request
          </a>
        </div>
        <p style="${emailStyles.text}; color: #888888; font-size: 14px;">
          You can manage your chat preferences in your account settings.
        </p>
      </div>
      ${createFooter()}
    `),
    text: (data: ChatRequestData) => `
      💬 NEW CHAT REQUEST

      Hi ${data.name}!

      You have a new chat request from ${data.requesterName}.

      Their message: "${data.message}"

      Log in to respond to this chat request.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<ChatRequestData>,
};

// SMS Templates (unchanged for brevity)
export const smsTemplates = {
  verification: {
    text: (data: SMSVerificationData) =>
      `Your iRate verification code is: ${data.otp}. Valid for 10 minutes.`,
  } as NotificationTemplate<SMSVerificationData>,

  passwordReset: {
    text: (data: SMSPasswordResetData) =>
      `Reset your iRate password: ${data.resetLink}. Link expires in 1 hour.`,
  } as NotificationTemplate<SMSPasswordResetData>,

  subscriptionConfirmation: {
    text: (data: SMSSubscriptionData) =>
      `Thank you for subscribing to iRate ${data.planName} plan. Amount: ${data.amount}`,
  } as NotificationTemplate<SMSSubscriptionData>,

  paymentConfirmation: {
    text: (data: PaymentConfirmationData) =>
      `Payment of ${data.amount} confirmed. Transaction ID: ${data.transactionId}`,
  } as NotificationTemplate<PaymentConfirmationData>,

  ratingNotification: {
    text: (data: RatingNotificationData) =>
      `New rating received for "${data.contentTitle}": ${data.rating}/5${data.comment ? ` - ${data.comment}` : ''}`,
  } as NotificationTemplate<RatingNotificationData>,

  chatRequest: {
    text: (data: ChatRequestData) => `New chat request from ${data.requesterName}: ${data.message}`,
  } as NotificationTemplate<ChatRequestData>,
};
