{
	$inputButton = document.querySelector("#inputButton");
  $fileInput = document.querySelector("#fileInput");
  $output = document.querySelector("#outputSection");
  var fileName = "";
  var s = new Parser();

	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	  // $fileInput.addEventListener("change",loadFile);
	  $inputButton.addEventListener('click',function(){
	  	$fileInput.click();
	  });
	} else {
		document.querySelector('#container').innerHTML = 'The File APIs are not fully supported in this browser.'
	}

	FileReaderJS.setupInput($fileInput, {
		readAsDefault: "BinaryString",	
  	on:{
  		beforestart: (file) => {
  			if ( file.name.split(".")[1] != 'sav'){
  				alert("Invalid save file provided");
  				return false;
  			}else if (file.size > 131072){
  				alert("File size is too big!");
  				return false;
  			}
  		},
  		load: (e, file) => {
  			// fileName = file.extra.nameNoExtension;
  			// console.log(parseTitle(fileName));
  			// console.log (e.currentTarget.result);
  			s.data = e.currentTarget.result;
  			renderData(file);
  		},
  		loadend: (e,file) => {
  			console.log("loadend");
  		}
  	}
	});

	function parseTitle(fn){
		fn = fn || fileName;
		fn = fn.toLowerCase().replace(/ /g,"");
		let titles = ['firered','leafgreen','emerald','ruby','sapphire','fr','lg'];
		let i = 0;
		for(;i<titles.length;i++){
			if (fn.search(titles[i])!=-1) break;
		}
		return i<7?titles[i%4]:false;
	}

	function renderData(f){
		let gameVersion = parseTitle(f.extra.nameNoExtension) || "unidentified";
		$output.innerHTML = `<img src='./assets/logo/${gameVersion}.png' height="70">`;
	}
}