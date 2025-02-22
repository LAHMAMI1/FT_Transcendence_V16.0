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
                throw new Error("User with this email or username already exists");

            const user = await this.authService.createUser(first_name, last_name, username, email, password, "local");
            return reply.send({ userId: user.id, message: "User created succesfully" });
        }
        catch (error: any) {
            return { message: error.message };
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
                        towFactor: true,
                    },
                    { expiresIn: "5m" }
                );

                return { message: "2FA required", tempToken };
            };

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = request.server.jwt.sign(
                { userId: user.id },
                { expiresIn: "1h" }
            );

            return reply.send({ message: "Login successful!", token });
        }
        catch (error: any) {
            return { message: error.message }
        }
    }

    // Google authentication
    async googleAuth(request: FastifyRequest<{ Body: { idToken: string } }>, reply: FastifyReply) {
        try {
            const { idToken } = request.body;
            
            const user = await this.authService.verifyGoogleToken(idToken);

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = request.server.jwt.sign(
                { userId: user.id },
                { expiresIn: "1h" }
            );

            return reply.send({ message: "Google authentication successful!", token });
        }
        catch (error: any) {
            return { message: error.message }
        }
    }
}