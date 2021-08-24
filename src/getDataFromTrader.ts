import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';
import moment from 'moment';
import SocketList, { Socket } from "./SocketList";
import { ACCTYPE, loopCount, RequestAcc, AccData, ItemListByType } from './Constants';

const userAgentList = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',	
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 OPR/56.0.3051.52',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 OPR/36.0.2130.32',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36 OPR/65.0.3467.78',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 9; SM-G960F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36',
    'Dalvik/2.1.0 (Linux; U; Android 5.1.1; Navori QL Stix 3500 Build/LMY49F)',
    'Mozilla/5.0 (Linux; Android 9; SM-G950F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36',
]


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

    let output: any[] = [];
    let promiseAll: any = [];
    for await (let i of [1, 2]){
        param['request[pageNo]'] = i;
        let form = new URLSearchParams(param);
        
        // console.log(param);
        // console.log('파라미터', JSON.stringify(param));
        let sleep = (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        console.log('슬립 고', moment().format('mm분 ss초 zzz'));
        await sleep(0 + Math.random() * 1500);
        console.log('슬립 끝', moment().format('mm분 ss초 zzz'));

        let res = await axios.post(
            'https://lostark.game.onstove.com/Auction/GetAuctionListV2',
            form, 
            { 
                headers: {
                    'User-Agent': userAgentList[Math.ceil(Math.random() * 60)]
                }
            }
        )
        console.log('응답쓰', moment().format('mm분 ss초 zzz'));
        let data = res.data;
        output.push(...parseAcc(data, request.acctype));
                
    }
    return output;
    // return Promise.all(promiseAll)
    // .then((res: any[]) => {
    //     return res.reduce((totalList: any[], current: any[]) => {
    //         totalList.push(...current);
    //         return totalList;
    //     }, []);
    // }).catch((err: any) => {
    //     return [];
    // });
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

    
    let output: any[] = [];
    let promiseAll: any = [];
    for await(let i of [1, 2]){
        param['request[pageNo]'] = i;
        let form = new URLSearchParams(param);
        
        // console.log(param);
        // console.log('파라미터', JSON.stringify(param));
        let sleep = (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        console.log('슬립 고', moment().format('mm분 ss초 zzz'));
        await sleep(0 + Math.random() * 1500);
        console.log('슬립 끝', moment().format('mm분 ss초 zzz'));

        let res = await axios.post(
            'https://lostark.game.onstove.com/Auction/GetAuctionListV2',
            form, 
            {
                headers: {
                    'User-Agent': userAgentList[Math.ceil(Math.random() * 60)]
                }
            }
        )
        console.log('응답쓰', moment().format('mm분 ss초 zzz'));
        let data = res.data;
        output.push(...parseAcc(data, request.acctype));
                
    }
    return output;
    // return Promise.all(promiseAll)
    // .then((res: any[]) => {
    //     return res.reduce((totalList: any[], current: any[]) => {
    //         totalList.push(...current);
    //         return totalList;
    //     }, []);
    // }).catch((err: any) => {
    //     return [];
    // });
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
    // console.log('람다에서 데이터를 가져왔습니다.', res.data);
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
        console.log('아이템 사전', JSON.stringify(dictionary));
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
        return [];
    }
    try{
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
    }
    catch(e) {
        console.log(cheer('tbody').children('tr.empty').text());
    }
    return output;
}

export async function getAccWidthProperty(
    grade: Number,
    accType: ACCTYPE, 
    socket1: Socket, 
    socket2: Socket,
    ) : Promise<AccData[]> {
    // ? 0 - 치명, 1 - 특화, 2 - 신속
    let promiseAll: any[] = [];
    let output: AccData[] = [];
    for await (let k of [0, 1, 2]){
        let searchPromise : any = {};
        let param : RequestAcc = {
            acctype: Number(accType),
            socket1: socket1,
            socket2: socket2,
            property1: k,
            property2: -1,
        }
        // await sleep(3000);
        if(grade === 4) {
            // 전설 데이터 가져오기
           let res = await getDataLegend(param)
            console.log(`${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number}) '${accType}' 치특신 ${k}! ${res.length}`);
            output.push(...res);
        } else if(grade === 5) {
            // 유물 데이터 가져오기
            let res = await getData(param)
            console.log(`유물 ${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number}) '${accType}' 치특신 ${k}! ${res.length}`);
            output.push(...res);
        }
    }
    return output;
    // return Promise.all(promiseAll).then((res: any[]) => {
    //     // 치특신 데이터를 모두 가져왔다.
    //     // 3개 배열을 하나로 합쳐서 응답하자.
    //     // [ [...치], [...특], [...신] ]
    //     let output = res.reduce((totalList: any[], current: any[]) => {
    //         totalList.push(...current);
    //         return totalList;
    //     }, []);
    //     console.log(`${socket1.name}(${socket1.number}) - ${socket2.name}(${socket2.number}) '${accType}' 거래소에서 가져옴!  ${output.length}`);
    //     return output;
    // }).catch((err: any) => {
    //     return [];
    // });
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
    for (let valcomp of valueComposition) {
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
        let param = {
            grade: grade,
            socketList: socketList,
            valcomp: valcomp,
        }
        promiseAll.push(axios.post('https://rcn8wut8le.execute-api.ap-northeast-2.amazonaws.com/dev/gt', param)
        .then((res: any) => {
            console.log('게터에서 가져옴', res.data);
            neckItemList.push(...res.data.neckItemList);
            earringItemList.push(...res.data.earringItemList);
            ringItemList.push(...res.data.ringItemList);
        })
        .catch((err: any) => {
            console.log('게터에서 잘못됨');
        }));
    };
    // let dictionary = {
    //     neckItemList: neckItemList,
    //     earringItemList: earringItemList,
    //     ringItemList: ringItemList,
    // }
    // console.log('아이템 사전', dictionary);
    // return dictionary;
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
        let dictionary = {
            neckItemList: neckItemList,
            earringItemList: earringItemList,
            ringItemList: ringItemList,
        }
        // console.log('아이템 사전', dictionary);
        return dictionary;
    })
}
