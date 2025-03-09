export const CreateProfileSchema = {
    body: {
        type: "object",
        required: ["userId", "first_name", "last_name", "username"],
        properties: {
            userId: { type: "number" },
            first_name: { type: "string", minLength: 2 },
            last_name: { type: "string", minLength: 2 },
            username: { type: "string", minLength: 3 },
        },
    },
};

export const UpdateProfileSchema = {
    body: {
        type: "object",
        properties: {
            first_name: { type: "string", minLength: 2 },
            last_name: { type: "string", minLength: 2 },
            username: { type: "string", minLength: 3 },
            avatar: { type: "string" },
        },
    },
};