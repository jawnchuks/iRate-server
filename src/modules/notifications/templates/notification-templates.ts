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
  otp: string;
}

export interface SMSPasswordResetData {
  resetLink: string;
}

export interface SMSSubscriptionData {
  planName: string;
  amount: string;
}

// Email Templates
export const emailTemplates = {
  verification: {
    subject: 'Verify Your Email',
    html: (data: VerificationData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to iRate!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for signing up. Please use the following code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          ${data.otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <p>Best regards,<br>The iRate Team</p>
      </div>
    `,
    text: (data: VerificationData) => `
      Welcome to iRate!

      Hi ${data.name},

      Thank you for signing up. Please use the following code to verify your email address:

      ${data.otp}

      This code will expire in 10 minutes.

      If you didn't request this verification, please ignore this email.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<VerificationData>,

  welcome: {
    subject: 'Welcome to iRate!',
    html: (data: WelcomeData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to iRate!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for joining iRate! We're excited to have you on board.</p>
        <p>With iRate, you can:</p>
        <ul>
          <li>Rate and review your favorite content</li>
          <li>Connect with other users</li>
          <li>Discover new content based on your preferences</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The iRate Team</p>
      </div>
    `,
    text: (data: WelcomeData) => `
      Welcome to iRate!

      Hi ${data.name},

      Thank you for joining iRate! We're excited to have you on board.

      With iRate, you can:
      - Rate and review your favorite content
      - Connect with other users
      - Discover new content based on your preferences

      If you have any questions, feel free to reach out to our support team.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<WelcomeData>,

  passwordReset: {
    subject: 'Reset Your Password',
    html: (data: PasswordResetData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>Best regards,<br>The iRate Team</p>
      </div>
    `,
    text: (data: PasswordResetData) => `
      Password Reset Request

      Hi ${data.name},

      We received a request to reset your password. Click the link below to reset it:

      ${data.resetLink}

      This link will expire in 1 hour.

      If you didn't request this reset, please ignore this email.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<PasswordResetData>,

  subscriptionConfirmation: {
    subject: 'Subscription Confirmation',
    html: (data: SubscriptionConfirmationData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Subscription Confirmed!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for subscribing to our ${data.planName} plan.</p>
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
          <p><strong>Plan:</strong> ${data.planName}</p>
          <p><strong>Amount:</strong> ${data.amount}</p>
          <p><strong>Next Billing Date:</strong> ${data.nextBillingDate}</p>
        </div>
        <p>You can manage your subscription in your account settings.</p>
        <p>Best regards,<br>The iRate Team</p>
      </div>
    `,
    text: (data: SubscriptionConfirmationData) => `
      Subscription Confirmed!

      Hi ${data.name},

      Thank you for subscribing to our ${data.planName} plan.

      Plan: ${data.planName}
      Amount: ${data.amount}
      Next Billing Date: ${data.nextBillingDate}

      You can manage your subscription in your account settings.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<SubscriptionConfirmationData>,

  paymentConfirmation: {
    subject: 'Payment Confirmation',
    html: (data: PaymentConfirmationData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Confirmed</h2>
        <p>Hi ${data.name},</p>
        <p>Your payment has been processed successfully.</p>
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
          <p><strong>Amount:</strong> ${data.amount}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
        </div>
        <p>Thank you for your business!</p>
        <p>Best regards,<br>The iRate Team</p>
      </div>
    `,
    text: (data: PaymentConfirmationData) => `
      Payment Confirmed

      Hi ${data.name},

      Your payment has been processed successfully.

      Amount: ${data.amount}
      Date: ${data.date}
      Transaction ID: ${data.transactionId}

      Thank you for your business!

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<PaymentConfirmationData>,

  ratingNotification: {
    subject: 'New Rating Received',
    html: (data: RatingNotificationData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Rating Received</h2>
        <p>Hi ${data.name},</p>
        <p>You've received a new rating for "${data.contentTitle}".</p>
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
          <p><strong>Rating:</strong> ${data.rating}/5</p>
          ${data.comment ? `<p><strong>Comment:</strong> ${data.comment}</p>` : ''}
        </div>
        <p>Thank you for your contribution to our community!</p>
        <p>Best regards,<br>The iRate Team</p>
      </div>
    `,
    text: (data: RatingNotificationData) => `
      New Rating Received

      Hi ${data.name},

      You've received a new rating for "${data.contentTitle}".

      Rating: ${data.rating}/5
      ${data.comment ? `Comment: ${data.comment}` : ''}

      Thank you for your contribution to our community!

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<RatingNotificationData>,

  chatRequest: {
    subject: 'New Chat Request',
    html: (data: ChatRequestData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Chat Request</h2>
        <p>Hi ${data.name},</p>
        <p>You have a new chat request from ${data.requesterName}.</p>
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
        <p>Log in to your account to respond to this request.</p>
        <p>Best regards,<br>The iRate Team</p>
      </div>
    `,
    text: (data: ChatRequestData) => `
      New Chat Request

      Hi ${data.name},

      You have a new chat request from ${data.requesterName}.

      Message: ${data.message}

      Log in to your account to respond to this request.

      Best regards,
      The iRate Team
    `,
  } as NotificationTemplate<ChatRequestData>,
};

// SMS Templates
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
