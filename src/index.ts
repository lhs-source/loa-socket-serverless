import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { getDesposition, getDespComposition } from './calculateComposition';
import { getData, RequestAcc } from './getDataFromTrader';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {

  const { path } = event;
  console.log("request: " + event.body);
  if(event.body) {
    let body = JSON.parse(event.body);
    let needNumber: number[] = body.needNumber;
    console.log("needNumber: " + JSON.stringify(needNumber));
    
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

    let param : RequestAcc = {
        acctype: 200010,
        socket1: {
            id: 118,
            name: '원한',
            number: 5,
        },
        socket2: {
            id: 249,
            name: '기습의 대가',
            number: 3,
        },
        property1: 0,
        property2: -1,
    }
    getData(param).then((res: any) => {
      console.log(res);
      const response = {
          statusCode: 200,
          body: JSON.stringify(deComp),
      };
      
      return response;
    })
  
  } else {
    const response = {
        statusCode: 200,
        body: JSON.stringify('no body'),
    };
    
    return response;
  }
};
