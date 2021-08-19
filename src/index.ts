import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getData, getAllAcc } from './getDataFromTrader';
import SocketList, { Socket } from "./SocketList";
import { getDesposition, getDespComposition } from './calculateComposition';
import { getAllCases, getFinalComposition } from "./finalComposition";
import ItemDictionaryData from "./mockItemDictionaly";
import { ACCTYPE, loopCount, RequestAcc, AccData, ItemListByType, ItemDictionary } from './Constants';

/**
 * 핸들러
 * @param event 요청값
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("request: " + event.body);
    if (event.body) {
        let body = JSON.parse(event.body);
        const accCount = 5;
        let needNumber: number[] = body.needNumber;
        let socketList: Socket[] = body.socketList;
        const grade = body.grade;
        let maxPrice = body.maxPrice;
        let props = body.props;
        let penalty = body.penalty;

        let sumSocket = needNumber.reduce((sum: number, current: number) => { sum += current; return sum; }, 0);
        let ableNumber = grade === 4 ? [1, 2, 3] : [3, 4, 5];

        let despResult: any[] = [];
        needNumber.forEach((num, index) => {
            let result = getDesposition(num, accCount, ableNumber);
            despResult.push(result);
        })
        let deComp = getDespComposition(despResult, sumSocket, grade, accCount);
        let itemDictionary = await getAllAcc(grade, socketList);
        console.log(itemDictionary);
        const response = {
            statusCode: 200,
            body: JSON.stringify(itemDictionary),
        };

        return response;

        // let itemDictionary : ItemDictionary = ItemDictionaryData;
        // let casesResult: any[] = [];
        // deComp.forEach(val => {
        //     casesResult.push(getAllCases(itemDictionary, socketList, val, grade, accCount, 2));
        // })
        // console.log(casesResult);

        // return Promise.all(casesResult)
        // .then((res : any[]) => {

        //     let finalResult: any[] = [];
        //     let stop = false;
        //     res.forEach((cases: any[], caseCount: number) => {
        //         if (stop === true) {
        //             return;
        //         }
        //         cases.forEach((oneCase: any, oneCaseCount: number) => {
        //             if (stop === true) {
        //                 return;
        //             }
        //             // console.log('accList', oneCase.accSocketList);
        //             // console.log('accList', oneCase.accList);
        //             let result = getFinalComposition(maxPrice, props, penalty, oneCase.accList);
        //             if (typeof (result) === 'number') {
        //                 console.log('getFinalComposition stop', `${caseCount}-${oneCaseCount}`, result);
        //                 stop = true;
        //             } else {
        //                 // console.log('getFinalComposition', `${caseCount}-${oneCaseCount}`, result.length);
        //                 finalResult.push(...result);
        //                 if (finalResult.length > 3000) {
        //                     stop = true;
        //                 }
        //             }
        //         })
        //     })

        //     if(finalResult.length > 3000) {
        //         const response : APIGatewayProxyResult = {
        //             statusCode: 200,
        //             body: JSON.stringify({count: -finalResult.length}),
        //         };
        //         return response;
        //     }
        //     else {
        //         // 가격순으로 정렬
        //         finalResult.sort((a: any, b:any) => {
        //             return a[1].price > b[1].price ? 1 : -1;
        //         })
        //         const response = {
        //             statusCode: 200,
        //             body: JSON.stringify(finalResult),
        //         };
        //         return response;
        //     }
        // })
        // .catch((err: any) => {
        //     const response = {
        //         statusCode: 500,
        //         body: JSON.stringify(err),
        //     };
    
        //     return response;
        // });
    } else {
        const response = {
            statusCode: 200,
            body: JSON.stringify('no body'),
        };

        return response;
    }
};
