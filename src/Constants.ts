
import SocketList, { Socket } from "./SocketList";

export enum ACCTYPE {
    ALL = 0,
    NECK = 200010,
    EARRING = 200020,
    RING = 200030,
}

export const loopCount = 4; // 1, 2, 3

export interface ItemDictionary {
    neckItemList: ItemListByType[];
    earringItemList: ItemListByType[];
    ringItemList: ItemListByType[];
}

export interface ItemListByType {
    accType: ACCTYPE,
    grade: number;
    socket1: Socket;
    socket2: Socket;
    itemList: AccData[];
}

export interface RequestAcc {
    acctype: number;
    socket1: Socket;
    socket2: Socket;
    property1: number;
    property2: number;
}
export interface AccData {
    name: string;
    count: string;
    grade: number;
    acctype: number;
    socket1: {
        name: string;
        number: number;
    }
    socket2:{
        name: string;
        number: number;
    }
    badSocket1: {
        name: string;
        number: number;
    }
    property1: {
        name: string;
        number: number;
    }
    property2: {
        name: string;
        number: number;
    }
    price: number;
    timestamp: Date | string;
}
