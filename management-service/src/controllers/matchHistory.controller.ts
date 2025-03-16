import { FastifyRequest, FastifyReply } from "fastify";
import { MatchHistoryService } from "../services/matchHistory.service";
import { createMatchHistoryRequest } from "../types/matchHistory";

export class MatchHistoryController {
    private matchHistoryService = new MatchHistoryService;

    constructor() {
        this.createMatchHistory = this.createMatchHistory.bind(this);
        this.getMatchHistory = this.getMatchHistory.bind(this);
        this.getMatchStats = this.getMatchStats.bind(this);
    }

    async createMatchHistory(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { playerId, opponentId, gameResult, playerScore, opponentScore } = request.body as createMatchHistoryRequest;

            const matchHistory = await this.matchHistoryService.createMatchHistory(playerId, opponentId, gameResult, playerScore, opponentScore);

            return reply.status(201).send({ message: "Match history created successfully", matchHistory });
        } 
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async getMatchHistory(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request.user as { userId: number}).userId;

            const matchHistory = await this.matchHistoryService.getMatchHistory(userId);

            return reply.status(201).send({ message: "Match history retrieved successfully", matchHistory });
        } 
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async getMatchStats(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = (request.user as { userId: number}).userId;

            const matchStats = await this.matchHistoryService.getMatchStats(userId);

            return reply.status(201).send({ message: "Match stats retrieved successfully", matchStats });
        } 
        catch (error: any) {
            return reply.status(500).send({ message: error.message || "Internal Server Error" });
        }
    }
}