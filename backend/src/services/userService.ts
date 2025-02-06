import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(first_name: string, last_name: string, username: string, email: string, password: string) {
    return prisma.user.create({
        data: { first_name, last_name, username, email, password }
    });
}

export async function getAllUsers() {
    return prisma.user.findMany({
        select: { id: true, username: true, email: true }
    });
}
