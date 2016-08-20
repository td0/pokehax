{
	$inputButton = document.querySelector("#inputButton");
  $fileInput = document.querySelector("#fileInput");
  $output = document.querySelector("#outputSection");
  var s;

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
  			if ( file.name.split(".").pop().toLowerCase() != 'sav'){
  				alert("Invalid save file provided");
  				return false;
  			}else if (file.size > 131072){
  				alert("File size is too big!");
  				return false;
  			}
  		},
  		load: (e, file) => {

  			s = new Parser(e.currentTarget.result,parseTitle(file.extra.nameNoExtension));
  			renderData(file);
  		},
  		loadend: (e,file) => {
  			console.log(parseTitle(file.extra.nameNoExtension) +" Loaded");
  		}
  	}
	});

	function parseTitle(fn){
		fn = fn || "unidentified";
		fn = fn.toLowerCase().replace(/[^A-Za-z0-9!?]/g,"");
		let titles = ['firered','leafgreen','emerald','ruby','sapphire','fr','lg'];
		let i = 0;
		for(;i<titles.length;i++){
			if (fn.search(titles[i])!=-1) break;
		}
		return i<7?titles[i%5]:false;
	}

	function renderData(f){
		let gameVersion = parseTitle(f.extra.nameNoExtension) || "unidentified";
		$output.innerHTML = `<img src='./assets/logo/${gameVersion}.png' height="70">`;
	}
}