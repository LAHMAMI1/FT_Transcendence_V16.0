import dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import { createUser, deleteUser, getAllUsers, loginUser, checkExistingUser} from "./services/userService";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { OAuth2Client } from "google-auth-library";
import { request } from "http";

const fastify = Fastify({ logger: true });

// PLugin registration
// Enable CORS to allow cross-origin requests (for development, we allow all origins)
fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
});
// Register the JWT plugin with a secret key.
fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
});

// Define TypeScript Interfaces for Requests
// Interface for user registration
interface RegisterUserRequest {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}
// Interface for login
interface LoginUserRequest {
    email: string;
    password: string;
}
// Interface for Google authentication
interface GoogleAuthRequest {
    idToken: string;
}

// Initialize Google OAuth Client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Define Routes
// Register a new user
fastify.post<{ Body: RegisterUserRequest }>("/register", async (request, reply) => {
    try {
        const { first_name, last_name, username, email, password } = request.body;
        if (await checkExistingUser(email, username)) {
            throw new Error("User with this email or username already exists");
        }
        const user = await createUser(first_name, last_name, username, email, password, "local");
        return { userId: user.id, message: "User created succesfully" };
    }
    catch (error: any) {
        return { message: error.message };
    }
});

// Login a user
fastify.post<{ Body: LoginUserRequest }>("/login", async (request, reply) => {
    try {
        const { email, password } = request.body;
        const user = await loginUser(email, password);
        // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
        const token = fastify.jwt.sign(
            { userId: user.id },
            { expiresIn: "1h" }
        );

        return { message: "Login successful!", token };
    }
    catch (error: any) {
        return { message: error.message }
    }
});

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

// Example Protected Route
// This route requires a valid JWT token to access.
fastify.get("/protected", async (request, reply) => {
    try {
        // If the token is invalid or missing jwtVerify will throw an error.
        await request.jwtVerify();
        return { message: "You are authenticated and can access this protected route!" };
    } catch (error: any) {
        return { message: "Unauthorized" };
    }
});

// Fetch all users
fastify.get("/users", async (request, reply) => {
    const users = await getAllUsers();
    return users;
});

// delete a user
fastify.delete<{ Params: { userId: string } }>("/users/:userId", async (request, reply) => {
    const userIdInt = parseInt(request.params.userId, 10);

    await deleteUser(userIdInt);
    return { message: "User deleted" };
})

// Start the server
fastify.listen({ port: 3000, host: "0.0.0.0" });
