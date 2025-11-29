const run = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  const video = document.getElementById("video");
  video.srcObject = stream;

  const btn = document.getElementById("btn");
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  ]);


  const canvas = document.getElementById("canvas");
  canvas.width = video.width;
  canvas.height = video.height;

  setInterval(async () => {
    let detections = await faceapi.detectAllFaces(
      video,
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 })

    );



    detections = faceapi.resizeResults(detections, {
      width: video.width,
      height: video.height,
    });
    console.log(detections)
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw green boxes manually
    detections.forEach(det => {
      const box = det.box
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "lime";
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.stroke();
    });

    // Button color change logic
    if (detections.length > 0) {
      btn.style.background = "green";
      btn.style.color = "white";
      btn.textContent = "Switched On";
       fetch("http://192.168.29.150/?status=on");
    } else {
      btn.style.background = "red";
      btn.style.color = "white";
      btn.textContent = "Switched Off";
       fetch("http://192.168.29.150/?status=off");
    }
  }, 500);
};

run();
