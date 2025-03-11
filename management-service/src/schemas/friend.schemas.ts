export const FriendRequestSchema = {
    body: {
        type: "object",
        required: ["userId", "friendId"],
        properties: {   
            userId: { type: "number" },
            friendId: { type: "number" },
        },
    },
};