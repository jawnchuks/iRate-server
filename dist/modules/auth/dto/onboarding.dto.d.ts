declare class LocationDto {
    latitude: number;
    longitude: number;
}
export declare class OnboardingDto {
    bio: string;
    interests: string[];
    profilePicture?: string;
    location?: LocationDto;
}
export {};
