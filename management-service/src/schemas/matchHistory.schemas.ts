export const createMatchHistorySchema = {
    body: {
        type: "object",
        required: ["playerId", "opponentId", "gameResult", "playerScore", "opponentScore"],
        properties: {
            playerId: { type: "number" },
            opponentId: { type: "number" },
            gameResult: { type: "string" },
            playerScore: { type: "number" },
            opponentScore: { type: "number" },
        },
    },
};