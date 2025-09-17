import './style.css';

/** pref select */

const prefSelect = document.getElementById('prefSelect') as HTMLSelectElement;

/** datetime input */
const datetimeInput = document.getElementById('datetime') as HTMLInputElement;

/** submit button */
const submitButton = document.getElementById(
    'submitButton'
) as HTMLButtonElement;

/** area text */
const areaText = document.getElementById('postAreaContent') as HTMLSpanElement;

/** time message text */
const timeText = document.getElementById('postTimeContent') as HTMLSpanElement;

/** post date text */
const postDateText = document.getElementById('postDate') as HTMLSpanElement;

/** post time text */
const postTimeText = document.getElementById('postTime') as HTMLSpanElement;

/** time messages */
const messages = [
    '空真っ暗や',
    '空明るくなってきた',
    '太陽出てきた',
    '空真っ白や',
    '空赤くなってきた',
    '太陽ないなった',
    '空暗くなってきた',
];

/** day kanji list */
const weekDay = ['日', '月', '火', '水', '木', '金', '土'];

/** pref. list */
const pref: [string, number, number][] = [
    ['北海道', 141.2048, 43.0351],
    ['青森', 140.4424, 40.4927],
    ['岩手', 141.0909, 39.4212],
    ['宮城', 140.5219, 38.1608],
    ['秋田', 140.0608, 39.4307],
    ['山形', 140.2148, 38.1425],
    ['福島', 140.2803, 37.45],
    ['茨城', 140.2648, 36.203],
    ['栃木', 139.5301, 36.3356],
    ['群馬', 139.0339, 36.2328],
    ['埼玉', 139.3856, 35.5125],
    ['千葉', 140.0723, 35.3616],
    ['東京', 139.413, 35.4121],
    ['神奈川', 139.3833, 35.2652],
    ['新潟', 139.0123, 37.5408],
    ['富山', 137.124, 36.4142],
    ['石川', 136.3732, 36.354],
    ['福井', 136.1318, 36.0354],
    ['山梨', 138.3406, 35.395],
    ['長野', 138.1051, 36.3904],
    ['岐阜', 136.4319, 35.2327],
    ['静岡', 138.2259, 34.5836],
    ['愛知', 136.5424, 35.1049],
    ['三重', 136.303, 34.4349],
    ['滋賀', 135.5205, 35.0015],
    ['京都', 135.452, 35.0116],
    ['大阪', 135.3112, 34.4111],
    ['兵庫', 135.1059, 34.4128],
    ['奈良', 135.4958, 34.4107],
    ['和歌山', 135.1002, 34.1333],
    ['鳥取', 134.1417, 35.3012],
    ['島根', 133.0301, 35.282],
    ['岡山', 133.5606, 34.3942],
    ['広島', 132.2734, 34.2347],
    ['山口', 131.2817, 34.1108],
    ['徳島', 134.3333, 34.0356],
    ['香川', 134.0235, 34.2024],
    ['愛媛', 132.4557, 33.503],
    ['高知', 133.3151, 33.3334],
    ['福岡', 130.2505, 33.3623],
    ['佐賀', 130.1755, 33.1457],
    ['長崎', 129.5202, 32.45],
    ['熊本', 130.443, 32.4722],
    ['大分', 131.3645, 33.1417],
    ['宮崎', 131.2526, 31.5439],
    ['鹿児島', 130.3329, 31.3337],
    ['沖縄', 127.4051, 26.1244],
];

for (let i = 0; i < pref.length; i++) {
    const element = document.createElement('option');
    element.value = i.toString();
    element.textContent = pref[i][0];
    prefSelect.append(element);
}

prefSelect.value = '21';

submitButton.addEventListener('click', submit);
setDate();

/** API response json object */
interface responseJson {
    results: {
        astronomical_twilight_begin: string;
        astronomical_twilight_end: string;
        civil_twilight_begin: string;
        civil_twilight_end: string;
        day_length: string;
        nautical_twilight_begin: string;
        nautical_twilight_end: string;
        solar_noon: string;
        sunrise: string;
        sunset: string;
    };
}

/** set the input current time */
function setDate() {
    const date = new Date();
    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );
    const localTimeString = localDate.toISOString().slice(0, -1);
    datetimeInput.value = localTimeString;
}

/** get and process input data */
function getData(): Date {
    const dateString = datetimeInput.value;
    return new Date(dateString);
}

/** zero padding */
function zeroPad(number: number): string {
    return `0${number}`.slice(-2);
}

/** submit an API request and display the result */
function submit() {
    const date = getData();
    const dataText = `${date.getFullYear()}-${zeroPad(
        date.getMonth() + 1
    )}-${zeroPad(date.getDate())}`;
    const prefIndex = parseInt(prefSelect.value);
    const coordinates = `&lng=${pref[prefIndex][1]}&lat=${pref[prefIndex][2]}`;
    const url = `https://api.sunrise-sunset.org/json?${coordinates}&date=${dataText}&formatted=0&tzid=Asia/Tokyo`;
    fetch(url, {
        method: 'GET',
        mode: 'cors',
    })
        .then((res) => {
            if (!res.ok) throw new Error(`status: ${res.status}`);
            return res.json();
        })
        .then((data: responseJson) => {
            console.log(data);
            console.log(date);
            let flag: number = -1;
            switch (true) {
                case date.getTime() <
                    Date.parse(data.results.astronomical_twilight_begin):
                    flag = 0;
                    break;

                case date.getTime() < Date.parse(data.results.sunrise):
                    flag = 1;
                    break;

                case date.getTime() < Date.parse(data.results.sunrise) + 900000:
                    flag = 2;
                    break;

                case date.getTime() >
                    Date.parse(data.results.astronomical_twilight_end):
                    flag = 0;
                    break;

                case date.getTime() > Date.parse(data.results.sunset) + 900000:
                    flag = 6;
                    break;

                case date.getTime() > Date.parse(data.results.sunset):
                    flag = 5;
                    break;
                
                case date.getTime() > Date.parse(data.results.sunset) - 900000:
                    flag = 4;
                    break;


                default:
                    flag = 3;
                    break;
            }
            areaText.textContent = pref[prefIndex][0];
            timeText.textContent = messages[flag];
            postDateText.textContent = `${date.toLocaleDateString('ja-JP')}(${
                weekDay[date.getDay()]
            })`;
            postTimeText.textContent = `${date.toLocaleTimeString(
                'ja-JP'
            )}.${Math.floor(date.getMilliseconds() / 10)}`;
        })
        .catch((error) => {
            window.alert('天体データが取得できませんでした');
            console.error(error);
        });
}
