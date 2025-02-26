import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
export declare class AppService {
    private readonly uploadDir;
    private readonly algorithm;
    private readonly ivLength;
    private readonly masterKey;
    constructor();
    getKey(): string;
    uploadFile(file: Express.Multer.File): Promise<unknown>;
    downloadFile(userId: string, filename: string, response: Response & {
        set: any;
    }): Promise<StreamableFile>;
}
