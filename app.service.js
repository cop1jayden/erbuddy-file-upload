"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
const fs_2 = require("fs");
const crypto = require("crypto");
const generate_dek_1 = require("./generate_dek");
let AppService = class AppService {
    constructor() {
        this.uploadDir = (0, path_1.join)(__dirname, '..', 'uploads');
        this.algorithm = 'aes-256-cbc';
        this.ivLength = 16;
        const keyFromEnv = process.env.MASTER_KEY || '';
        this.masterKey = Buffer.from(keyFromEnv, 'hex');
        if (this.masterKey.length !== 32) {
            throw new Error(`Invalid key length: ${this.masterKey.length} bytes`);
        }
        fs_2.promises.mkdir(this.uploadDir, { recursive: true });
    }
    getKey() {
        const key = (0, generate_dek_1.generateAES256Key)();
        return key.toString('hex');
    }
    async uploadFile(file) {
        const userId = crypto.randomBytes(4).toString('hex');
        const userDir = (0, path_1.join)(this.uploadDir, userId);
        await fs_2.promises.mkdir(userDir, { recursive: true });
        const fileKey = crypto.randomBytes(8).toString('hex');
        const filename = `${fileKey}_${file.originalname}`;
        const filePath = (0, path_1.join)(userDir, filename);
        const iv = crypto.randomBytes(this.ivLength);
        return new Promise((resolve, reject) => {
            try {
                const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
                const writeStream = (0, fs_1.createWriteStream)(filePath);
                writeStream.write(iv);
                const encrypted = Buffer.concat([
                    cipher.update(file.buffer),
                    cipher.final(),
                ]);
                writeStream.write(encrypted);
                writeStream.end();
                writeStream.on('finish', () => {
                    resolve({
                        message: 'File uploaded and encrypted successfully',
                        userId,
                        filename,
                    });
                });
                writeStream.on('error', reject);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async downloadFile(userId, filename, response) {
        const filePath = (0, path_1.join)(this.uploadDir, userId, filename);
        try {
            await fs_2.promises.access(filePath);
            const fileBuffer = await fs_2.promises.readFile(filePath);
            const iv = fileBuffer.slice(0, this.ivLength);
            const encryptedData = fileBuffer.slice(this.ivLength);
            const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
            const decrypted = Buffer.concat([
                decipher.update(encryptedData),
                decipher.final(),
            ]);
            response.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${filename}"`,
            });
            return new common_1.StreamableFile(decrypted);
        }
        catch (error) {
            throw new common_1.NotFoundException('File not found');
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map