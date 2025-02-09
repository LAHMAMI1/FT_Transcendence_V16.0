import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

export async function checkExistingUser(email: string, username: string) {
    return prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });
}

export async function createUser(first_name: string, last_name: string, username: string, email: string, password: string, oauth_provider: string) {

    // Hash the password before storing it
    const Hashedpassword = await argon2.hash(password);

    return prisma.user.create
        ({
            data: {
                first_name,
                last_name,
                username,
                email,
                password: Hashedpassword,
                oauth_provider,
            }
        });
}

export async function loginUser(email: string, password: string) {

    // check for existing email
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user)
        throw new Error("Email not found, You may want to register");

    // check for the password
    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword)
        throw new Error("Password Incorrect");

    return (user);
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
