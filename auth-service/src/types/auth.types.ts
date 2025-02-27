export interface RegistrationRequest {
    email: string;
    password: string;
    // Data for the user profile, which is owned by User Management Service
    first_name: string;
    last_name: string;
    username: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}