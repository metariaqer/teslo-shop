import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/index'

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('products/:imageName')
  findOne(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage( imageName );
    res.sendFile( path );
  }

  @Post('products')
  @UseInterceptors( FileInterceptor('image', {
    fileFilter: fileFilter,
    limits: { fieldSize: 10 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadImageProduct( 
    @UploadedFile() image: Express.Multer.File,
  ) {

    if (!image) {
      throw new BadRequestException("Image is empty")
    };

    const secureURL = `${ this.configService.get('HOST_API') }/files/products/${ image.filename }`;
    return secureURL;
  }

}
