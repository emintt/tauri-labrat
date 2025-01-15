import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type CameraProps = {
  width: number;
  aspect: number;
}

const Camera = forwardRef<HTMLVideoElement, CameraProps>((props, ref) => {

  const { width, aspect } = props;
  const height = width / aspect;
  
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element

  // jaetaan videoRef parentille (lähetetäään refin kanssa videoRef)
  useImperativeHandle(ref, () => videoRef.current!);

  useEffect(() => {
    const setupVideoInput = async () => {
      try {
        if (videoRef.current) {
          // getUserMedia
          const stream =  await navigator.mediaDevices.getUserMedia({
            audio: false, 
            video: {width: width, height: height}
          });
          // srcObject
          videoRef.current.srcObject = stream;
          // play
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }
        
      } catch (error) {
        console.error("Error setting video input", (error as Error).message);
      }
    };
    setupVideoInput();
  }, []);
  
  return <video ref={videoRef} width={width} height={height} />

});

export default Camera;