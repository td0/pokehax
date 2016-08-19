class Parser{
	constructor(data, region="en"){
		this.data = data;
		this._charMap = region=="en"?en_ch:jp_ch;


	}
	_chekSum(section=0){
		let sum = 0;
		for(let i = 0; i<sumBytes[section];){
			break;
		}
	}
	_getInt([ofst,size],str=false){ //set str to true to receive stringified-hex.
		let charSet = "";
		for(let i=ofst+size-1;i>=ofst;i--){ //this loop runs on decrement, little-endian bruh!
			let temp = this.data.charCodeAt(i).toString(16);
			if(temp.length<2) temp = "0"+temp;
			charSet+=temp;
		}
		return str?charSet:parseInt("0x"+charSet);
	}
	_getChar(i){
		let hex = this.data.charCodeAt(i).toString(16);
		return hex.length == 2?hex:"0"+hex ;
	}
	_getString([ofst,size],debug=false){
		let str = "";
		for(let i=ofst; i<ofst+size; i++){	 //the string however, runs on increment		
			if(this.data.charCodeAt(i)==0xFF || debug) break;
			str+=this._charMap[this.data.charCodeAt(i)];
		}
		return str;
	}

	getTrainerName(){
		return this._getString(dataMap.trainerName);
	}
	getTrainerGender(){
		return this.data.charCodeAt(0x2008)==0?"Male":"Female";
	}
	getTrainerID(){
		return [this._getInt(dataMap.trainerID[0]),this._getInt(dataMap.trainerID[1])];
	}


	// Tis' debug 'em
	encdStr(s){
		let res = "";
		for(let i=0; i<s.length; i++){
			res += en_ch.indexOf(s[i]).toString(16).toUpperCase();
		}
		return res;
	}
	dcdStr(s){
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
}


var sumBytes = [3884,3968,3968,3968,3848,3968,3968,3968,3968,3968,3968,3968,2000];
//Here be dragons
var dataMap = {
	trainerName : [0x2000,7],
	trainerGender : [0x2008,1],
	trainerID : [[0x200A,2],[0x200C,2]],
	timePlayed : [0x200E,5],
	gameCode : [0x20AC,4],
	securityCode : {
		frlg : [0x2AF8,4],
		e : [0x20AC,4]
	}
};

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
	":", "Ä", "Ö", "Ü", "ä", "ö", "ü", "⬆", "⬇", "⬅", "[1]","[2]","[3]","[4]","<br />", "[0]"];

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
	":", "Ä", "Ö", "Ü", "ä", "ö", "ü", "⬆", "⬇", "⬅", "[1]","[2]","[3]","[4]","<br />", "[0]"];



