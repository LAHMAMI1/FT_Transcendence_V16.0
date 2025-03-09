export interface CreateProfileRequest {
    userId: number;
    first_name: string;
    last_name: string;
    username: string;
}

export interface UpdateProfileRequest {
    first_name?: string;
    last_name?: string;
    username?: string;
    avatar?: string;
}