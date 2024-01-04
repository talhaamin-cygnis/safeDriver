import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as tf from "@tensorflow/tfjs";
import {
  cameraWithTensors,
  fetch,
  bundleResourceIO,
} from "@tensorflow/tfjs-react-native";
import COLORS, { primaryShades } from "../../../config/color";
import * as Location from "expo-location";
import moment from "moment";
import useFirestoreCalls from "../../../hooks/useFirestoreCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as jpeg from "jpeg-js";

const TensorCamera = cameraWithTensors(Camera);

const DrowsinessDetection = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [drowsinessDetector, setDrowsinessDetector] = useState("");
  const [shouldStartPrediction, setShouldStartPrediction] = useState(false);
  const [shouldStartRide, setShouldStartRide] = useState(false);
  const [userFace, setUserFace] = useState();
  const [userIncidents, setUserIncidents] = useState([]);
  const cameraRef = useRef(null);
  const shouldCheckForDrowsiness = useRef(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let frameCount = 0;
  let makePredictionsEveryNFrame = 1;
  let requestAnimationFrameId = 0;
  const { startNewRide, onDrowsinessDetected, endRide } = useFirestoreCalls();
  const currentRide = useRef("");
  const [sound, setSound] = React.useState();
  const lastOccuredIncident = useRef();
  const [isDetectingDrowsiness, setIsDetectingDrowsiness] = useState(false);

  const startPrediction = async (model, tensor) => {
    try {
      // predict against the model
      const output = await model.predict(tensor, { batchSize: 1 });
      console.log("output ", output);
      return output.dataSync();
    } catch (error) {
      console.log("Error predicting from tesor image", error);
    }
  };

  // const handleCameraStream = (tensors) => {
  //   if (!tensors) {
  //     console.log("Image not found!");
  //   }
  //   const loop = async () => {
  //     console.log("--- ", frameCount);
  //     if (frameCount % makePredictionsEveryNFrame === 0) {
  //       const imageTensor = tensors.next().value;
  //       if (drowsinessDetector) {
  //         const imageTensorReshaped = imageTensor.expandDims(0);
  //         const results = await startPrediction(
  //           drowsinessDetector,
  //           imageTensorReshaped
  //         );
  //         console.log("results ", results);
  //       }
  //       tf.dispose(imageTensorReshaped);
  //     }
  //     frameCount += 1;
  //     frameCount = frameCount % makePredictionsEveryNFrame;
  //     requestAnimationFrameId = requestAnimationFrame(loop);
  //   };
  //   loop();
  // };

  function imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }
    return tf.tensor3d(buffer, [height, width, 3]);
  }

  const getPrediction = useCallback(
    async (tensor) => {
      if (!tensor) {
        return;
      }
      // let faceTensor = tensor.slice(
      //   [parseInt(faces[0].topLeft[1]), parseInt(faces[0].topLeft[0]), 0],
      //   [width, height, 3]
      // );
      // let faceTensor = tensor
      //   .resizeBilinear([224, 224])
      //   .reshape([1, 224, 224, 3]);
      //const output = await models.predict(imageTensorReshaped, { batchSize: 1 });
      if (shouldStartRide) {
        imageToTensor(tensor);
        const prediction = await drowsinessDetector.predict(tensor).data();
        console.log(`prediction: ${JSON.stringify(prediction)}`);
      }
    },
    [shouldStartRide]
  );

  const handleCameraStream = async (imageAsTensors) => {
    const loop = async () => {
      const nextImageTensor = await imageAsTensors.next().value;
      nextImageTensor.reshape([-1, 24, 24, 3]);
      await getPrediction(nextImageTensor);
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    loop();
  };

  const loadModel = async () => {
    await tf.ready();
    const modelJson = await require("../../../assets/model/model.json");
    const modelWeight = await require("../../../assets/model/group1-shard.bin");
    const drowsinessDetector = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeight)
    );
    setDrowsinessDetector(drowsinessDetector);
  };

  useEffect(() => {
    loadModel();
  }, []);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setLocation(location);
  };

  useEffect(() => {
    getUserLocation();
    loadSound();
  }, []);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/audio/emergency_tone.mp3"),
      { shouldPlay: false }
    );
    setSound(sound);
  };

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("loggedInUser");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const startRide = async () => {
    if (shouldStartRide) {
      sound.setStatusAsync({ shouldPlay: false });
      setIsDetectingDrowsiness(false);
      endRide(currentRide.current);
    } else {
      let user = await getUserData();
      let newRide = {
        id: "0",
        created_at: moment(new Date()).format("llll"),
        user_id: user.id,
        incidents: [],
        isActive: true,
      };
      startNewRide(newRide).then((rideId) => {
        currentRide.current = rideId;
      });
    }
    lastOccuredIncident.current = moment(new Date());
    setShouldStartRide((prev) => !prev);
  };

  useEffect(() => {
    if (userFace && userFace.faces.length > 0 && shouldStartRide) {
      if (
        (userFace.faces?.[0]?.leftEyeOpenProbability < 0.4 &&
          userFace.faces?.[0]?.rightEyeOpenProbability < 0.4) ||
        userFace.faces?.[0]?.rollAngle < 0 ||
        userFace.faces?.[0]?.yawAngle < 0
      ) {
        sound?.setStatusAsync({ shouldPlay: true });
        setIsDetectingDrowsiness(true);
        let now = moment(new Date());
        let last = moment(lastOccuredIncident.current);
        let diff = now.diff(last, "seconds");
        if (diff >= 5) {
          let drowsiness = {
            id: "0",
            latitude: location?.coords?.latitude ?? 0.0,
            longitude: location?.coords?.longitude ?? 0.0,
            created_At: moment(new Date()).format("llll"),
            speed: location?.coords?.speed,
          };
          userIncidents.push(drowsiness);
          setUserIncidents(userIncidents);
          onDrowsinessDetected(userIncidents, currentRide.current);
        }
        lastOccuredIncident.current = moment(new Date());
        shouldCheckForDrowsiness.current = true;
      } else {
        sound?.setStatusAsync({ shouldPlay: false });
        setIsDetectingDrowsiness(false);
        shouldCheckForDrowsiness.current = true;
      }
    } else {
      if (shouldStartRide) {
        sound?.setStatusAsync({ shouldPlay: true });
        setIsDetectingDrowsiness(true);
      } else {
        sound?.setStatusAsync({ shouldPlay: false });
        setIsDetectingDrowsiness(false);
        lastOccuredIncident.current = undefined;
      }
    }
  }, [userFace, shouldStartRide, location, sound]);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <>
      <View style={styles.container}>
        <TensorCamera
          ref={cameraRef}
          // Standard Camera props
          style={styles.camera}
          type={Camera.Constants.Type.front}
          flashMode={Camera.Constants.FlashMode.off}
          // Tensor related props
          cameraTextureHeight={Dimensions.get("window").height}
          cameraTextureWidth={Dimensions.get("window").width}
          resizeHeight={24}
          resizeWidth={24}
          resizeDepth={3}
          onReady={(tensors) => handleCameraStream(tensors)}
          onFacesDetected={(faces) => setUserFace(faces)}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.accurate,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true,
          }}
          autorender={true}
        />
        <TouchableOpacity style={styles.button} onPress={startRide}>
          <Text style={styles.buttonText}>
            {shouldStartRide ? "End Ride" : "Start Ride"}
          </Text>
        </TouchableOpacity>
        {userFace &&
          userFace.faces.length > 0 &&
          userFace.faces.map((user) => {
            return (
              <View
                style={[
                  styles.face,
                  {
                    height: user?.bounds.size.height,
                    width: user?.bounds.size.width,
                    top: user?.bounds.origin.y,
                    left: user?.bounds.origin.x,
                    borderColor: isDetectingDrowsiness
                      ? COLORS.red
                      : COLORS.green1,
                  },
                ]}
              />
            );
          })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: primaryShades.blue[900],
    height: 44,
    width: Dimensions.get("window").width - 40,
    position: "absolute",
    zIndex: 99999,
    alignSelf: "center",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  face: {
    borderWidth: 1,
    position: "absolute",
    borderRadius: 6,
    zIndex: 99999,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DrowsinessDetection;
