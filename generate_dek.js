"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAES256Key = generateAES256Key;
const crypto = require('crypto');
function generateAES256Key() {
    return crypto.randomBytes(32);
}
//# sourceMappingURL=generate_dek.js.map