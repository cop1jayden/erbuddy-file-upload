import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getKey(): Promise<string>;
    uploadFile(file: Express.Multer.File): Promise<unknown>;
    downloadFile(userID: string, filename: string, response: Response): Promise<StreamableFile>;
}
