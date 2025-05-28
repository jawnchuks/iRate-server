export interface VerificationEmailData {
  otp: string;
  name?: string;
}

export interface WelcomeEmailData {
  name: string;
}

export type EmailTemplateData = VerificationEmailData | WelcomeEmailData;

export interface EmailTemplate {
  subject: string;
  html: (data: EmailTemplateData) => string;
  text: (data: EmailTemplateData) => string;
}
