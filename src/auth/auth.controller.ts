import { Body, Controller, Post, HttpStatus, ConflictException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authservice: AuthService) { }

    @Post('/signup')
    async signup(@Body() signupDto: SignUpDto): Promise<{ token: string }> {
        try {
            const result = await this.authservice.signUp(signupDto);
            return result; // Return the result directly
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException('Duplicate Email');
            }
            throw error;
        }
    }

    @Post('/login') // Changed from @Get to @Post
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.authservice.login(loginDto);
    }
}
