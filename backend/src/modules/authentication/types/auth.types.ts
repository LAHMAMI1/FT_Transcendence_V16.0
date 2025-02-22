export interface RegistrationRequest {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}