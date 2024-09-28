import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { FilesService } from '../files/files.service';

@Controller()
export class UserHttpController {
  constructor(
    private readonly userService: UsersService,
    private readonly fileService: FilesService,
  ) {}
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: string,
  ) {
    const containerName = 'fileupload';
    const upload = await this.fileService.uploadFileHttp(file, containerName);
    this.userService.saveUrl(id, upload, containerName);
    return { upload, message: 'uploaded successfully' };
  }

  @Delete('remove-image/:id')
  async remove(@Param('id') id: string) {
    const containerName = 'fileupload';
    const user = await this.userService.remove(id, containerName);
    return {
      user,
      message: 'deleted successfully',
    };
  }
}