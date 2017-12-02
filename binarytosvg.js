var fileDom = document.getElementById('fileDom');

fileDom.addEventListener('change', function(){
	var reader = new FileReader();
	reader.onload = function(e){
		var resultBuffer = e.target.result;
		var resultArray = new Uint8Array(resultBuffer);
		var fString = "";
		resultArray.forEach(function(val){
			//console.log(val.toString(2));
			var unpaddedBinStr = val.toString(2);
			//console.log("unpaddedBinStr: " + unpaddedBinStr);
			var paddedBinStr = "00000000" + unpaddedBinStr;
			//console.log("paddedBinStr: " + paddedBinStr);
			var trimmedPaddedBinStr = paddedBinStr.substr(paddedBinStr.length-8);
			//console.log("trimmedPaddedBinStr: " + trimmedPaddedBinStr);
			fString += trimmedPaddedBinStr;
		});
		drawSvg(fString);
	}
	var file = fileDom.files[0];
	var str = reader.readAsArrayBuffer(file);
});

var drawSvg = function(binaryString){
	var stringLength = binaryString.length;
	var pxWidth = 1000;
	var dotsPerLine = 500;

	var offset = 10;
	var radius = 0.5;

	var dotDelta = pxWidth/dotsPerLine;
	var yMax = stringLength/dotsPerLine;
	var pxHeight = yMax*dotDelta;

	var svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" height="' + (pxHeight + (offset*2)) + '" width="' + (pxWidth + (offset*2)) + '">';
	var svgClose = '</svg>';

	var finalSvg = "";

	for(var y = 0; y < yMax; y++){
		for(var x = 0; x < dotsPerLine; x++){
			if(binaryString[x + (y*dotsPerLine)] == 1){
				finalSvg = finalSvg + '<circle cx="' + ((x*dotDelta) + offset) + '" cy="' + ((y*dotDelta) + offset) + '" r="' + radius + '"/>';
			}
		}
	}

	finalSvg = svgOpen + finalSvg + svgClose;

	var div = document.createElement('div')
	document.body.appendChild(div)
	div.innerHTML = finalSvg;
	
	var prefix = Date.now();
	
	var txtBlob = new Blob([binaryString], {type:"text/plain;charset=utf-8"});
	var txtPseudoURL = URL.createObjectURL(txtBlob);
	var txtLink = document.createElement("a");
	txtLink.href = txtPseudoURL;
	txtLink.download = prefix + ".bintext";
	txtLink.textContent = "Download binary text";
	document.body.appendChild(txtLink);

	var imgBlob = new Blob([finalSvg], {type:"image/svg+xml;charset=utf-8"});
	var imgPseudoURL = URL.createObjectURL(imgBlob);
	var imgLink = document.createElement("a");
	imgLink.href = imgPseudoURL;
	imgLink.download = prefix + ".svg";
	imgLink.textContent = "Download SVG";
	document.body.appendChild(imgLink);
}
