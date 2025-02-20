// Configurations for nodemailer
import nodemailer from "nodemailer";
import config from "./env";

const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: config.smtpsecure == 'true',
    auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
    },
});

export default transporter;