const GuillotineJS = () => {
  let generated = false;

  const centerCutoff = (x, y) => {
    coverElement.style.top = y + "px";
    coverElement.style.left = x + "px";
    coverElement.style.position = "fixed";
  };

  document.onkeydown = (e) => {
    if (e.key.toLowerCase() == "v" && e.ctrlKey && e.shiftKey && !generated) {
      init();
      e.preventDefault();
    }
  };

  const videoElement = document.createElement("video");

  const videoSelectorElement = document.createElement("select");
  videoSelectorElement.id = "guillotine-selector";
  const lower = "font-size: 10px; position: absolute; font-family: monoid;";
  let helpP = document.createElement("p");
  let helpText = document.createTextNode(
    "Tap on dotted frame to give it focus and press ? for help"
  );
  helpP.appendChild(helpText);
  helpP.style = lower + "right: 5px; bottom: 0px;";
  videoSelectorElement.id = "guillotine-selector";
  videoSelectorElement.style = "height: 15px; bottom: 5px;" + lower;

  const coverElement = document.createElement("div");

  coverElement.id = "guillotine-cover";
  coverElement.style =
    "height: 200px; width: 200px; position: relative; display: inline-block; object-fit: cover; overflow: hidden; border: 2px dashed blue; background-color: rgba(0, 0, 0, 0.005); z-index: 10000; outline: none;";

  coverElement.tabIndex = 0;

  videoElement.id = "guillotine-video";
  videoElement.style =
    "position: absolute; width: 800px; height: 600px; top: 5px; left:  5px; scale: 1; z-index: 5000;";
  videoElement.autoplay = true;

  const videoWrapperElement = document.createElement("div");

  videoWrapperElement.id = "#guillotine-video-wrapper";

  videoWrapperElement.style = "height: 200px; width: 200px;";

  videoWrapperElement.appendChild(coverElement);

  videoWrapperElement.appendChild(videoElement);
  videoWrapperElement.appendChild(videoSelectorElement);
  videoWrapperElement.appendChild(helpP);

  const modalElement = document.createElement("div");

  modalElement.id = "guillotine-modal";
  modalElement.style =
    "left: 0px; top: 0px; position: fixed; border: 2px solid black; border-radius: 5px; height: 630px; width: 810px; background:rgba(0, 0, 0, 0.5); z-index: 5000; visibility: hidden;";

  let style = document.createElement("style");

  style.innerHTML = `@font-face {
            font-family: 'monoidregular';
            src: url('data:font/woff2;base64, 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') format('woff2');        
			}`;

  let helpElement = document.createElement("div");
  helpElement.appendChild(style);
  helpElement.style =
    "font-family: monoid; visibility: hidden; display: none; font-size: 110%; width: 40%; margin: auto; margin-top: 10%;";
  let pStyle = "margin: 0; font-size: 110%;";

  let m = document.createElement("p");
  m.style = pStyle;
  let mText = document.createTextNode("-: Make frame smaller");
  m.appendChild(mText);
  let p = document.createElement("p");
  p.style = pStyle;
  let pText = document.createTextNode("+: Make frame larger");
  p.appendChild(pText);
  let r = document.createElement("p");
  r.style = pStyle;
  let rText = document.createTextNode("R: Make frame rounder");
  r.appendChild(rText);
  let s = document.createElement("p");
  s.style = pStyle;
  let sText = document.createTextNode("S: Make frame squarer");
  s.appendChild(sText);
  let h = document.createElement("p");
  h.style = pStyle;
  let hText = document.createTextNode("?: Make this go away");
  h.appendChild(hText);
  let sp = document.createElement("p");
  sp.style = pStyle;
  let spText = document.createTextNode("SPACE: Cut off frame");
  sp.appendChild(spText);
  let desc = document.createElement("p");
  desc.style = pStyle;
  desc.innerHTML =
    "<a href='https://github.com/rberenguel/GuillotineJS' target='_blank' style='font-size: 70%'>GuillotineJS by Ruben Berenguel, 2021</a><br/><br/> You can use your scroll wheel to adjust the size of the frame, or the shortcuts below. <br/><br/> Once the frame has been cut, you can still use +/-/R/S to reshape the floating cut camera<br/><br/>";
  helpElement.append(desc, p, m, r, s, h, sp);
  modalElement.appendChild(helpElement);
  modalElement.appendChild(videoWrapperElement);
  document.body.appendChild(modalElement);

  let coverTransform = {
    x: 0,
    y: 0,
    scale: 1,
    radius: 50,
    borderType: "px dashed blue",
  };

  const transformElement = (element, transform, scaleFirst) => {
    let str = "";
    if (scaleFirst) {
      str += ` scale(${transform.scale})`;
    }
    if (transform.x !== undefined) {
      str += `translate(${transform.x}px,${transform.y}px)`;
    }
    if (transform.scale !== undefined && !scaleFirst) {
      str += ` scale(${transform.scale})`;
    }
    element.style.transform = str;
    if ("radius" in transform) {
      element.style["border-radius"] = transform.radius + "%";
    }
  };

  const generateFloatingDiv = (arg) => {
    const scale = 1 / coverTransform.scale;
    const scaledOffsetX = (800 - 800 * scale) / 2;
    const scaledOffsetY = (600 - 600 * scale) / 2;
    videoElement.style.top = -scaledOffsetY + "px";
    videoElement.style.left = -scaledOffsetX + "px";
    let x =
      -arg.coverOffset.left + arg.videoOffset.left - 2 / coverTransform.scale;
    let y =
      -arg.coverOffset.top + arg.videoOffset.top - 2 / coverTransform.scale;
    videoElement.style.transform = transformElement(
      videoElement,
      {
        x: x,
        y: y,
        scale: 1 / coverTransform.scale,
      },
      true
    );
    coverTransform.borderType = "px solid black";
    coverElement.style.border =
      2 / coverTransform.scale + coverTransform.borderType;
    coverElement.appendChild(videoElement);
    videoElement.addEventListener("wheel", (e) => {
      coverScale(e);
      e.preventDefault();
    });
    document.body.appendChild(coverElement);
    rect = modalElement.getBoundingClientRect();
    modalElement.remove();
    centerCutoff(rect.x, rect.y);
    generated = true;
  };

  const gotStream = (stream) => {
    window.stream = stream;
    videoElement.srcObject = stream;
  };

  const getStream = (forcedDevice) => {
    const device = videoSelectorElement.value || forcedDevice;
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }

    let video = {
      width: {
        ideal: 800,
      },
      height: {
        ideal: 600,
      },
      deviceId: device
        ? {
            exact: device,
          }
        : undefined,
    };
    const constraints = {
      audio: false,
      video: video,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  };

  // TODO: Refactor to move this

  videoSelectorElement.onchange = getStream;

  const handleError = (error) => {
    console.error("Error: ", error);
  };

  const configureDrag = (elementQ) => {
    let container = document.querySelector(elementQ);
    let rect = container.getBoundingClientRect();
    let active = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = coverTransform.x,
      yOffset = coverTransform.y;
    const dragStart = (ev) => {
      if (ev.type === "touchstart") {
        initialX = ev.touches[0].clientX - xOffset;
        initialY = ev.touches[0].clientY - yOffset;
      } else {
        initialX = ev.clientX - xOffset;
        initialY = ev.clientY - yOffset;
      }
      if (ev.target === container || ev.target === videoElement) {
        active = true;
      }
    };

    const drag = (ev) => {
      if (active) {
        ev.preventDefault();

        if (ev.type === "touchmove") {
          currentX = ev.touches[0].clientX - initialX;
          currentY = ev.touches[0].clientY - initialY;
        } else {
          currentX = ev.clientX - initialX;
          currentY = ev.clientY - initialY;
        }
        let top = currentY;
        let left = currentX;
        coverTransform.x = left;
        coverTransform.y = top;

        xOffset = currentX;
        yOffset = currentY;

        transformElement(coverElement, coverTransform);
      }
    };

    const dragEnd = () => {
      initialX = currentX;
      initialY = currentY;
      active = false;
    };
    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);
  };

  const largerFrame = () => {
    if (coverTransform.scale > 8) {
      return;
    }
    coverTransform.scale *= 1.03;
    transformElement(coverElement, coverTransform);
    coverElement.style.border =
      2 / coverTransform.scale + coverTransform.borderType;
  };

  const smallerFrame = () => {
    if (coverTransform.scale < 0.1) {
      return;
    }
    coverTransform.scale /= 1.03;
    transformElement(coverElement, coverTransform);
    coverElement.style.border =
      2 / coverTransform.scale + coverTransform.borderType;
  };

  const coverScale = (e) => {
    if (e.deltaY > 0) {
      largerFrame();
    } else if (e.deltaY < 0) {
      smallerFrame();
    }
  };

  const makeRounder = () => {
    let radius = coverTransform.radius;
    radius = radius + 5;
    if (radius >= 50) {
      radius = 50;
    }
    coverTransform.radius = radius;
    transformElement(coverElement, coverTransform);
  };

  const makeSquarer = () => {
    let radius = coverTransform.radius;
    radius = radius - 5;
    if (radius < 0) {
      radius = 0;
    }
    coverTransform.radius = radius;
    transformElement(coverElement, coverTransform);
  };

  for (let element of [coverElement, videoElement]) {
    element.onkeydown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key == " " && !generated) {
        generate();
      }
      if (e.key == "r") {
        makeRounder();
      }
      if (e.key == "s") {
        makeSquarer();
      }
      if (e.key == "-") {
        smallerFrame();
      }
      if (e.key == "+") {
        largerFrame();
      }
      if (e.key == "?") {
        let vis = helpElement.style.visibility;
        if (vis == "visible") {
          helpElement.style.visibility = "hidden";
          helpElement.style.display = "none";
          videoWrapperElement.style.visibility = "visible";
        } else {
          helpElement.style.visibility = "visible";
          helpElement.style.display = "block";
          videoWrapperElement.style.visibility = "hidden";
        }
      }
    };
  }

  const centerCover = () => {
    const left = 800 / 2 - 100;
    const top = 600 / 2 - 100;
    coverTransform.x = left;
    coverTransform.y = top;
    transformElement(coverElement, coverTransform);
  };

  const gotDevices = (deviceInfos) => {
    let videoDevices = {};
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement("option");
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === "videoinput") {
        option.text =
          deviceInfo.label || "camera " + (videoSelectorElement.length + 1);
        videoSelectorElement.appendChild(option);
      } else {
        console.log("Found another kind of device: ", deviceInfo);
      }
    }
  };

  const generate = () => {
    let rect = coverElement.getBoundingClientRect();
    let coverOffset = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
      top: rect.top,
      left: rect.left,
    };
    rect = videoElement.getBoundingClientRect();
    let videoOffset = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
      top: rect.top,
      left: rect.left,
    };
    generateFloatingDiv({
      width: coverOffset.width,
      height: coverOffset.height,
      videoWidth: videoOffset.width,
      videoHeight: videoOffset.height,
      coverOffset: coverOffset,
      videoOffset: videoOffset,
      coverTransform: coverTransform,
    });
  };

  const init = () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices)
      .then(getStream());
    modalElement.style.top = (window.innerHeight - 600) / 2 + "px";
    modalElement.style.left = (window.innerWidth - 800) / 2 + "px";
    modalElement.style.visibility = "visible";
    centerCover();
    coverElement.addEventListener("wheel", (e) => {
      coverScale(e);
      e.preventDefault();
    });
    configureDrag("#guillotine-cover");
  };

  if (document.currentScript.src.endsWith("init")) {
    console.log("Initialising GuillotineJS modal directly");
    init();
  }
};

GuillotineJS();
