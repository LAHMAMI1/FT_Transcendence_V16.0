import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class WebSocketService {
    // In-memory map for active connections
    private connectedUsers = new Map<number, any>();

    async markOnline(userId: number) {
        await prisma.manageUser.update({
            where: { authUserId: userId },
            data: { isOnline: true, lastSeen: new Date() },
        });

        // Broadcast online status to friends
        await this.broadcastStatusUpdate(userId, "online");
    }

    storeConnection(userId: number, connection: any) {
        this.connectedUsers.set(userId, connection);
    }

    removeConnection(userId: number) {
        this.connectedUsers.delete(userId);
    }

    isConnected(userId: number) {
        return this.connectedUsers.has(userId);
    }

    async markOffline(userId: number) {
        await prisma.manageUser.update({
            where: { authUserId: userId },
            data: { isOnline: false, lastSeen: new Date() },
        });

        // Broadcast offline status to friends
        await this.broadcastStatusUpdate(userId, "offline");
    }

    // Broadcast status update to all friends of the user
    async broadcastStatusUpdate(userId: number, status: string) {
        const friendships = await prisma.friend.findMany({
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

        for (const friendship of friendships) {
            // If userId matches our parameter, return the friend's data
            // Otherwise, return the user's data
            const friend = friendship.userId === userId
                ? { id: friendship.friend.authUserId, username: friendship.friend.username }
                : { id: friendship.user.authUserId, username: friendship.user.username };

            const friendConnection = this.connectedUsers.get(friend.id);
            if (friendConnection) {
                // Send a status update message to the friend
                friendConnection.send(JSON.stringify({
                    event: "statusUpdate",
                    username: friend.username,
                    userId: userId,
                    status: status,
                }));
            }
        }
    }
}