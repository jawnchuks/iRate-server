import { AuthService } from "../services";
import { RegisterDto, LoginDto, PhoneVerificationDto, OnboardingDto } from "../dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
            user: {
                id: any;
                email: any;
                username: any;
            };
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
            user: {
                id: any;
                email: any;
                username: any;
            };
        };
    }>;
    sendPhoneOTP(body: PhoneVerificationDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    verifyPhoneOTP(body: PhoneVerificationDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
            user: {
                id: any;
                phoneNumber: any;
                username: any;
            };
        };
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    completeOnboarding(req: any, onboardingDto: OnboardingDto): Promise<{
        success: boolean;
        data: {
            id: any;
            bio: any;
            interests: any;
            profilePicture: any;
            location: any;
        };
    }>;
}
