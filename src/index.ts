import { monitorAllChains } from './apiService';

const startMonitoring = () => {
    console.log('开始监控所有链的接口...');
    monitorAllChains();
};

startMonitoring();
