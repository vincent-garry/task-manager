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
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    let isPasswordValid = false;

    // Essayons d'abord une comparaison directe (si le mot de passe est en clair)
    if (loginDto.password === user.password) {
      isPasswordValid = true;
    } else {
      // Si ce n'est pas égal, essayons de comparer avec bcrypt
      try {
        isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      } catch (error) {
        console.log('Erreur de comparaison de mot de passe:', error);
      }
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
      username: user.username 
    };

    const access_token = await this.jwtService.signAsync(payload);
    
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  }
}