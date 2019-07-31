(function() {
	'use strict';
	const canvasCircle = canvas => {
		const width = canvas.width; const height = canvas.height;
		const canvas1 = document.createElement('canvas');
		canvas1.width = width; canvas1.height = height;
		const ctx = canvas.getContext('2d'); const ctx1 = canvas1.getContext('2d');
		const refreshBackground = () => {
			//console.log(width, height);
			ctx1.drawImage(canvas, 0, 0, width, height);
		};
		refreshBackground();
		canvas.addEventListener('click', e => {
			const rect = canvas.getBoundingClientRect();
			ctx.drawImage(canvas1, 0, 0, width, height);
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = Math.min(width, height) * 0.01;
			ctx.beginPath();
			ctx.arc(e.clientX - rect.left, e.clientY - rect.top, Math.min(width, height) * 0.08, 0, 2 * Math.PI, false);
			ctx.stroke();
			ctx.strokeStyle = 'rgba(255,0,0,0.5)';
			ctx.beginPath();
			ctx.arc(e.clientX - rect.left, e.clientY - rect.top, Math.min(width, height) * 0.09, 0, 2 * Math.PI, false);
			ctx.stroke();
		});
		return refreshBackground;
	};
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

	var width = 800;    // We will scale the photo width to this
	var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

	var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

	var video = null;
	var canvas = null;
	var photo = null;
	var startbutton = null;
	var refreshBackground = null;

	function startup() {
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		startbutton = document.getElementById('startbutton');

		var front = false;
		navigator.mediaDevices.getUserMedia({video: { facingMode: (front ? "user" : "environment") }, audio: false})
		.then(function(stream) {
			video.srcObject = stream;
			video.play();
		})
		.catch(function(err) {
			//console.log("An error occurred: " + err);
			alert("An error occurred: " + err);
		});

		video.addEventListener('canplay', function(ev){
			if (!streaming) {
				height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
				if (isNaN(height)) {
					height = width / (4/3);
				}
      
				video.setAttribute('width', width);
				video.setAttribute('height', height);
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', height);
				streaming = true;
				refreshBackground = canvasCircle(canvas);
				clearphoto();
			}
		}, false);

		function takePhoto (ev) {
			takepicture();
			ev.preventDefault();
		};
	
		document.getElementById('video_div').addEventListener('click', takePhoto, false);
		clearphoto();
	}



	function clearphoto() {
		var context = canvas.getContext('2d');
		context.fillStyle = "#778899";
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
  


	function takepicture() {
		var context = canvas.getContext('2d');
		if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);
			refreshBackground();
		} else {
			clearphoto();
		}
	}

  // Set up our event listener to run the startup process
  // once loading is complete.
	window.addEventListener('load', startup, false);
	window.addEventListener('load', () => {
		document.body.addEventListener('click', function (e) {
			if (e.target.tagName.toLowerCase() === 'button') {
				e.target.blur();
			}
		}, true);
	}, false);
})();
