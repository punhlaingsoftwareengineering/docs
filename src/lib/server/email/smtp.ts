import nodemailer from 'nodemailer';
import { EMAIL_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '$app/env/private';

const GMAIL_SMTP_HOST = 'smtp.gmail.com';
const GMAIL_SMTP_PORT = 587;

export function isSmtpConfigured(): boolean {
	return Boolean(SMTP_USER && SMTP_PASS);
}

export function getEmailFromAddress(): string {
	return EMAIL_FROM || SMTP_USER;
}

export function createSmtpTransport() {
	if (!SMTP_USER || !SMTP_PASS) {
		throw new Error('SMTP is not configured.');
	}

	return nodemailer.createTransport({
		host: SMTP_HOST || GMAIL_SMTP_HOST,
		port: SMTP_PORT ? Number(SMTP_PORT) : GMAIL_SMTP_PORT,
		secure: false,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS
		}
	});
}
