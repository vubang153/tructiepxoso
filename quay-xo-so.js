const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      console.log('Class attribute changed:', mutation.target.id);
      addToWaitingList(mutation.target);
    }
  }
});
let provinces = {
    1: "Thành Phố Hồ Chí Minh",
    2: "Đồng Tháp",
    3: "Cà Mau",
    9: "Bạc Liêu",
    8: "Vũng Tàu",
    7: "Bến Tre",
    10: "Đồng Nai",
    11: "Cần Thơ",
    12: "Sóc Trăng",
    13: "Tây Ninh",
    14: "An Giang",
    15: "Bình Thuận",
    16: "Vĩnh Long",
    17: "Bình Dương",
    18: "Trà Vinh",
    19: "Long An",
    20: "Hậu Giang",
    21: "Bình Phước",
    22: "Tiền Giang",
    23: "Kiên Giang",
    24: "Đà Lạt",
    22: "Thành Phố Hồ Chí Minh",
    26: "Thừa Thiên Huế",
    27: "Phú Yên",
    28: "Quảng Nam",
    29: "Đắc Lắc",
    30: "Đà Nẵng",
    31: "Khánh Hòa",
    32: "Bình Định",
    33: "Quảng Trị",
    34: "Quảng Bình",
    35: "Gia Lai",
    36: "Ninh Thuận",
    37: "Quảng Ngãi",
    38: "Đắk Nông",
    39: "Kon Tum",
    45: "Đà Nẵng",
    46: "Khánh Hòa"
};
// List các giải chờ quay
let loading_list = [];
// List các giải đã quay
let waiting_list = [];
let waiting_list_prox = new Proxy(waiting_list, {
	  set(target, property, value) {
	  	let lotto_dom = document.getElementById(value);
	  	let lotto_result = '';
	  	if (lotto_dom !== null) {
	  		lotto_result = lotto_dom.getAttribute('data');
	  	}
	  	if (lotto_result.includes('*') || lotto_result.includes('+')) {
	  		return;
	  	}
	  	let str = convertLottoName(value, lotto_result);
	  	filtered_list_prox.push({
	  		id: value,
	  		value: str
	  	});
	  	
	    // console.log(`Set ${property} to ${value}`);
	    target[property] = value;
	    return true;
	  },
	  deleteProperty(target, property) {
	    console.log(`Delete ${property}`);
	    delete target[property];
	    return true;
	  }
	});
// List các string audio các giải đã quay ['giai'=> 'Giải số n tỉnh x']
let filtered_list = [];
let filtered_list_prox = new Proxy(filtered_list, {
	  set(target, property, value) {
	    target[property] = value;
		let lotto_str = value.value;
		getAudio(lotto_str).then(response => {
			demo = JSON.parse(response);
			if (demo.error == 0) {
				audio_list.push(demo.async);
				audio_playback_list.push(demo.async);
			}
			else
			{
				return;
			}
		})
	    return true;
	  },
	  deleteProperty(target, property) {
	    console.log(`Delete ${property}`);
	    delete target[property];
	    return true;
	  }
	});
// List audio đã trả về chờ chạy
const channel_name = 'Xổ Số Phát Lộc';

let audio_list = [];
let audio_playback_list = [];
let channel_audio = '';
const AUDIO_ENABLE_STATE = true;
let audio = document.createElement('audio');
const placeholder_audio = 'https://raw.githubusercontent.com/vubang153/tructiepxoso/main/1-second-of-silence.mp3';
let total_lotto = 0;
//

// Vùng miền

const regions = {
	mien_trung: {
		name:'mien-trung',
		text: 'miền trung',
		live_time: '17 giờ 10 phút',
		voice: 'giahuy',
		pathname: '/truc-tiep-xo-so-mien-trung.html',
		channel_audio_time: 420000,
		playback_time: {
			hour: 17,
			minute: 35,
		}
	},
	mien_bac: {
		name: 'mien-bac',
		text: 'miền bắc',
		live_time: '18 giờ 10 phút',
		voice: 'thuminh',
		pathname: '/truc-tiep-xo-so-mien-bac.html',
		channel_audio_time: 360000,
		playback_time: {
			hour: 18,
			minute: 35,
		}
	},
	mien_nam: {
		name: 'mien-nam',
		text: 'miền nam',
		live_time: '16 giờ 10 phút',
		voice: 'linhsan',
		pathname: '/truc-tiep-xo-so-mien-nam.html',
		channel_audio_time: 420000,
		playback_time: {
			hour: 16,
			minute: 40,
		}
	}
}


function init() {
	setupWatch();
	setupAudio();
	playAudio();
}
function convertTime(region){
	let date = new Date();
	date.setHours(region.playback_time.hour);
	date.setMinutes(region.playback_time.minute);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}
function playPlayBack(){
	let cur_region = getCurrentRegion();
	let cur_time = new Date().getTime();
	let playback_time = convertTime(cur_region);
	let countdown_time = 0;
	console.log(playback_time > cur_time);
	if (playback_time > cur_time) {
		countdown_time = playback_time - cur_time;
		console.log(countdown_time);
		setTimeout(function(){
			let counter = 0;
			console.log('push playback');
			audio_list = [...audio_playback_list];
			counter++;
			let interval = setInterval(()=>{
				counter++;
				console.log(`push playback ${counter}`);
				audio_list = [...audio_playback_list];
			}, 360000);
		}, countdown_time)
	}
	else
	{
		return false; 
	}
	
}
function getCurrentVietnameseDate(){
	const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
	let today = new Date();
	let dayOfWeekInVietnamese = daysOfWeek[today.getDay()];
	
	const monthsInVietnamese = [
	  'Tháng một',
	  'Tháng hai',
	  'Tháng ba',
	  'Tháng tư',
	  'Tháng năm',
	  'Tháng sáu',
	  'Tháng bảy',
	  'Tháng tám',
	  'Tháng chín',
	  'Tháng mười',
	  'Tháng mười một',
	  'Tháng mười hai'
	];

	let dayOfMonth = today.getDate();
	let monthInVietnamese = monthsInVietnamese[today.getMonth()];
	return `${dayOfWeekInVietnamese} ngày ${dayOfMonth} ${monthInVietnamese}`;
}
function getAudioChannel(cur_region){
	let cur_vndate = getCurrentVietnameseDate();
	let pre_str_audio = 'Các bạn đang xem trực tiếp xổ số';
	let str_audio = '';
	
	str_audio = `${pre_str_audio} ${cur_region.text} ${cur_vndate} được phát trực tiếp hàng ngày lúc ${cur_region.live_time} trên kênh ${channel_name}. Chúc các bạn gặp thật nhiều may mắn trong buổi quay số ngày hôm nay`;
	
	return getAudio(str_audio, 0);
}
async function playChannelAudio(){
	let cur_region = getCurrentRegion();
	let audio_channel =  await getAudioChannel(cur_region);
	
	setInterval(function(){
		console.log('push channel audio');
		audio_list.push(JSON.parse(audio_channel).async);
	}, cur_region.channel_audio_time)	
}
function getCurrentRegion(){
	let pathname = window.location.pathname;
	switch (pathname) {
		case regions.mien_trung.pathname:
			return regions.mien_trung
			break;
		case regions.mien_bac.pathname:
			return regions.mien_bac
		default:
			return regions.mien_nam
	}
}
function setupWatch(){
	let loop = setInterval(function(){
		console.log('Waiting for live lotto');
		let dom = document.querySelector('.ttxstt');
		if (dom != null) {
			setTimeout(function(){
				watch();
				console.log('Setup dom success !')
				clearInterval(loop);	
			}, 4000);
		}
	}, 4000);
	
}
function setupAudio(){
	audio.src = placeholder_audio;
	playChannelAudio();
	playPlayBack();
	audio.play();
	console.log('Finish setup audio. Enabled play audio');
}

function getLoadingLotto(){
	/*return document.querySelectorAll('[class^=giai]>.loading');*/
	return document.querySelectorAll('[class^="giai"]>[data^="*"], [class^=giai]>.loading');
	
}
function addToWaitingList(dom){
	if (!dom.classList.contains('tick') && !dom.getAttribute('data').startsWith('+')) {
		let dom_name = dom.id;
		waiting_list_prox.push(dom_name);
	}
}
function watch(){
	let dom = getLoadingLotto();
	console.log(dom);
	dom.forEach(function(val, idx){
		observer.observe(val, { attributes: true });
		console.log('watch');
	});
}
function convertLottoOrderName(input)
{
	if (input == 1) {
		return "nhất";
	}
	return input;
}
function convertLottoName(input, lotto_result)
{
	let province = '';
	let str = '';
	console.log('input hiện tại là '+ input);
	const matches = input.match(/giai\w*?(\d+)(?:_(\d+))?(?:_(\d+))?/);
	const numbs = matches.slice(1).map(num => parseInt(num));
	console.log(numbs)
	//
	if (input.startsWith('giaidb')) {
		str = "Giải đặc biệt";
		province = provinces[numbs[0]];
	}
	else
	{
		 if (!isNaN(numbs[2])) {
			str = 'Giải ' + convertLottoOrderName(numbs[0]) + ' lần quay thứ ' + convertLottoOrderName(numbs[1]);
			province = provinces[numbs[numbs.length - 1]];
		}
		else {
			province = provinces[numbs[numbs.length - 2]];
			str = 'Giải ' + convertLottoOrderName(numbs[0]);
		}
	}
	let cur_prov = document.querySelector('.kqxsmienbac');
	if (cur_prov == null) {
			str += ' ' + province;
	}
	str += ' có kết quả là ' + convertLottoResult(lotto_result);
	console.log(str);
	return str;
}
function convertLottoResult(lotto_result)
{
	return lotto_result.split('').join(' ');
}
function getAudio(content,audio_speed = -1, voice = 'banmai'){
	let region = getCurrentRegion();
	return new Promise(function(resolve, reject) {
		const xhr = new XMLHttpRequest();

		// Thiết lập method và URL endpoint
		xhr.open("POST", "https://api.fpt.ai/hmi/tts/v5");
		
		// Thiết lập header
		xhr.setRequestHeader("api_key", 'qCJrFOyAWJEWE88PluzEZw5Qt26Omqj5');
		xhr.setRequestHeader("voice", region.voice);
		xhr.setRequestHeader("speed", audio_speed);
		
		// Thiết lập callback khi yêu cầu hoàn thành
		xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(xhr.response);
	      } else {
	        reject(Error(xhr.statusText));
	      }
	    };
	    xhr.onerror = function() {
	      reject(Error("Network Error"));
	    };
		
		// Thiết lập body
		setTimeout(()=>{
			xhr.send(content);
		},1000)
		// Gửi yêu cầu
	});
		
}

function playAudio(){
	if (AUDIO_ENABLE_STATE) {
		let cur_audio_item = 0;
		let isEnded = true;
		let loop = setInterval(()=>{
			if (audio_list.length > 0 && isEnded) {
				isEnded = false;
				audio.src = audio_list[cur_audio_item];
			
				audio.onended = function() {
				  // Xử lý khi audio chạy thành công
					if (audio.currentTime > 0) {
						isEnded = true;
						console.log('audio done');
				    	audio_list.splice(cur_audio_item,1);
						cur_audio_item = 0;
				    // Thực hiện đoạn mã khi audio chạy thành công
				  }
				};
				
				audio.onerror = function() {
					console.log('audio error');
					isEnded = true;
					if (cur_audio_item <= audio_list.length - 1) {
						cur_audio_item++;
					}
					else
					{
						cur_audio_item = 0;
					}
					
				};
				
				// Chạy audio
				audio.play();
				}
		}, 2000)	
	}
}
init();