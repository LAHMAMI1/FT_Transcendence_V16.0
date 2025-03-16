export interface createMatchHistoryRequest {
    playerId: number;
    opponentId: number;
    gameResult: string;
    playerScore: number;
    opponentScore: number;
}