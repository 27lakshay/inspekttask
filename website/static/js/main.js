function login(e) {
  e.preventDefault();
  let email = document.querySelector('[name="email"]').value;
  let password = document.querySelector('[name="password"]').value;

  let formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password", password);
  const url = window.location.href;
  const options = {
    // mode: "no-cors",
    method: "POST",
    body: formdata,
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => localStorage.setItem("token", data.token))
    .then(() => window.location.assign("/"));
}
function register(e) {
  e.preventDefault();
  let name = document.querySelector('[name="name"]').value;
  let email = document.querySelector('[name="email"]').value;
  let password = document.querySelector('[name="password"]').value;

  let formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("password", password);
  const url = window.location.href;
  const options = {
    // mode: "no-cors",
    method: "POST",
    body: formdata,
  };
  fetch(url, options)
    .then((response) => response.json())
    .then(() => window.location.assign("/login"));
}


function imageZoom(imgID, resultID) {
  var img, lens, result, cx, cy;
  img = document.getElementById(imgID);
  result = document.getElementById(resultID);
  /*create lens:*/
  lens = document.createElement("DIV");
  lens.setAttribute("class", "img-zoom-lens");
  /*insert lens:*/
  img.parentElement.insertBefore(lens, img);
  /*calculate the ratio between result DIV and lens:*/
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /*set background properties for the result DIV:*/
  result.style.backgroundImage = "url('" + img.src + "')";
  result.style.backgroundSize = img.width * cx + "px " + img.height * cy + "px";
  /*execute a function when someone moves the cursor over the image, or the lens:*/
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);
  /*and also for touch screens:*/
  lens.addEventListener("touchmove", moveLens);
  img.addEventListener("touchmove", moveLens);
  function moveLens(e) {
    var pos, x, y;
    /*prevent any other actions that may occur when moving over the image:*/
    e.preventDefault();
    /*get the cursor's x and y positions:*/
    pos = getCursorPos(e);
    /*calculate the position of the lens:*/
    x = pos.x - lens.offsetWidth / 2;
    y = pos.y - lens.offsetHeight / 2;
    /*prevent the lens from being positioned outside the image:*/
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }
    /*set the position of the lens:*/
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /*display what the lens "sees":*/
    result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
  }
  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}

// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}

//Add file blob to a form and post
function postFile(file) {
  let formdata = new FormData();
  console.log(file);
  var d = new Date();
  var filename = d.getTime();
  formdata.append("image", file, "capture" + filename + ".jpg");
  const url = window.location.href.replace("/captureimage", "/uploadimage");
  const options = {
    mode: "no-cors",
    method: "POST",
    body: formdata,
  };
  fetch(url, options).then((response) => (window.location.href = response.url));
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraSensor.toBlob(postFile, "image/jpeg");
  cameraOutput.classList.add("taken");
};

window.addEventListener("load", cameraStart, false);
