// src/utils/fileUtils.ts

import * as fs from 'fs';

class FileUtils {
    static saveToFile(data: any, filePath: string): void {
        fs.writeFileSync(filePath, JSON.stringify(data));
    }
}

export default FileUtils;
