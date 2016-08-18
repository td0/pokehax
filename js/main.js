{
	$inputButton = document.querySelector("#inputButton");
  $fileInput = document.querySelector("#fileInput");
  

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
		readAsDefault: "DataURL",	
  	on:{
  		beforestart: function(file) {
  			if ( file.name.split(".")[1] != 'sav'){
  				alert("Invalid save file provided");
  				return false;
  			}else if (file.size > 131072){
  				alert("File size is too big!");
  				return false;
  			}
  		},
  		load: (e, file) => {
  			console.log(parseTitle(file.extra.nameNoExtension));
  		}
  	}
	});

	function parseTitle(fn){
		fn = fn.toLowerCase().replace(/ /g,"");
		let titles = ['firered','leafgreen','emerald','ruby','sapphire','fr','lg'];
		let i = 0;
		for(;i<titles.length;i++){
			if (fn.search(titles[i])!=-1) break;
		}
		return i<7?titles[i%4]:"unidentified";
	}
}