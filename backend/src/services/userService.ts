import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;  // Define the cost factor for bcrypt

export async function createUser(first_name: string, last_name: string, username: string, email: string, password: string) {
    // Hash the password before storing it
    const Hashedpassword = await bcrypt.hash(password, SALT_ROUNDS);

    return prisma.user.create
        ({
            data: {
                first_name,
                last_name,
                username,
                email,
                password: Hashedpassword
            }
        });
}

export async function getAllUsers() {
    return prisma.user.findMany
        ({
            select: {
                id: true,
                username: true,
                email: true
            }
        });
}

export async function deleteUser(userId: number) {
    return prisma.user.delete
        ({
            where: { id: userId }
        });
}
