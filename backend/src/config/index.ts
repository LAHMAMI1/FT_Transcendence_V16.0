// Configuration and environment variables loading
import dotenv from "dotenv";
dotenv.config();

export default {
    jwtSecret: process.env.JWT_SECRET as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    smtpHost: process.env.SMTP_HOST as string,
    smtpPort: process.env.SMTP_PORT as string,
    smtpsecure: process.env.SMTP_SECURE as string,
    smtpUser: process.env.SMTP_USER as string,
    smtpPass: process.env.SMTP_PASS as string,
}