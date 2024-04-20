import {
  Controller,
  Request,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserInfoRequestDto } from './dto/http/create-user-info-request.dto';
import { CreateUserInfoResponseDto } from './dto/http/create-user-info-response.dto';
import { GetUserInfoResponseDto } from './dto/http/get-user-info-response.dto';
import { UpdateUserInfoRequestDto } from './dto/http/update-user-info-request.dto';
import { UpdateUserInfoResponseDto } from './dto/http/update-user-info-response.dto';
import { GetUserTestQueryDto } from './dto/http/get-user-test-query.dto';
import { GetUserTestListResponseDto } from './dto/http/get-user-test-list-response.dto';
import { TestLevel, Order } from '../test/test.entity';
import { UnauthorizedErrorDto } from 'src/core/dto/unauthorized-error.dto';

@ApiTags('users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 정보 조회', description: '' })
  @ApiResponse({ status: 200, description: 'OK', type: GetUserInfoResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedErrorDto,
  })
  @HttpCode(HttpStatus.OK)
  async getUser(@Request() req) {
    const id = req.user.id;
    return await this.userService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: '회원가입', description: '유저 정보 등록' })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: CreateUserInfoResponseDto,
  })
  // @ApiResponse({ status: 400, description: 'Bad request'})
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserInfoDto: CreateUserInfoRequestDto) {
    return await this.userService.create(createUserInfoDto);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 정보 수정', description: '' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: UpdateUserInfoResponseDto,
  })
  // @ApiResponse({ status: 400, description: 'Bad request'})
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Request() req,
    @Body() updateUserInfoDto: UpdateUserInfoRequestDto,
  ) {
    const id = req.user.id;
    return await this.userService.update(id, updateUserInfoDto);
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 테스트 리스트 정보 조회', description: '' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: GetUserTestListResponseDto,
  })
  // @ApiResponse({ status: 403, description: 'Forbidden.'})
  @HttpCode(HttpStatus.OK)
  async geteUserTestList(
    @Request() req: any,
    @Query() query: GetUserTestQueryDto,
  ) {
    const id = req.user.id;
    // set query params
    query.order = query.order || Order.Desc;
    query.level = query.level || TestLevel.All;
    return await this.userService.getUserTest(id, query);
  }
}
