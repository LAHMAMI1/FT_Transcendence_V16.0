import { PrismaClient } from "@prisma/client";
import axios from "axios";
import argon2 from "argon2";
import { OAuth2Client } from "google-auth-library";
import env from "../config/env";

const prisma = new PrismaClient();

export class authService {

    // registeration services
    async checkExistingUser(email: string, username: string) {
        return prisma.authUser.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
    }

    async createUser(username: string, email: string, password: string, oauth_provider: string) {

        // Hash the password before storing it
        const Hashedpassword = await argon2.hash(password);

        return prisma.authUser.create
            ({
                data: {
                    username,
                    email,
                    password: Hashedpassword,
                    oauth_provider,
                }
            });
    }

    // Send user information to the management service
    async sendUserInfo(userId: number, first_name: string, last_name: string, username: string) {
        try {
            await axios.post(`${env.managementServiceUrl}/profile`, {
                userId,
                first_name, 
                last_name,
                username
            }, {timeout: 5000});

            return true;
        }
        catch (error: any) {
            return false;
        }
    }

    // login services
    async loginUser(email: string, password: string) {
    
        // check for existing email
        const user = await prisma.authUser.findUnique({
            where: { email }
        });
    
        if (!user)
            throw {
                statusCode: 404,
                message: "Email not found, You may want to register"
            }
    
        // check for the password
        const validPassword = await argon2.verify(user.password, password);
    
        if (!validPassword)
            throw {
                statusCode: 401,
                message: "Password Incorrect"
            }
    
        return (user);
    }

    // google auth services
    async verifyGoogleToken(idToken: string) {

        // Initialize Google OAuth Client
        const GOOGLE_CLIENT_ID = env.googleClientId;
        const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

        // Verify the Google ID token
        const ticket = await oauth2Client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw {
                statusCode: 401,
                message: "Invalid ID token"
            }
        }

        const email = payload.email;
        const first_name = payload.given_name as string;
        const last_name = payload.family_name as string;

        let user = await this.checkExistingUser(email, "");
        // Check if the user already exists if not create a new user
        if (!user) {
            const username = email.split("@")[0];
            user = await this.createUser(username, email, "", "google");
            await this.sendUserInfo(user.id, first_name, last_name, username);
        }

        return (user);
    }
}