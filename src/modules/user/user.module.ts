import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { AuthModule } from '../auth/auth.module';
import { DynamoDBModule } from '../../database/dynamodb/dynamodb.module';

@Module({
  imports: [DynamoDBModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserResolver],
  exports: [UserService, UserRepository],
})
export class UserModule {}
