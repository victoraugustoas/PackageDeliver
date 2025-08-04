import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Button from "@mui/material/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export function CameraStream() {
  const [start, setStart] = useState<boolean>(false);
  const [predictionClasses, setPredictionClasses] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const getCameraStream = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const getPrediction = useCallback(async () => {
    const model = await cocoSsd.load();
    setInterval(async () => {
      if (!videoRef.current) return;
      const predictions = await model.detect(videoRef.current);
      console.log(predictions);
      setPredictionClasses(predictions.map((prediction) => prediction.class));
    }, 1000);
  }, []);

  useEffect(() => {
    if (start) {
      getPrediction();
    }
  }, [getPrediction, start]);

  return (
    <>
      {start ? (
        <>
          <video ref={videoRef} autoPlay></video>
          <canvas id="canvas" style={{ display: "none" }}></canvas>
          <ul>
            {predictionClasses.map((predictionClass) => (
              <li>{predictionClass}</li>
            ))}
          </ul>
        </>
      ) : (
        <Button
          variant="contained"
          startIcon={<PhotoCamera />}
          onClick={() => {
            setStart(true);
            getCameraStream();
          }}
        >
          Iniciar Stream da Camera
        </Button>
      )}
    </>
  );
}
