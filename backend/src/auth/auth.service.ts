import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      console.log('Login attempt for email:', loginDto.email);
      
      const user = await this.usersService.findByEmail(loginDto.email);
      
      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException('Identifiants invalides');
      }

      console.log('User found:', { id: user.id, email: user.email });
      
      let isPasswordValid = false;

      // Essayons d'abord une comparaison directe
      if (loginDto.password === user.password) {
        console.log('Password matched directly');
        isPasswordValid = true;
      } else {
        // Si ce n'est pas égal, essayons de comparer avec bcrypt
        try {
          isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
          console.log('Password bcrypt comparison result:', isPasswordValid);
        } catch (error) {
          console.error('Password comparison error:', error);
        }
      }

      if (!isPasswordValid) {
        console.log('Password validation failed');
        throw new UnauthorizedException('Identifiants invalides');
      }

      const payload = { 
        email: user.email, 
        sub: user.id,    // Assurez-vous que c'est un nombre
        username: user.username 
      };

      console.log('Creating JWT with payload:', payload);
      
      const access_token = await this.jwtService.signAsync(payload);
      
      console.log('JWT token created successfully');

      const response = {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      };

      console.log('Login successful, returning response');
      return response;

    } catch (error) {
      console.error('Login process error:', error);
      throw error;
    }
  }
}