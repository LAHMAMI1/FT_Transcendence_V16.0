import { FastifyInstance } from "fastify";
import { createUser, checkExistingUser, loginUser } from "../services/userService";

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

export default async function userRoutes(fastify: FastifyInstance) {
    // Register a new user
    fastify.post<{ Body: RegisterUserRequest }>("/register", async (request, reply) => {
        try {
            const { first_name, last_name, username, email, password } = request.body;
            if (await checkExistingUser(email, username))
                throw new Error("User with this email or username already exists");

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

            if (user.two_factor_enabled) {

                const tempToken = fastify.jwt.sign(
                    { userId: user.id,
                      towFactor: true,
                    },
                    { expiresIn: "5m" }
                );

                return { message: "2FA required", tempToken };
            };

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
}