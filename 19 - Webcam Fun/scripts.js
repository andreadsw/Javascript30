const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      // Convert video to something that video player can understand
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(`OH NO!!!`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // red effect on the image
    //pixels = redEffect(pixels);

    // rgb effect
    //pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.8;

    // green effect
    pixels = greenScreen(pixels);

    // put them back
    ctx.putImageData(pixels, 0, 0);
    // every 16 milliseconds
  }, 16);
}

function takePhoto() {
  // Play the sound
  snap.currentTime = 0;
  snap.play();

  // Take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  // Create a link
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "Beautiful");
  //link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Beautiful" />`;
  strip.insertBefore(link, strip.firstChild);
  console.log(data);
}

// Making Filters effect

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 150; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 500] = pixels.data[i + 1]; // green
    pixels.data[i - 550] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

// Playing with the sliders
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  //console.log(levels);

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out! Alpha
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
