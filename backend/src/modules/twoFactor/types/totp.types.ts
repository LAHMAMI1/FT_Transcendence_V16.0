export interface EnableTOTPRequest {
    secret: string;
    token: string;
}

export interface VerifyTOTPRequest {
    tempToken: string;
    twoFactorToken: string;
}