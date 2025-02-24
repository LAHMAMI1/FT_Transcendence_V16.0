export const EnableTotpSchema = {
    body: {
        type: "object",
        required: ["secret", "token"],
        properties: {
            secret: { type: "string", minLength: 16 }, // Base32 Secret Length
            token: { type: "string", minLength: 6, maxLength: 6 },
        },
    },
};

export const VerifyTotpSchema = {
    body: {
        type: "object",
        required: ["tempToken", "twoFactorToken"],
        properties: {
            tempToken: { type: "string", minLength: 10 },
            twoFactorToken: { type: "string", minLength: 6, maxLength: 6 },
        },
    },
};


export const VerifyEmailSchema = {
    body: {
        type: "object",
        required: ["tempToken", "code"],
        properties: {
            tempToken: { type: "string", minLength: 10 },
            code: { type: "string", minLength: 6, maxLength: 6 },
        },
    },
};