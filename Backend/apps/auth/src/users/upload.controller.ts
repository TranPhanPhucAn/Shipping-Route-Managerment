import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { FilesService } from '../files/files.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guards';
import { GraphQLError } from 'graphql';

@Controller()
export class UserHttpController {
  constructor(
    private readonly userService: UsersService,
    private readonly fileService: FilesService,
  ) {}
  @Post('upload-image')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: string,
    @Req() request: Request,
  ) {
    if (request['user'].userId != id) {
      throw new GraphQLError('You can not update other avatar', {
        extensions: {
          errorCode: '5001-15',
        },
      });
    }
    const containerName = 'fileupload';
    const upload = await this.fileService.uploadFileHttp(file, containerName);
    this.userService.saveUrl(id, upload, containerName);
    return { upload, message: 'uploaded successfully' };
  }

  @Delete('remove-image/:id')
  @UseGuards(JwtAccessGuard)
  async remove(@Param('id') id: string, @Req() request: Request) {
    if (request['user'].userId != id) {
      throw new GraphQLError('You delete other avatar', {
        extensions: {
          errorCode: '5001-16',
        },
      });
    }
    const containerName = 'fileupload';
    const user = await this.userService.remove(id, containerName);
    return {
      user,
      message: 'deleted successfully',
    };
  }
}
