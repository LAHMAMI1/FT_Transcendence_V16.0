import { FastifyInstance } from "fastify";
import { createUser, checkExistingUser } from "../services/userService";
import { OAuth2Client } from "google-auth-library";
import config from "../config";

// Interface for Google authentication
interface GoogleAuthRequest {
    idToken: string;
}

// Initialize Google OAuth Client
const GOOGLE_CLIENT_ID = config.googleClientId;
const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default async function oauthRoutes(fastify: FastifyInstance) {
    // Google authentication
    fastify.post<{ Body: GoogleAuthRequest }>("/oauth2/google", async (request, reply) => {
        try {
            const { idToken } = request.body;
            // Verify the Google ID token
            const ticket = await oauth2Client.verifyIdToken({
                idToken,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new Error("Invalid ID token");
            }

            const email = payload.email;
            const first_name = payload.given_name as string;
            const last_name = payload.family_name as string;

            let user = await checkExistingUser(email, "");
            // Check if the user already exists if not create a new user
            if (!user) {
                const username = email.split("@")[0];
                user = await createUser(first_name, last_name, username, email, "", "google");
            }

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = fastify.jwt.sign(
                { userId: user.id },
                { expiresIn: "1h" }
            );

            return { message: "Google authentication successful!", token };
        } 
        catch (error: any) {
            return { message: error.message }
        }
    });
}