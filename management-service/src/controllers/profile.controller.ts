import { FastifyRequest, FastifyReply } from "fastify";
import { CreateProfileRequest, UpdateProfileRequest } from "../types/profile.types";
import { profileService } from "../services/profile.service";

export class profileController {
    private profileService = new profileService();

    constructor() {
        this.createProfile = this.createProfile.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    // Create a new profile
    async createProfile(request: FastifyRequest<{ Body: CreateProfileRequest }>, reply: FastifyReply) {
        try {
            const { userId, first_name, last_name, username } = request.body;
            // Create a profile record in Management DB
            await this.profileService.createProfile(userId, first_name, last_name, username);
            
            return reply.code(200).send({ message: "Profile created" });
        }
        catch (error: any) {
            return reply.code(500).send({ message: "Failed to create the profile" });
        }
    }

    // Get a profile by userId
    async getProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId } = request.params as { userId: string };

            // Get the profile record from Management DB
            const profile = await this.profileService.getProfile(userId);
            if (!profile)
                return reply.code(404).send({ message: "Profile not found" });

            return reply.code(200).send(profile);
        }
        catch (error: any) {
            return reply.code(500).send({ message: "Failed to get the profile" });
        }
    }

    // Update profile route
    async updateProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId } = request.params as { userId: string };
            const { first_name, last_name, username, avatar } = request.body as UpdateProfileRequest;

            // Update the profile record in Management DB
            const updatedProfile = await this.profileService.updateProfile(userId, first_name, last_name, username, avatar);
            if (!updatedProfile)
                return reply.code(404).send({ message: "Profile not found" });

            return reply.code(200).send({ message: "Profile updated", updatedProfile });
        } catch (error: any) {
            return reply.code(500).send({ message: "Failed to update the profile" });
        }
    }
}