var fileDom = $('#fileDom')[0];
var canvas = $('#drawCanvas')[0];
var ctx = canvas.getContext('2d');

$("#iForm").on('change', function(){
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
	var dotsPerLine = parseFloat($("#dotsPerLine").val());
	var pxWidth = dotsPerLine;
	var offset = 5;
	var radius = 0.5;
	
	var stringLength = binaryString.length;
	var dotDelta = pxWidth/dotsPerLine;
	var yMax = stringLength/dotsPerLine;
	var pxHeight = yMax*dotDelta;
	
	canvas.width = (pxWidth + (offset*2));
	canvas.height = (pxHeight + (offset*2));
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "rgb(0,0,0)";

	var svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" height="' + (pxHeight + (offset*2)) + '" width="' + (pxWidth + (offset*2)) + '">';
	var svgClose = '</svg>';

	var finalSvg = "";
	

	for(var y = 0; y < yMax; y++){
		for(var x = 0; x < dotsPerLine; x++){
			if(binaryString[x + (y*dotsPerLine)] == 1){
				finalSvg = finalSvg + '<circle cx="' + ((x*dotDelta) + offset) + '" cy="' + ((y*dotDelta) + offset) + '" r="' + radius + '"/>';
				ctx.fillRect(((x*dotDelta) + offset), ((y*dotDelta) + offset),1,1);
			}
		}
	}

	finalSvg = svgOpen + finalSvg + svgClose;
	
	var prefix = Date.now();
	
	var txtBlob = new Blob([binaryString], {type:"text/plain;charset=utf-8"});
	var txtPseudoURL = URL.createObjectURL(txtBlob);
	var txtLink = document.getElementById('txtLink');
	txtLink.href = txtPseudoURL;
	txtLink.download = prefix + ".bintext";
	txtLink.textContent = "Download binary text";

	var svgBlob = new Blob([finalSvg], {type:"image/svg+xml;charset=utf-8"});
	var svgPseudoURL = URL.createObjectURL(svgBlob);
	var svgLink = document.getElementById('svgLink');
	svgLink.href = svgPseudoURL;
	svgLink.download = prefix + ".svg";
	svgLink.textContent = "Download SVG";
	
	var imgLink = document.getElementById('imgLink');
	imgLink.href = canvas.toDataURL("image/png");
	imgLink.download = prefix + ".png";
	imgLink.textContent = "Download PNG";
}
