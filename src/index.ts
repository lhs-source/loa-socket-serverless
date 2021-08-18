import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { getDesposition, getDespComposition } from './calculateComposition';
import { getData, RequestAcc, getAllAcc } from './getDataFromTrader';
import SocketList, {Socket} from "./SocketList";

/**
 * 핸들러
 * @param event 요청값
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log("request: " + event.body);
  if(event.body) {
    let body = JSON.parse(event.body);

    let needNumber: number[] = body.needNumber;
    let socketLise: Socket[] = body.socketList;
    const grade = body.grade;
    const accCount = 5;
    let sumSocket = needNumber.reduce((sum: number, current: number) => { sum += current; return sum;}, 0);
    let ableNumber = grade === 4 ? [ 1, 2, 3 ] : [ 3, 4, 5 ];
    
    let despResult:any[] = [];
    needNumber.forEach((num, index) => {
        let result = getDesposition(num, accCount, ableNumber);
        despResult.push(result);
    })
    let deComp = getDespComposition(despResult, sumSocket, grade, accCount);

    // let param : RequestAcc = {
    //     acctype: 200010,
    //     socket1: {
    //         id: 118,
    //         name: '원한',
    //         number: 5,
    //     },
    //     socket2: {
    //         id: 249,
    //         name: '기습의 대가',
    //         number: 3,
    //     },
    //     property1: 0,
    //     property2: -1,
    // }
    // return getData(param).then((res: any) => {
    //   console.log(res);
    //   const response = {
    //       statusCode: 200,
    //       body: JSON.stringify(res),
    //   };
      
    //   return response;
    // }).catch((err: any) => {
    //   const response = {
    //       statusCode: 500,
    //       body: JSON.stringify('getData 에러'),
    //   };
      
    //   return response;
    // })  
    let itemDictionary = await getAllAcc(grade, socketLise);
    
    const response = {
      statusCode: 200,
      body: itemDictionary,
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
