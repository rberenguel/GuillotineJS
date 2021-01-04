const GuillotineJS = () => {

  let generated = false;

  const centerCutoff = () => {
    coverElement.style.top = 0 + "px"
    coverElement.style.left = 0 + "px"
    coverElement.style.position = "absolute"
  }

  document.onkeydown = (e) => {
    console.log("Fucking key down", e)
    if (e.key.toLowerCase() == "v" && e.ctrlKey && e.shiftKey && !generated) {
      console.log("FUUU")
      init();
      e.preventDefault();
    }
  }

  const videoElement = document.createElement("video");

  const videoSelectorElement = document.createElement("select")
  videoSelectorElement.id = "guillotine-selector"
  videoSelectorElement.style = "height: 15px; font-size: 10px; position: absolute; bottom: 5px;"
  const coverElement = document.createElement("div")

  coverElement.id = "guillotine-cover"
  coverElement.style = "height: 200px; width: 200px; position: relative; display: inline-block; object-fit: cover; overflow: hidden; border: 2px dashed blue; background-color: rgba(0, 0, 0, 0.005); z-index: 10000; outline: none;"

  coverElement.tabIndex = 0

  videoElement.id = "guillotine-video"
  videoElement.style = "position: absolute; width: 800px; height: 600px; top: 5px; left:  5px; scale: 1; z-index: 5000;"
  videoElement.autoplay = true

  const videoWrapperElement = document.createElement("div")

  videoWrapperElement.id = "#guillotine-video-wrapper";

  videoWrapperElement.style = "height: 200px; width: 200px;"

  videoWrapperElement.appendChild(coverElement)

  videoWrapperElement.appendChild(videoElement)
  videoWrapperElement.appendChild(videoSelectorElement)

  const modalElement = document.createElement("div")

  modalElement.id = "guillotine-modal"
  modalElement.style = "left: 0px; top: 0px; position: absolute; border: 2px solid black; border-radius: 5px; height: 630px; width: 810px; background:rgba(0, 0, 0, 0.5); z-index: 5000; visibility: hidden;"

  modalElement.appendChild(videoWrapperElement)
  document.body.appendChild(modalElement)

  let coverTransform = {
    x: 0,
    y: 0,
    scale: 1,
    radius: 50,
    borderType: "px dashed blue"
  };

  const transformElement = (element, transform, scaleFirst) => {
    console.log(transform)
    let str = ""
    if (scaleFirst) {
      str += ` scale(${transform.scale})`
    }
    if (transform.x !== undefined) {
      str += `translate(${transform.x}px,${transform.y}px)`
    }
    if (transform.scale !== undefined && !scaleFirst) {
      str += ` scale(${transform.scale})`
    }
    element.style.transform = str
    if ("radius" in transform) {
      element.style["border-radius"] = transform.radius + "%";
    }
  }

  const generateFloatingDiv = (arg) => {

    const scale = 1 / coverTransform.scale;
    const scaledOffsetX = (800 - 800 * scale) / 2
    const scaledOffsetY = (600 - 600 * scale) / 2
    videoElement.style.top = -scaledOffsetY + "px"
    videoElement.style.left = -scaledOffsetX + "px"
    let x = -arg.coverOffset.left + arg.videoOffset.left - (2 / coverTransform.scale)
    let y = -arg.coverOffset.top + arg.videoOffset.top - (2 / coverTransform.scale)
    videoElement.style.transform = transformElement(videoElement, {
      x: x,
      y: y,
      scale: 1 / coverTransform.scale,
    }, true);
    coverTransform.borderType = "px solid black"
    coverElement.style.border = 2 / coverTransform.scale + coverTransform.borderType
    coverElement.appendChild(videoElement)
    videoElement.addEventListener("wheel", (e) => {
      coverScale(e);
      e.preventDefault();
    });
    document.body.appendChild(coverElement)
    modalElement.remove()
    centerCutoff()
    generated = true;
  }

  const gotStream = (stream) => {
    window.stream = stream;
    videoElement.srcObject = stream;
  }

  const getStream = (forcedDevice) => {
    const device = videoSelectorElement.value || forcedDevice
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }

    let video = {
      width: {
        ideal: 800
      },
      height: {
        ideal: 600
      },
      deviceId: device ? {
        exact: device
      } : undefined
    }
    const constraints = {
      audio: false,
      video: video
    };

    console.log("Requesting ", constraints)

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  }

  // TODO: Refactor to move this

  videoSelectorElement.onchange = getStream;


  const handleError = (error) => {
    console.error("Error: ", error);
  }

  const configureDrag = (elementQ) => {
    let container = document.querySelector(elementQ)
    let rect = container.getBoundingClientRect();
    console.log("drafleft:", rect)
    let active = false
    let currentX, currentY, initialX, initialY;
    let xOffset = coverTransform.x,
      yOffset = coverTransform.y
    const dragStart = (ev) => {
      if (ev.type === "touchstart") {
        initialX = ev.touches[0].clientX - xOffset
        initialY = ev.touches[0].clientY - yOffset
      } else {
        initialX = ev.clientX - xOffset
        initialY = ev.clientY - yOffset
      }
      if (ev.target === container || ev.target === videoElement) {
        active = true
      }
    }

    const drag = (ev) => {
      if (active) {

        ev.preventDefault()

        if (ev.type === "touchmove") {
          currentX = ev.touches[0].clientX - initialX
          currentY = ev.touches[0].clientY - initialY
        } else {
          currentX = ev.clientX - initialX
          currentY = ev.clientY - initialY
        }
        let top = currentY
        let left = currentX
        coverTransform.x = left;
        coverTransform.y = top;

        xOffset = currentX
        yOffset = currentY

        transformElement(coverElement, coverTransform);
      }
    }

    const dragEnd = () => {
      initialX = currentX
      initialY = currentY
      active = false
    }
    container.addEventListener("touchstart", dragStart, false)
    container.addEventListener("touchend", dragEnd, false)
    container.addEventListener("touchmove", drag, false)

    container.addEventListener("mousedown", dragStart, false)
    container.addEventListener("mouseup", dragEnd, false)
    container.addEventListener("mousemove", drag, false)
  }

  const largerFrame = () => {
    if (coverTransform.scale > 8) {
      return;
    }
    coverTransform.scale *= 1.03;
    transformElement(coverElement, coverTransform);
    coverElement.style.border = 2 / coverTransform.scale + coverTransform.borderType;
  };

  const smallerFrame = () => {
    if (coverTransform.scale < 0.1) {
      return;
    }
    coverTransform.scale /= 1.03;
    transformElement(coverElement, coverTransform);
    coverElement.style.border = 2 / coverTransform.scale + coverTransform.borderType;
  };

  const coverScale = (e) => {
    if (e.deltaY > 0) {
      largerFrame();
    } else if (e.deltaY < 0) {
      smallerFrame();
    }
  }

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
    };
  }

  const centerCover = () => {
    console.log(coverTransform);
    const left = 800 / 2 - 100;
    const top = 600 / 2 - 100;
    coverTransform.x = left;
    coverTransform.y = top;
    console.log(coverTransform);
    transformElement(coverElement, coverTransform);
  };

  const gotDevices = (deviceInfos) => {
    let videoDevices = {};
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement("option");
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === "videoinput") {
        option.text = deviceInfo.label || "camera " + (videoSelectorElement.length + 1);
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
    })
  };

  const init = () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    navigator.mediaDevices.enumerateDevices().then(gotDevices).then(getStream());
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

  if(document.currentScript.src.endsWith("init")){
    console.log("Initialising GuillotineJS modal directly")
    init();
  }
}

GuillotineJS()