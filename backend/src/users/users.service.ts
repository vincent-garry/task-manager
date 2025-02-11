import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ where: { email } });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.userModel.create({
          ...createUserDto,
          password: hashedPassword,
        });
    }

    async updateProfile(userId: number, updateData: { username?: string; email?: string }) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
          throw new NotFoundException('Utilisateur non trouvé');
        }
    
        // Vérifier si l'email est déjà utilisé
        if (updateData.email) {
          const existingUser = await this.userModel.findOne({
            where: { email: updateData.email }
          });
          if (existingUser && existingUser.id !== userId) {
            throw new Error('Cet email est déjà utilisé');
          }
        }
    
        await user.update(updateData);
        return user;
      }

      async updatePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
          throw new NotFoundException('Utilisateur non trouvé');
        }
    
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          throw new Error('Mot de passe actuel incorrect');
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        return true;
      }
}