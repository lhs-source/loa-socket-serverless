import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';
import moment from 'moment';
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

async function requestToLambda(grade : number, socketList : Socket[]) {
    let param = {
        grade: grade,
        socketList: socketList,
    }
    let res = await axios.post('https://rcn8wut8le.execute-api.ap-northeast-2.amazonaws.com/dev/cdft', param);
    if(res.status !== 200) {
        console.log('람다에서 데이터를 가져오지 못했습니다.', JSON.stringify(param));
        return res;
    }
    console.log('람다에서 데이터를 가져왔습니다.', res.data);
    return res.data;
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
            // 크롤러 람다에서 가져온다.
            let socketList = [
                socket[i],
                socket[j],
            ]
            promiseAll.push(requestToLambda(grade, socketList)
            .then((res: any) => { 
                neckItemList.push(...res.neckItemList);
                earringItemList.push(...res.earringItemList);
                ringItemList.push(...res.ringItemList);
            }));
        }
    }
    return Promise.all(promiseAll)
    .then((res: any[]) => {
        console.log('람다에서 데이터를 드디어 모두 긁어왔다..', res.length)
        let dictionary = {
            neckItemList: neckItemList,
            earringItemList: earringItemList,
            ringItemList: ringItemList,
        }
        // console.log('아이템 사전', dictionary);
        return dictionary;
    }).catch((res: any) => {
        console.log('람다에서 데이터를 긁어오다가 잘못되었고, 응답을 보냅니다!')
        return res;
    })
}

function parseAcc(responseData: any, accType: ACCTYPE) {
    let cheer = cheerio.load(responseData);
    let output: any[] = [];
    
    let empty = cheer('tbody').children('tr.empty');
    if(empty && empty.length > 0) {
        // console.log('getData data is empty ', empty);
        // 경매장 연속 검색으로 인해 검색 이용이 최대 5분간 제한되었습니다.
        // console.log('getData data is empty trace multi ', empty.text());
        if(empty.text().indexOf('연속 검색') > 0) {
            console.log('제한되었다..');
        }        
        return -1;
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
        socket1.name = socket1.name.slice(1, -1);

        let socket2 = {
            name: (cheer(socket.children[3]).children('font')[0].children[0] as any).data,
            number: Number((cheer(socket.children[3]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
        };
        socket2.name = socket2.name.slice(1, -1);

        let badSocket1 = {
            name: (cheer(socket.children[5]).children('font')[0].children[0] as any).data,
            number: Number((cheer(socket.children[5]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
        };
        badSocket1.name = badSocket1.name.slice(1, -1);

        let prop = cheer(el).find('div.effect ul')[1];
        let property1 = {
            name: (cheer(prop.children[1]).children('font')[0].children[0] as any).data,
            number: Number((cheer(prop.children[1]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
        };
        property1.name = property1.name.slice(1, -1);
        let property2 = {name:'', number: 0};
        if(accType === ACCTYPE.NECK) {
            property2 = {
                name: (cheer(prop.children[3]).children('font')[0].children[0] as any).data,
                number: Number((cheer(prop.children[3]).children('font')[1].children[0] as any).data.match(/\d/g).join('')),
            };
            property2.name = property2.name.slice(1, -1);
        }

        let price= 0;
        try{
            price = Number((cheer(el).find('div.price-buy em')[0].children[0] as any).data.match(/\d/g).join(''));
        } catch(e ) {
            // console.log('error debug :: price, 무시!', cheer(el).find('div.price-buy em')[0]);
            // price 가져오는 데 문제가 있다면 이 녀석은 무시한다.
            return;
        }
        if(price < 0) {
            // 0보다 작아도 skip
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
        let sleep = (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        // await sleep(3000);
        if(grade === 4) {
            // 전설 데이터 가져오기
            searchPromise = getDataLegend(param).then((res : any) => {
                console.log(`${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number}) '${accType}' 치특신 ${k}! ${res.length}`);
                return res;
            });
        } else if(grade === 5) {
            // 유물 데이터 가져오기
            searchPromise = getData(param).then((res : any) => {
                console.log(`유물 ${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number}) '${accType}' 치특신 ${k}! ${res.length}`);
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

/**
 * * acc 타입 하나만 데이터 가져오기
 * 
 * * ex) 원한, 기습 타입의 악세를
 * * 목걸이, 귀걸이, 반지 별로
 * * 치, 특, 신 별로 가져온다.
 * @param grade 등급
 * @param socketList 소켓 두개
 */
export async function getOneAccType(grade: number, socketList: Socket[]) {
    let neckItemList: ItemListByType[] = [];
    let earringItemList: ItemListByType[] = [];
    let ringItemList: ItemListByType[] = [];

    let promiseAll: any[] = [];

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
    for(let valcomp of valueComposition) {
        let socket1: Socket = {
            id : socketList[0].id,
            name: socketList[0].name,
            class: socketList[0].class,
            number: socketList[0].number,
        };
        let socket2: Socket = {
            id : socketList[1].id,
            name: socketList[1].name,
            class: socketList[1].class,
            number: socketList[1].number,
        };
        // 찾으려는 악세 각인 수치 넣기
        socket1.number = valcomp[0];
        socket2.number = valcomp[1];

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
                // console.log('accOne', accOne);
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
                // 빈 데이터로 넣는다 ㅠㅠ
                let accOne: ItemListByType = {
                    accType: accType,
                    grade: grade,
                    socket1: socket1,
                    socket2: socket2,
                    itemList: [],
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
            // console.log(`${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number})  거래소에서 가져올 거임! promise 받음`);
            promiseAll.push(accPromise);
        }                    
    };
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
