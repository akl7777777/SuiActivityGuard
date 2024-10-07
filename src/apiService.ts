import axios from 'axios';
import crypto from 'crypto';
import { getConfig } from './config';

const config = getConfig();

// 基础 API URL，使用 `{address}` 作为占位符
const BASE_API_URL = "https://api.blockberry.one/sui/v1/accounts/{address}/activity?size=20&orderBy=DESC";

// 发送通知（你可以在这里扩展通知机制，比如发送邮件或短信）
const sendNotification = (message: string) => {
    console.log(`通知：${message}`);
};

// 计算哈希值，用于判断数据是否变化
const getHash = (data: any): string => {
    const dataStr = JSON.stringify(data);
    return crypto.createHash('md5').update(dataStr).digest('hex');
};

// 请求接口数据
const getApiData = async (fullUrl: string): Promise<any | null> => {
    try {
        const response = await axios.get(fullUrl, {
            headers: {
                'x-api-key': config.apiKey,
                'accept': '*/*'
            }
        });
        return response.data.content;
    } catch (error) {
        console.error('请求接口失败：', error);
        return null;
    }
};

// 监控单个区块链地址的 API
const monitorSingleChain = async (chainName: string, fullUrl: string) => {
    let lastHash: string | null = null;

    setInterval(async () => {
        const data = await getApiData(fullUrl);
        if (data) {
            const currentHash = getHash(data);
            if (lastHash && currentHash === lastHash) {
                sendNotification(`${chainName}：接口返回数据一致，收入可能停止！`);
            } else {
                console.log(`${chainName}：接口返回数据有变化，收入继续中。`);
            }
            lastHash = currentHash;
        } else {
            console.log(`${chainName}：获取数据失败，跳过本次轮询。`);
        }
    }, config.checkInterval * 1000);
};

// 监控所有区块链地址的 API
export const monitorAllChains = async () => {
    config.blockchainAddresses.forEach((address, index) => {
        // 使用地址替换占位符生成完整的 URL
        const fullUrl = BASE_API_URL.replace("{address}", address);
        const chainName = `链-${index + 1}`;  // 每个链给一个名称
        monitorSingleChain(chainName, fullUrl);
    });
};
