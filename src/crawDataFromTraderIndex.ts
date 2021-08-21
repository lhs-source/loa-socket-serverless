/**
 * 각인 데이터를 가져오는 녀석입니다.
 * 매우 여러번 불릴 거고..
 * 데이터를 가져오는 람다를 따로 두어 IP 탐지를 우회하기 위한 방법입니다.
 */
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getOneAccType } from './getDataFromTrader';
import SocketList, { Socket } from "./SocketList";

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

        let itemDictionary = await getOneAccType(grade, socketList);
        // console.log(itemDictionary);
        const response = {
            statusCode: 200,
            body: JSON.stringify(itemDictionary),
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
