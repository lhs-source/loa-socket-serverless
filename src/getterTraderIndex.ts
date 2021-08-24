/**
 * 각인 데이터를 가져오는 녀석입니다.
 * 매우 여러번 불릴 거고..
 * 데이터를 가져오는 람다를 따로 두어 IP 탐지를 우회하기 위한 방법입니다.
 */
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getAccWidthProperty } from './getDataFromTrader';
import SocketList, { Socket } from "./SocketList";
import { ACCTYPE, loopCount, RequestAcc, AccData, ItemListByType } from './Constants';

/**
 * 핸들러
 * @param event 요청값
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("request: " + event.body);
    if (event.body) {
        let body = JSON.parse(event.body);
        
        let socketList: Socket[] = body.socketList;
        const grade = body.grade;
        let valcomp = body.valcomp;

        // 찾으려는 악세 각인 수치 넣기
        socketList[0].number = valcomp[0];
        socketList[1].number = valcomp[1];
        
        console.log('게터 바디', body);

        let neckItemList: ItemListByType[] = [];
        let earringItemList: ItemListByType[] = [];
        let ringItemList: ItemListByType[] = [];

        for await(let accType of [ACCTYPE.NECK, ACCTYPE.EARRING, ACCTYPE.RING]){
            // 목걸이, 귀걸이, 반지 각
            // 치 특 신 3번
            let res = await getAccWidthProperty(grade, accType, socketList[0], socketList[1])
            // 데이터가 빈 것이거나 정상적으로 왔다.
            let accOne: ItemListByType = {
                accType: accType,
                grade: grade,
                socket1: socketList[0],
                socket2: socketList[1],
                itemList: res,
            }
            // console.log('accOne', accOne);
            // 아이템 사전에 넣는다.
            if(accType === ACCTYPE.NECK){
                neckItemList.push(accOne);
            } else if(accType === ACCTYPE.EARRING) {
                earringItemList.push(accOne);
            } else if(accType === ACCTYPE.RING) {
                ringItemList.push(accOne);
            }
            
        }   

        let dictionary = {
            neckItemList: neckItemList,
            earringItemList: earringItemList,
            ringItemList: ringItemList,
        }
        // console.log('아이템 사전', dictionary);
        
        const response = {
            statusCode: 200,
            body: JSON.stringify(dictionary),
        };
        return response;
    } else {
        const response = {
            statusCode: 200,
            body: JSON.stringify('no body'),
        };

        return response;
    }
};
