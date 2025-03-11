import { FastifyRequest, FastifyReply } from "fastify";
import { FriendRequest } from "../types/friend.types";
import { FriendService } from "../services/friend.service";

export class FriendController {
    private friendService = new FriendService;

    constructor() {
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.rejectFriendRequest = this.rejectFriendRequest.bind(this);
        this.getAllFriends = this.getAllFriends.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
    }

    async sendFriendRequest(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId, friendId } = request.body as FriendRequest;

            const friendRequest = await this.friendService.sendFriendRequest(userId, friendId);

            return reply.status(201).send({ message: "Friend request sent successfully", friendRequest });
        }
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async acceptFriendRequest(request: FastifyRequest, reply: FastifyReply) {
        try {
            const authUserId = (request.user as { userId: number }).userId;

            const { userId, friendId } = request.body as FriendRequest;

            if (userId !== authUserId)
                return reply.status(403).send({ error: "You are not authorized to accept this friend request" });

            const friendRequest = await this.friendService.acceptFriendRequest(userId, friendId);

            return reply.status(200).send({ message: "Friend request accepted successfully", friendRequest });
        }
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async rejectFriendRequest(request: FastifyRequest, reply: FastifyReply) {
        try {
            const authUserId = (request.user as { userId: number }).userId;

            const { userId, friendId } = request.body as FriendRequest;

            if (userId !== authUserId) 
                return reply.status(403).send({ error: "You are not authorized to reject this friend request" });
            

            const friendRequest = await this.friendService.rejectFriendRequest(userId, friendId);

            return reply.status(200).send({ message: "Friend request rejected successfully", friendRequest });
        }
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async getAllFriends(request: FastifyRequest, reply: FastifyReply) {
        try {
            const authUserId = (request.user as { userId: number }).userId;

            const friends = await this.friendService.getAllFriends(authUserId);

            return reply.status(200).send({ friends });
        }
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async removeFriend(request: FastifyRequest, reply: FastifyReply) {
        try {
            const authUserId = (request.user as { userId: number }).userId;

            const { userId, friendId } = request.body as FriendRequest;
            
            if (userId !== authUserId)
                return reply.status(403).send({ error: "You are not authorized to remove this friend request" });

            await this.friendService.removeFriend(userId, friendId);

            return reply.status(200).send({ message: "Friend removed successfully" });
        }
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }
}