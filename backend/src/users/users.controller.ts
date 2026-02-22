import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('register')
    async register(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        const user = await this.usersService.create(name, email, password);
        return {id: user._id, name: user.name, email: user.email };
    }
    @Get('test')
test() {
  return 'users route working';
}
}
