export interface EnableTOTPRequest {
    secret: string;
    token: string;
}

export interface VerifyTOTPRequest {
    tempToken: string;
    twoFactorToken: string;
}

export interface VerifyEmailRequest {
    tempToken: string;
    code: string;
}