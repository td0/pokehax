/*
	TO-DO:
	-check game code (x)
	-checksum
	-validate file checksum 
	-...
*/

class Parser{
	constructor(data, version, region="en"){
		this.data 			= data;
		this._charMap 	= region=="en"?en_ch:jp_ch;
		this._ver				= this._getVersion(version);
		this._sectnPad 	= this._getSectionPad();
		this._secCode		= this._getSecurityCode();
		this._map 			= [{
			//section 0
			trainerName		: [0x0,7],
			trainerGender	: [0x8,1],
			trainerID			: [0xA,2],
			secretID			: [0xC,2],
			playTime			: [0xE,5],
			gameCode			: [0xAC,2],
			securityCode 	: {
					frlg	: [0xAF8,4],
					e			: [0xAC,4]
				}
		},{ //section 1
			teamSize 	: {
				frlg	: [0x0034,2],
				rs 		: [0x0234,2],
				e 		: [0x0234,2]
			},
			teamPokemon	: {
				frlg	: [0x38,600],
				rs 		: [0x238,600],
				e 		: [0x238,600]
			},
			money	: {
				frlg	: [0x290,4],
				rs		: [0x490,4],
				e			: [0x490,4]
			},
			coin	: {
				frlg	: [0x294,2],
				rs 		: [0x494,2],
				e 		: [0x494,2]
			},
			pcItem : {
				frlg	: [0x298,120],
				rs 		: [0x498,200],
				e 		: [0x498,200]
			},
			item : {
				frlg  : [0x310,168],
				rs 		: [0x560,80],
				e 		: [0x560,120]
			},
			itemKey : {
				frlg	: [0x3B8,120],
				rs 		: [0x5B8,80],
				e 		: [0x5D8,120]
			},	
			itemBall : {
				frlg 	: [0x430,52],
				rs 		: [0x600,64],
				e 		: [0x650,64]
			},
			itemTM 	:{
				frlg	: [0x464,232],
				rs 		: [0x640,256],
				e 		: [0x690,256]
			},
			itemBerry : {
				frlg	: [0x54C,172],
				rs 		: [0x740,184],
				e 		: [0x790,184]
			}
		},{ //section 4
			rivalName : [0xBCC,8]
		}];
		this._padMap();
	}

	_checkSum(section){
		let sum = 0;
		for(let i=this._sectnPad[section]; i<this._sectnPad[section]+sumBytes[section];i+=4){
			sum = (sum + this._getInt([i,4]))>>>0;
		}
		sum=((sum-((sum>>>16)<<16))+(sum>>>16)>>>0)%0x10000;
		return [sum,this._getInt([this._sectnPad[section]+0xFF6,2])];
	}
	_getVersion(v){
		if(v=="leafgreen"||v=="firered") return "frlg";
		else if(v=="ruby"||v=="sapphire") return "rs";
		else return "e";
	}
	_padMap(){ // Adds padding to map of properties offset
		for(let k of Object.keys(this._map)){ //someone said it is bad to use for(..in), hence for(..of) used instead
			for(let prop of Object.keys(this._map[k])){
				if(Array.isArray(this._map[k][prop])) this._map[k][prop][0] += this._sectnPad[k];
				else for(let ver of Object.keys(this._map[k][prop]))this._map[k][prop][ver][0] += this._sectnPad[k];
			}
		} 
	}
	_getSectionPad(){	//each save file has different order of section. it sequences the section order
		let head = this._getInt([0xFFC,4])>this._getInt([0xEFFC,4])?0:0xE000;
		let pads=[];
		for(let i=head; i<head+(0x1000*14); i+=0x1000){
			let idx = this._getInt([i+0xFF4,2]);
			pads[idx]=i;
		}
		return pads;
	}

	_getInt([ofst,size],str=false){ //set str to true to receive stringified-hexadecimal value.
		let charSet = "";
		for(let i=ofst+size-1;i>=ofst;i--){ //this loop runs on decrement, little-endian bruh!
			let temp = this.data.charCodeAt(i).toString(16);
			if(temp.length<2) temp = "0"+temp;
			charSet+=temp;
		}
		return str?charSet:parseInt("0x"+charSet);
	}
	_getChar(i){ //get hex value of single byte data at i arg
		let hex = this.data.charCodeAt(i).toString(16);
		return hex.length == 2?hex:"0"+hex ;
	}
	_getString([ofst,size],debug=false){ //get propietary encoded string
		let str = "";
		for(let i=ofst; i<ofst+size; i++){	 //the string however, runs on increment		
			if(this.data.charCodeAt(i)==0xFF || debug) break;
			str+=this._charMap[this.data.charCodeAt(i)];
		}
		return str;
	}
	//section 0
	getTrainerName(){
		return this._getString(this._map[0].trainerName);
	}
	getTrainerGender(){
		return this.data.charCodeAt(0x2008)==0?"Male":"Female";
	}
	getTrainerID(){
		return [this._getInt(this._map[0].trainerID),
			this._getInt(this._map[0].secretID)];
	}
	getGameVersion(){
		return this._getInt(this._map[0].gameCode);
	}
	getPlayTime(){
		let pTime = this._map[0].playTime;
		let [hour,minutes,second] = [[pTime[0],2] , [pTime[0]+2,1] , [pTime[0]+3,1]]; 
		return [this._getInt(hour),this._getInt(minutes),this._getInt(second)];
	}
	//section 1
	getTeamSize(){
		return this._getInt(this._map[1].teamSize[this._ver]);
	}
}


var sumBytes =  [3884,3968,3968,3968,3848,3968,3968,3968,3968,3968,3968,3968,2000];

var en_ch = 
	[" ", "À", "Á", "Â", "Ç", "È", "É", "Ê", "Ë", "Ì", "こ", "Î", "Ï", "Ò", "Ó", "Ô",
	"Œ", "Ù", "Ú", "Û", "Ñ", "ß", "à", "á", "ね", "ç", "è", "é", "ê", "ë", "ì", "ま",
	"î", "ï", "ò", "ó", "ô", "œ", "ù", "ú", "û", "ñ", "º", "ª", "˘", "&amp;", "+", "あ",
	"ぃ", "ぅ", "ぇ", "ぉ", "<small>Lv</small>", "=", "ょ", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ",
	"ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
	"っ", "¿", "¡", "<sup>P</sup><sub>K</sub>", "<sup>M</sup><sub>N</sub>", "<sup>P</sup><sub>O</sub>", "<sup>K</sup><sub>é</sub>", "<sup>B</sup><sub>L</sub>", "<sup>O</sup><sub>C</sub>", "<sub>K</sub>", "Í", "%", "(", ")", "セ", "ソ",
	"タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "â", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "í",
	"ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "⬆", "⬇", "⬅", "➡", "ヲ", "ン", "ァ",
	"ィ", "ゥ", "ェ", "ォ", "ャ", "ュ", "ョ", "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ",
	"ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ",
	"ッ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "?", ".", "-", "・",
	"…", "“", "”", "‘", "’", "♂", "♀", "$", ",", "×", "/", "A", "B", "C", "D", "E",
	"F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
	"V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
	"l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "▶",
	":", "Ä", "Ö", "Ü", "ä", "ö", "ü", "⬆", "⬇", "⬅", "\\1","\\2","\\3","\\4","<br />", "\\0"];

var jp_ch =
	[" ", "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ",
	"た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま",
	"み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "ぁ",
	"ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ",
	"ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
	"っ", "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ",
	"タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ",
	"ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン", "ァ",
	"ィ", "ゥ", "ェ", "ォ", "ャ", "ュ", "ョ", "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ",
	"ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ",
	"ッ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "！", "？", "。", "ー", "・",
	"<small>・・</small>", "『", "』", "「", "」", "♂", "♀", "円", ".", "×", "/", "A", "B", "C", "D", "E",
	"F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
	"V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
	"l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "▶",
	":", "Ä", "Ö", "Ü", "ä", "ö", "ü", "⬆", "⬇", "⬅", "\\1","\\2","\\3","\\4","<br />", "\\0"];



// Tis' debug 'em
function encdStr(s){
	let res = "";
	for(let i=0; i<s.length; i++){
		res += en_ch.indexOf(s[i]).toString(16).toUpperCase();
	}
	return res;
}
function dcdStr(s){
	s=s.replace(/ /g,'');
	let [res,f,temp] = ["",false,"0x"];
	for(let i =0; i<s.length;i++){
		temp += s[i];
		if(f){	
			res+=en_ch[parseInt(temp)];
			temp = "0x";
		}
		f=!f;
	}
	return res;
}