export const RegistrationUserSchema = {
    body: {
        type: "object",
        required: ["first_name", "last_name", "username", "email", "password"],
        properties: {
            first_name: { type: "string", minLength: 2 },
            last_name: { type: "string", minLength: 2 },
            username: { type: "string", minLength: 3 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
        },
    },
};

export const LoginSchema = {
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
        },
    },
};

export const GoogleAuthSchema = {
    body: {
        type: "object",
        required: ["idToken"],
        properties: {
            idToken: { type: "string", minLength: 10 },
        },
    },
};