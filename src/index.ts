import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {

  const { path } = event;
  console.log("request: " + event.body);
  let body = JSON.parse(event.body);
  let needNumber = body.needNumber;
  console.log("needNumber: " + JSON.stringify(needNumber));
  
  const grade = body.grade;
  const accCount = 5;
  let ableNumber = grade === 4 ? [ 1, 2, 3 ] : [ 3, 4, 5 ];
  
  let output:any[] = [];
  needNumber.forEach((num, index) => {
      let despResult = getDesposition(num, accCount, ableNumber);
      console.log(`합분해 결과 ${index}`, despResult);
      output.push(despResult);
  })
  
  const response = {
      statusCode: 200,
      body: JSON.stringify(output),
  };
  return response;
};

/**
* * 숫자 합분해를 찾아낸다
* @param {number} targetNumber 합분해 대상 숫자 (15)
* @param {number} accCount 장신구 장착 개수(5개)
* @param {number[]} valuelist 합분해 요소 숫자 리스트 ([5, 3])
*/
export function getDesposition(
    targetNumber: number = 0, 
    accCount: number = 5,
    valuelist: number[]) {
    let output: any[] = [];
    let recurrsive = (
      remain: number,
      makeList: number[],
      depth: number
    ) => {
      // 장신구 개수 넘어가면 ㄴㄴ
      if (depth > accCount) {
        return;
      }
      for (let use of valuelist) {
        // 이전 숫자보다 크면
        if (makeList && use > makeList[makeList.length - 1]) {
          continue;
        }
        let nextRemain = remain - use;
  
        if (nextRemain > 0) {
          // 숫자가 부족함
          recurrsive(
            nextRemain,
            [...makeList, use],
            depth + 1
          );
        } else if (nextRemain === 0) {
          // 숫자가 딱 떨어짐
          output.push([...makeList, use]);
        } else {
          // 숫자가 넘겨버려서 -가 됨
          continue;
        }
      }
      return;
   };
   recurrsive(targetNumber, [], 0);
   return output;
  }