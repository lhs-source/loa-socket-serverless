import { Socket } from './SocketList';
import axios from 'axios';

export async function logCount(param: RequestCount) {
    // let res = await axios.put('https://crowloa.net/api/stat', param);
    let res = await axios.put('http://localhost:5000/api/stat', param);
    if(res.status !== 200) {
        console.log('카운트 로그 저장 중 뭔가 잘못되었습니다');
        return res;
    }
    return res;
}

export async function logPrice(param: RequestPrice) {
    // let res = await axios.put('https://crowloa.net/api/stat/price', param);
    let res = await axios.put('http://localhost:5000/api/stat/price', param);
    if(res.status !== 200) {
        console.log('카운트 로그 저장 중 뭔가 잘못되었습니다');
        return res;
    }
    return res;
}

export interface RequestCount {
    socketList: Socket[];
    needNumber: number[];
    grade: number;
}

export interface RequestPrice {
    socketList: Socket[];
    property: any[];
    grade: number;
    price: number;
}
