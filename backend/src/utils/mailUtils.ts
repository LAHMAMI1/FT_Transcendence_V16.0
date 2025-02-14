import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: config.smtpsecure == 'false',
    auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
    },
});

export default transporter;