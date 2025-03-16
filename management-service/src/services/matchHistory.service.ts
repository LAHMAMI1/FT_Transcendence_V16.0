import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MatchHistoryService {

    async createMatchHistory(playerId: number, opponentId: number, gameResult: string, playerScore: number, opponentScore: number) {

        const matchHistory = prisma.matchHistory.create({
            data: {
                playerId,
                opponentId,
                gameResult,
                playerScore,
                opponentScore,
            },
        });

        return matchHistory;
    }

    async getMatchHistory(userId: number) {
        const matchHistory = await prisma.matchHistory.findMany({
            where: {
                OR: [
                    { playerId: userId },
                    { opponentId: userId },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                playerId: true,
                opponentId: true,
                gameResult: true,
                playerScore: true,
                opponentScore: true,
                createdAt: true,
            },
        });

        return matchHistory;
    }

    async getMatchStats(userId: number) {
        const matchStats = await prisma.matchHistory.findMany({
            where: {
                OR: [
                    { playerId: userId },
                    { opponentId: userId },
                ],
            },
        });

        let wins = 0;
        let losses = 0;
        let draws = 0;
        for (const match of matchStats) {
            switch (match.gameResult) {
                case "win":
                    wins++;
                    break;
                case "loss":
                    losses++;
                    break;
                case "draw":
                    draws++;
                    break;
            }
        }

        return { stats: { wins, losses, draws } };
    }
}