import fs from 'fs';
import path from 'path';

interface Config {
    apiKey: string;
    blockchainAddresses: string[];
    checkInterval: number;
}

export const getConfig = (): Config => {
    const configPath = path.join(__dirname, '../config/config.json');
    const configFile = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configFile) as Config;
};
