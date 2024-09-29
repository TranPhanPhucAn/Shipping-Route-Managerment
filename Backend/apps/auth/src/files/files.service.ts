import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { uuid } from 'uuidv4';

@Injectable()
export class FilesService {
  private containerName: string;

  private async getBlobServiceInstance() {
    const connectionString = process.env.CONNECTION_STRING_AZURE;
    const blobClientService =
      await BlobServiceClient.fromConnectionString(connectionString);
    return blobClientService;
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerName = this.containerName;
    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    return blockBlobClient;
  }

  public async uploadFile(file: any, containerName: string) {
    const { createReadStream, mimetype, filename } = await file;
    const test = await file;
    this.containerName = containerName;
    // const extension = file.originalname.split('.').pop();
    console.log('mimetype, filename: ', test);

    const extension = filename.split('.').pop().toLowerCase();

    console.log('mimetype, filename: ', mimetype, filename);
    const file_name = uuid() + '.' + extension;
    const blockBlobClient = await this.getBlobClient(file_name);
    // const fileUrl = blockBlobClient.url;
    // await blockBlobClient.uploadData(file.buffer);
    const stream = createReadStream();
    const contentType = mimetype || 'application/octet-stream';
    await blockBlobClient.uploadStream(stream, undefined, undefined, {
      blobHTTPHeaders: {
        blobContentType: contentType, // Set the content type here
      },
    });
    const fileUrl = blockBlobClient.url;

    return fileUrl;
  }

  public async uploadFileHttp(
    file: Express.Multer.File,
    containerName: string,
  ) {
    this.containerName = containerName;
    const extension = file.originalname.split('.').pop().toLowerCase();
    const file_name = uuid() + '.' + extension;
    const blockBlobClient = await this.getBlobClient(file_name);
    const fileUrl = blockBlobClient.url;
    const blobOptions = {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    };
    await blockBlobClient.uploadData(file.buffer, blobOptions);

    return fileUrl;
  }

  async deleteFile(file_name: string, containerName: string) {
    try {
      this.containerName = containerName;
      const blockBlobClient = await this.getBlobClient(file_name);
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      console.log(error);
    }
  }
}
