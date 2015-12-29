// Copyright (c) 2015 InEvent. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// 
// Created by Pedro Góes
// November, 2015

var imageSize = "100";
var imageName = "image";

// A generic onclick callback function.
function genericOnClick(info, tab) {

	chrome.tabs.sendMessage(tab.id, "getClickedEl", function(response) {

		// Get our element raw html
		var elementHTML = response.value,
			size = response.size;

		// Find <svg> element based on our unique class
		var div = document.createElement("div");
		div.innerHTML = elementHTML;
		var elementSVG = div.firstChild;

		// Verify that we have a <svg> element
		if (elementSVG.tagName.toLowerCase() != "svg") {
			alert("This is not a <svg> element!");
			return;
		}

		// Ask for image ize
		imageSize = prompt("Please enter the scale (%)", imageSize);
		imageSize = (imageSize != null) ? parseInt(imageSize) : 200;

		// Ask for image name
		imageName = prompt("Please enter your image name", imageName);
		if (imageName == null) imageName = "image";

		// Declare closure
		function generateImage() {
			return function() {
				// Create an image
				var image = new Image; // Not shown on page
				var svgAsXML = (new XMLSerializer).serializeToString(elementSVG);
				image.src = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);
				image.width = size.width * imageSize/100;
				image.height = size.height * imageSize/100;
console.log(image);
				image.onload = function() {
					// Draw our image on canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					canvas.width = image.width;
					canvas.height = image.height;
					ctx.drawImage(image, 0, 0, image.width, image.height);

					// Download our image
					var a = document.createElement('a');
					a.download = imageName + ".png";
					a.href = canvas.toDataURL('image/png');
					document.body.appendChild(a);
					a.addEventListener("click", function(e) {
						a.parentNode.removeChild(a);
					});
					a.click();
				};
			}();
		}

        generateImage();
       });
}

// Create one item to our global context
var context = "all";
var title = "Convert to .png";
var id = chrome.contextMenus.create({
	"title": title,
	"contexts":[context],
	"type": "normal",
	"onclick": genericOnClick
});
