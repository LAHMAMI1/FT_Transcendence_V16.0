import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class profileService {
    // Create a new profile
    async createProfile(userId: number, first_name: string, last_name: string, username: string) {
        return prisma.manageUser.create({
            data: { 
                authUserId: userId, 
                first_name, 
                last_name, 
                username 
            },
        });
    }

    // Get the profile
    async getProfile(userId: string) {
        return prisma.manageUser.findUnique({
            where: {
                authUserId: Number(userId)
            },
        });
    }

    // Update the profile
    async updateProfile(userId: string, first_name?: string, last_name?: string, username?: string, avatar?: string) {
        return prisma.manageUser.update({
            where: {
                authUserId: Number(userId)
            },
            data: {
                first_name,
                last_name,
                username,
                avatar
            },
        });
    }
}