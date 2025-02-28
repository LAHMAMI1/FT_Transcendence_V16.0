// Configuration and environment variables loading
import dotenv from "dotenv";
dotenv.config();

export default {
    jwtSecret: process.env.JWT_SECRET as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    managementServiceUrl: process.env.MANAGEMENT_SERVICE_URL as string,
}