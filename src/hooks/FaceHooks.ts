import { RefObject, useEffect, useState } from "react";
import * as faceapi from 'face-api.js';
import randomstring from "@/lib/randomstring";

const useFaceDetection = () => {
  const [detection, setDetection] = useState<faceapi.FaceDetection | null>(null); // Detected face

  useEffect(() => {
    // Load the face detection models
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        console.log('Models loaded');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  const getDescriptors = async ( videoRef: RefObject<HTMLVideoElement> ) => {
    if (!videoRef.current) {
      return;
    }

    const result = await faceapi
      .detectSingleFace(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions(),
      )
      .withFaceLandmarks(true)
      .withFaceDescriptor();
    
    if (!result) {
      console.error("No face detected");
      return;
    }


    const faceName = randomstring(6);
    const labeledDescriptor = new faceapi.LabeledFaceDescriptors(faceName, [
      result.descriptor,
    ]);

    console.log('result', labeledDescriptor);

    setDetection(result.detection);

    // tähän tavita return vain silloin kun ei ole dbta??
    return labeledDescriptor;

  };

  // const matchFace = async (currentDescriptors, descriptorsFromDB) => {
  //   if (currentDescriptors && descriptorsFromDB.length > 0) {
  //     const faceMatcher = new faceapi.FaceMatcher(descriptorsFromDB);

  //     return faceMatcher.matchDescriptor(currentDescriptors.descriptor)
  //   }
  // };

  return { detection, getDescriptors };
    
};

export { useFaceDetection };