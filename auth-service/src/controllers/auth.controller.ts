import { FastifyRequest, FastifyReply } from "fastify";
import { RegistrationRequest, LoginRequest } from "../types/auth.types";
import { authService } from "../services/auth.service";

export class authController {
    private authService = new authService();

    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.googleAuth = this.googleAuth.bind(this);
    }

    // Register a new user
    async register(request: FastifyRequest<{ Body: RegistrationRequest }>, reply: FastifyReply) {
        try {
            const { first_name, last_name, username, email, password } = request.body;
            if (await this.authService.checkExistingUser(email, username))
                return reply.code(409).send({ message: "User with this email or username already exists" });

            // Create a new user
            const user = await this.authService.createUser(username, email, password, "");
            // Send user information to the management service
            if (!await this.authService.sendUserInfo(user.id, first_name, last_name, username))
                return reply.code(500).send({ message: "Failed to send user information to the management service" });
            // Send user information to the twofa service
            if (!await this.authService.sendTwoFaInfo(user.id, email, false))
                return reply.code(500).send({ message: "Failed to send user information to the twofa service" });

            return reply.code(201).send({ userId: user.id, message: "User created succesfully" });
        }
        catch (error: any) {
            return reply.code(500).send({ message: "Internal Server Error", error: error.message });
        }
    }

    // Login a user
    async login(request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) {
        try {
            const { email, password } = request.body;

            const user = await this.authService.loginUser(email, password);

            if (user.two_factor_enabled) {

                const tempToken = request.server.jwt.sign(
                    {
                        userId: user.id,
                        username: user.username,
                        towFactor: true,
                    },
                    { expiresIn: "5m" }
                );

                return reply.code(401).send({ message: "2FA required", tempToken });
            };

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = request.server.jwt.sign(
                { 
                    userId: user.id,
                    username: user.username, 
                },
                { expiresIn: "1h" }
            );

            return reply.code(200).send({ message: "Login successful!", token });
        }
        catch (error: any) {
            return reply.code(error.statusCode || 500).send({ message: error.message || "Internal Server Error" });
        }
    }

    // Google authentication
    async googleAuth(request: FastifyRequest<{ Body: { idToken: string } }>, reply: FastifyReply) {
        try {
            const { idToken } = request.body;
            
            const user = await this.authService.verifyGoogleToken(idToken);

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = request.server.jwt.sign(
                { 
                    userId: user.id,
                    username: user.username, 
                },
                { expiresIn: "1h" }
            );

            return reply.code(200).send({ message: "Google authentication successful!", token });
        }
        catch (error: any) {
            return reply.code(error.statusCode || 500).send({ message: error.message || "Internal Server Error" });
        }
    }
}