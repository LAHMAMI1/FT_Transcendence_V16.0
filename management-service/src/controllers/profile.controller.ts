import { FastifyRequest, FastifyReply } from "fastify";
import { CreateProfileRequest, UpdateProfileRequest } from "../types/profile.types";
import { ProfileService } from "../services/profile.service";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

export class ProfileController {
    private profileService = new ProfileService();

    constructor() {
        this.createProfile = this.createProfile.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
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
            const { first_name, last_name, username } = request.body as UpdateProfileRequest;

            // Update the profile record in Management DB
            const updatedProfile = await this.profileService.updateProfile(userId, first_name, last_name, username);
            if (!updatedProfile)
                return reply.code(404).send({ message: "Profile not found" });

            return reply.code(200).send({ message: "Profile updated", updatedProfile });
        }
        catch (error: any) {
            return reply.code(500).send({ message: "Failed to update the profile" });
        }
    }

    // Upload avatar route
    async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId, username } = request.user as { userId: number; username: string };

            const fileData = await request.file();
            if (!fileData || fileData.fieldname !== "avatar")
                return reply.status(400).send({ error: "No avatar file provided" });
              
            const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedMimeTypes.includes(fileData.mimetype))
                return reply.status(400).send({ error: "Invalid file type. Only JPEG, PNG, and GIF are allowed." });

            const uploadDir = "./avatars";
            await fs.promises.mkdir(uploadDir, { recursive: true });

            const fileExtension = fileData.filename.substring(fileData.filename.lastIndexOf("."));
            const fileName = `avatar-${username}${fileExtension}`;
            const filePath = `${uploadDir}/${fileName}`;

            const writeStream = fs.createWriteStream(filePath);
            await pipelineAsync(fileData.file, writeStream);

            await this.profileService.uploadAvatar(userId, filePath);

            return reply.code(200).send({ message: "Avatar uploaded successfully", filePath });
        } 
        catch (error: any) {
            return reply.code(500).send({ message: "Failed to upload the avatar" });
        }
    }
}