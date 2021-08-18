import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';
import SocketList, { Socket } from "./SocketList";
import { ACCTYPE, loopCount, RequestAcc, AccData, ItemListByType } from './Constants';


export async function getData(request: RequestAcc) : Promise<AccData[]> {
    let param: any = {};
    let prop1: number | null = 0;
    let prop2: number | null = 0;
    switch(request.property1){
        case 0: // 치
            prop1 = 15;
            break;
        case 1: // 특
            prop1 = 16;
            break;
        case 2: // 신
            prop1 = 18;
            break;
        default:
            prop1 = null;
            break;
    }
    if(request.acctype === ACCTYPE.NECK) {
        switch(request.property1){
            case 0: // 치특
                prop1 = 15;
                prop2 = 16;
                break;
            case 1: // 치신
                prop1 = 15;
                prop2 = 18;
                break;
            case 2: // 특신
                prop1 = 16;
                prop2 = 18;
                break;
            default:
                prop2 = null;
                break;
        }
    }

    param['request[firstCategory]'] = 200000;
    param['request[secondCategory]'] = request.acctype,
    param['request[classNo]'] = '';
    param['request[itemTier]'] = 3;
    param['request[itemGrade]'] = 5;
    param['request[itemLevelMin]'] = 0
    param['request[itemLevelMax]'] = 1600
    param['request[itemName]'] = ''; 
    param['request[gradeQuality]'] = 60
    param['request[skillOptionList][0][firstOption]'] = '';
    param['request[skillOptionList][0][secondOption]'] = '';
    param['request[skillOptionList][0][minValue]'] = '';
    param['request[skillOptionList][0][maxValue]'] = ''; 

    param['request[skillOptionList][1][firstOption]'] = ''; 
    param['request[skillOptionList][1][secondOption]'] = ''; 
    param['request[skillOptionList][1][minValue]'] = ''; 
    param['request[skillOptionList][1][maxValue]'] = ''; 

    param['request[skillOptionList][2][firstOption]'] = ''; 
    param['request[skillOptionList][2][secondOption]'] = ''; 
    param['request[skillOptionList][2][minValue]'] = ''; 
    param['request[skillOptionList][2][maxValue]'] = ''; 

    param['request[etcOptionList][0][firstOption]'] = 2;
    param['request[etcOptionList][0][secondOption]'] = prop1;
    param['request[etcOptionList][0][minValue]'] = ''; 
    param['request[etcOptionList][0][maxValue]'] = ''; 

    param['request[etcOptionList][1][firstOption]'] = 3
    param['request[etcOptionList][1][secondOption]'] = request.socket1.id
    param['request[etcOptionList][1][minValue]'] = request.socket1.number; 
    param['request[etcOptionList][1][maxValue]'] = ''; 

    param['request[etcOptionList][2][firstOption]'] = 3; 
    param['request[etcOptionList][2][secondOption]'] = request.socket2.id; 
    param['request[etcOptionList][2][minValue]'] = request.socket2.number; 
    param['request[etcOptionList][2][maxValue]'] = ''; 

    param['request[etcOptionList][3][firstOption]'] = ''; 
    param['request[etcOptionList][3][secondOption]'] = ''; 
    param['request[etcOptionList][3][minValue]'] = ''; 
    param['request[etcOptionList][3][maxValue]'] = ''; 

    // 두번째 특성
    if(request.acctype === ACCTYPE.NECK) {
        param['request[etcOptionList][3][firstOption]'] = 2; 
        param['request[etcOptionList][3][secondOption]'] = prop2; 
        param['request[etcOptionList][3][minValue]'] = ''; 
        param['request[etcOptionList][3][maxValue]'] = ''; 
    }
    
    param['request[sortOption][Sort]'] = 'BUY_PRICE';
    param['request[sortOption][IsDesc]'] = false;
    
    param['request[pageNo]'] = 1
    param['pushKey'] = '';
    param['tooltipData'] = ''; 

    let promiseAll: any = [];
    for(let i = 1; i < loopCount; ++i){
        param['request[pageNo]'] = i;
        let form = new URLSearchParams(param);
        promiseAll.push(
            axios.post(
                'https://lostark.game.onstove.com/Auction/GetAuctionListV2',
                form, 
                // {
                //     headers: {
                //         // "X-Requested-With": "XMLHttpRequest"
                //     }
                // }
            ).then(res => {
                let data = res.data;
                let output = parseAcc(data, request.acctype);
                return output;
            }).catch((error: any) => {
                return [];
            })
        );
    }

    return Promise.all(promiseAll)
    .then((res: any[]) => {
        return res.reduce((totalList: any[], current: any[]) => {
            totalList.push(...current);
            return totalList;
        }, []);
    }).catch((err: any) => {
        return [];
    });
}

export async function getDataLegend(request: RequestAcc) : Promise<AccData[]>  {
    let param: any = {};
    let prop1: number | null = 0;
    let prop2: number | null = 0;
    switch(request.property1){
        case 0: // 치
            prop1 = 15;
            break;
        case 1: // 특
            prop1 = 16;
            break;
        case 2: // 신
            prop1 = 18;
            break;
        default:
            prop1 = null;
            break;
    }
    if(request.acctype === ACCTYPE.NECK) {
        switch(request.property1){
            case 0: // 치특
                prop1 = 15;
                prop2 = 16;
                break;
            case 1: // 치신
                prop1 = 15;
                prop2 = 18;
                break;
            case 2: // 특신
                prop1 = 16;
                prop2 = 18;
                break;
            default:
                prop2 = null;
                break;
        }
    }

    param['request[firstCategory]'] = 200000;
    param['request[secondCategory]'] = request.acctype,
    param['request[classNo]'] = '';
    param['request[itemTier]'] = 3;
    param['request[itemGrade]'] = 4;
    param['request[itemLevelMin]'] = 0
    param['request[itemLevelMax]'] = 1600
    param['request[itemName]'] = ''; 
    param['request[gradeQuality]'] = 60
    param['request[skillOptionList][0][firstOption]'] = '';
    param['request[skillOptionList][0][secondOption]'] = '';
    param['request[skillOptionList][0][minValue]'] = '';
    param['request[skillOptionList][0][maxValue]'] = ''; 

    param['request[skillOptionList][1][firstOption]'] = ''; 
    param['request[skillOptionList][1][secondOption]'] = ''; 
    param['request[skillOptionList][1][minValue]'] = ''; 
    param['request[skillOptionList][1][maxValue]'] = ''; 

    param['request[skillOptionList][2][firstOption]'] = ''; 
    param['request[skillOptionList][2][secondOption]'] = ''; 
    param['request[skillOptionList][2][minValue]'] = ''; 
    param['request[skillOptionList][2][maxValue]'] = ''; 

    param['request[etcOptionList][0][firstOption]'] = 2;
    param['request[etcOptionList][0][secondOption]'] = prop1;
    param['request[etcOptionList][0][minValue]'] = ''; 
    param['request[etcOptionList][0][maxValue]'] = ''; 

    param['request[etcOptionList][1][firstOption]'] = 3
    param['request[etcOptionList][1][secondOption]'] = request.socket1.id
    param['request[etcOptionList][1][minValue]'] = request.socket1.number; 
    param['request[etcOptionList][1][maxValue]'] = ''; 

    param['request[etcOptionList][2][firstOption]'] = 3; 
    param['request[etcOptionList][2][secondOption]'] = request.socket2.id; 
    param['request[etcOptionList][2][minValue]'] = request.socket2.number; 
    param['request[etcOptionList][2][maxValue]'] = ''; 

    param['request[etcOptionList][3][firstOption]'] = ''; 
    param['request[etcOptionList][3][secondOption]'] = ''; 
    param['request[etcOptionList][3][minValue]'] = ''; 
    param['request[etcOptionList][3][maxValue]'] = ''; 

    // 두번째 특성
    if(request.acctype === ACCTYPE.NECK) {
        param['request[etcOptionList][3][firstOption]'] = 2; 
        param['request[etcOptionList][3][secondOption]'] = prop2; 
        param['request[etcOptionList][3][minValue]'] = ''; 
        param['request[etcOptionList][3][maxValue]'] = ''; 
    }
    
    param['request[sortOption][Sort]'] = 'BUY_PRICE';
    param['request[sortOption][IsDesc]'] = false;
    
    param['request[pageNo]'] = 1
    param['pushKey'] = '';
    param['tooltipData'] = ''; 

    
    let promiseAll: any = [];
    for(let i = 1; i < loopCount; ++i){
        param['request[pageNo]'] = i;
        let form = new URLSearchParams(param);
        promiseAll.push(
            axios.post(
                'https://lostark.game.onstove.com/Auction/GetAuctionListV2',
                form, 
                // {
                //     headers: {
                //     }
                // }
            ).then(res => {
                let data = res.data;
                let output = parseAcc(data, request.acctype);
                return output;
            }).catch((error: any) => {
                // console.log("DEBUG :: 거래소에서 데이터 가져오는 데 문제가 생겼다, 아니면 결과가 없음!", request, param);
                // console.log("DEBUG :: 거래소에서 데이터 가져오는 데 문제가 생겼다, 아니면 결과가 없음!", i);
                return [];
            })
        );
    }

    return Promise.all(promiseAll)
    .then((res: any[]) => {
        return res.reduce((totalList: any[], current: any[]) => {
            totalList.push(...current);
            return totalList;
        }, []);
    })
    .catch((err: any) => {
        return [];
    })
}

export async function getAllAcc(grade: number, socket: Socket[],) {
    // 각인 조합별로 가져오기
    let socketLength = socket.length;

    let neckItemList: ItemListByType[] = [];
    let earringItemList: ItemListByType[] = [];
    let ringItemList: ItemListByType[] = [];

    let promiseAll: any[] = [];

    for(let i = 0; i < socketLength; ++i) {
        for(let j = i + 1; j < socketLength; ++j){
            let socket1 = socket[i];
            let socket2 = socket[j];
            // 악세 각인 숫자 경우의 수
            let valueComposition: any[] = grade === 4 ? 
            [
                [1, 3],
                [2, 2],
                [2, 3],
                [3, 1],
                [3, 2],
                [3, 3],
            ] 
            :
            [
                [3, 4],
                [3, 5],
                [4, 3],
                [5, 3],
            ]

            // 3, 5 / 3, 4 등등 악세서리를 다 조회해온다.
            valueComposition.forEach((valcomp : number[]) => {
                // 찾으려는 악세 각인 수치 넣기
                socket1 = {...socket1, number: valcomp[0]};
                socket2 = {...socket2, number: valcomp[1]};
                // 
                for(let accType of [ACCTYPE.NECK, ACCTYPE.EARRING, ACCTYPE.RING]){
                    // 목걸이, 귀걸이, 반지 각
                    // 치 특 신 3번
                    let accPromise = getAccWidthProperty(grade, accType, socket1, socket2)
                    .then((res: AccData[]) => {
                        // 데이터가 빈 것이거나 정상적으로 왔다.
                        let accOne: ItemListByType = {
                            accType: accType,
                            grade: grade,
                            socket1: socket1,
                            socket2: socket2,
                            itemList: res,
                        }
                        // 아이템 사전에 넣는다.
                        if(accType === ACCTYPE.NECK){
                            neckItemList.push(accOne);
                        } else if(accType === ACCTYPE.EARRING) {
                            earringItemList.push(accOne);
                        } else if(accType === ACCTYPE.RING) {
                            ringItemList.push(accOne);
                        }
                    })
                    .catch((err: any) => {
                        console.log('데이터를 가져오다가 ERROR!');
                    })
                    // console.log(`${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number})  거래소에서 가져올 거임! promise 받음`);
                    promiseAll.push(accPromise);
                }                    
            })
        }
    }
    return Promise.all(promiseAll)
    .then((res: any[]) => {
        console.log('데이터를 드디어 모두 긁어왔다..', res.length)
        let dictionary = {
            neckItemList: neckItemList,
            earringItemList: earringItemList,
            ringItemList: ringItemList,
        }
        // console.log('아이템 사전', dictionary);
        return dictionary;
    }).catch((res: any) => {
        console.log('데이터를 긁어오다가 잘못되었고, 응답을 보냅니다!')
        return res;
    })
}

function parseAcc(responseData: any, accType: ACCTYPE) {
    let cheer = cheerio.load(responseData);
    let output: any[] = [];
    
    let empty = cheer('tbody').children('tr.empty');
    if(empty && empty.length > 0) {
        // console.log('getData data is empty ', request);
        return output;
    }
    cheer('tbody tr').each((i, el) => {
        let name = ''
        try {
            name = (cheer(el).find('span.name')[0].children[0] as any).data;
        } catch (e ) {
            // console.log('error debug :: name', cheer(el).find('span.name')[0]);
        }
        let count = '';
        try{
            count = (cheer(el).find('span.count font')[0].children[0] as any).data.match(/\d/g).join('');
        }catch(e ) {
            // console.log('error debug :: count', cheer(el).find('span.count font')[0]);
        }
        let grade = Number(cheer(el).find('div.grade')[0].attribs['data-grade']);
        let socket = cheer(el).find('div.effect ul')[0];
        let socket1 = {
            name: (cheer(socket.children[1]).children('font')[0].children[0] as any).data,
            number: Number((cheer(socket.children[1]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
        };
        let socket2 = {
            name: (cheer(socket.children[3]).children('font')[0].children[0] as any).data,
            number: Number((cheer(socket.children[3]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
        };
        let badSocket1 = {
            name: (cheer(socket.children[5]).children('font')[0].children[0] as any).data,
            number: Number((cheer(socket.children[5]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
        };
        let prop = cheer(el).find('div.effect ul')[1];
        let property1 = {
            name: (cheer(prop.children[1]).children('font')[0].children[0] as any).data,
            number: Number((cheer(prop.children[1]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
        };
        let property2 = {name:'', number: 0};
        if(accType === ACCTYPE.NECK) {
            property2 = {
                name: (cheer(prop.children[3]).children('font')[0].children[0] as any).data,
                number: Number((cheer(prop.children[3]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
            };
        }
        let price= 0;
        try{
            price = Number((cheer(el).find('div.price-buy em')[0].children[0] as any).data.match(/\d/g).join(''));
        } catch(e ) {
            // console.log('error debug :: price, 무시!', cheer(el).find('div.price-buy em')[0]);
            // price 가져오는 데 문제가 있다면 이 녀석은 무시한다.
            return;
        }
        let raw: AccData = {
            name: name,
            count: count,
            grade: grade,
            acctype: accType,
            socket1: socket1,
            socket2: socket2,
            badSocket1: badSocket1,
            property1: property1,
            property2: property2,
            price: price,
            timestamp: new Date(),
        }
        // console.log(raw);
        output.push(raw);
    })
    return output;
}

async function getAccWidthProperty(
    grade: Number,
    accType: ACCTYPE, 
    socket1: Socket, 
    socket2: Socket,
    ) : Promise<AccData[]> {
    // ? 0 - 치명, 1 - 특화, 2 - 신속
    let promiseAll: any[] = [];
    for(let k = 0; k < 3; ++k) {
        let searchPromise : any = {};
        let param : RequestAcc = {
            acctype: Number(accType),
            socket1: socket1,
            socket2: socket2,
            property1: k,
            property2: -1,
        }
        // console.log('파라미터', JSON.stringify(param));
        if(grade === 4) {
            // 전설 데이터 가져오기
            searchPromise = getDataLegend(param).then((res : any) => {
                return res;
            });
        } else if(grade === 5) {
            // 유물 데이터 가져오기
            searchPromise = getData(param).then((res : any) => {
                return res;
            });
        }
        promiseAll.push(searchPromise);
    }
    return Promise.all(promiseAll).then((res: any[]) => {
        // 치특신 데이터를 모두 가져왔다.
        // 3개 배열을 하나로 합쳐서 응답하자.
        // [ [...치], [...특], [...신] ]
        let output = res.reduce((totalList: any[], current: any[]) => {
            totalList.push(...current);
            return totalList;
        }, []);
        console.log(`${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number}) '${accType}' 거래소에서 가져옴!  ${output.length}`);
        return output;
    }).catch((err: any) => {
        return [];
    });
}

