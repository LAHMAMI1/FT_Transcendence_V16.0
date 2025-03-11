import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FriendService {
    // Send a friend request
    async sendFriendRequest(userId: number, friendId: number) {
        return prisma.friend.create({
            data: {
                userId,
                friendId,
                status: "pending",
            },
        });
    }

    // Accept a friend request
    async acceptFriendRequest(userId: number, friendId: number) {
        // Find the friend request with either user order
        const friendRequest = await prisma.friend.findFirst({
            where: {
                OR: [
                    {
                        userId: friendId,
                        friendId: userId,
                    },
                    {
                        userId: userId,
                        friendId: friendId,
                    }
                ],
                status: "pending",
            }
        });

        if (!friendRequest)
            throw new Error("Friend request not found");

        return prisma.friend.update({
            where: {
                UserFriendUnique: {
                    userId: friendRequest.userId,
                    friendId: friendRequest.friendId,
                },
            },
            data: {
                status: "accepted",
            },
        });
    }
      

    // Reject a friend request
    async rejectFriendRequest(userId: number, friendId: number) {
        // Find the friend request with either user order
        const friendRequest = await prisma.friend.findFirst({
            where: {
                OR: [
                    {
                        userId: friendId,
                        friendId: userId,
                    },
                    {
                        userId: userId,
                        friendId: friendId,
                    }
                ],
                status: "pending",
            }
        });

        if (!friendRequest)
            throw new Error("Friend request not found");

        return prisma.friend.update({
            where: {
                UserFriendUnique: {
                    userId: friendRequest.userId,
                    friendId: friendRequest.friendId,
                },
            },
            data: {
                status: "rejected",
            },
        });
    }

    // Get all friends
    async getAllFriends(userId: number) {
        const friends = await prisma.friend.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { friendId: userId }
                ],
                status: "accepted",
            },
            include: {
                user: {
                    select: {
                        username: true,
                        authUserId: true
                    }
                },
                friend: {
                    select: {
                        username: true,
                        authUserId: true
                    }
                }
            }
        });

        return friends.map(friendship => {
            // If userId matches our parameter, return the friend's data
            // Otherwise, return the user's data
            const friendData = friendship.userId === userId 
                ? { id: friendship.friend.authUserId, username: friendship.friend.username }
                : { id: friendship.user.authUserId, username: friendship.user.username };
                
            return friendData;
        });
    }

    // Remove a friend
    async removeFriend(userId: number, friendId: number) {
        // Find the friendship with either user order
        const friendship = await prisma.friend.findFirst({
            where: {
                OR: [
                    {
                        userId: friendId,
                        friendId: userId,
                    },
                    {
                        userId: userId,
                        friendId: friendId,
                    }
                ],
            }
        });

        if (!friendship)
            throw new Error("Friendship not found");

        return prisma.friend.delete({
            where: {
                UserFriendUnique: {
                    userId: friendship.userId,
                    friendId: friendship.friendId,
                },
            },
        });
    }
}