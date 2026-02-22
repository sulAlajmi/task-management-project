import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    
    async create(name: string, email: string, password: string): Promise<UserDocument> {
        if (password == null || typeof password !== 'string' || !password.trim()) {
            throw new BadRequestException('Password is required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({name, email, password: hashedPassword});
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({email}).exec();
    }
}
