import "./App.css";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect, useState, useRef } from "react";
import { generateAudioFromAzure, sendMessageToAI } from "./api/chat/chat";
import { parseResponseMessage } from "./utils/messages";
import live2dConfig from "./config/live2dConfig";
import { useTypingEffect } from "./hooks/useTypingEffect";
import { CirclesWithBar } from 'react-loader-spinner'
import { getRole } from "./utils/promt";

window.PIXI = PIXI;

let jwt = null;

window.setJwtToken = (token) => {
  console.log("Received JWT Token: ", token);
  jwt = token;

  if (window.flutter_inappwebview) {
    window.flutter_inappwebview
      .callHandler("flutterHandler", {
        status: "success",
        message: "JWT token received",
      })
      .then(function (result) {
        console.log(result);
      });
  }
};

function App() {
  const [pixiApp, setPixiApp] = useState(null);
  const [live2dModel, setLive2dModel] = useState(null);
  const [modelName, setModelName] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const audioCtxRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const live2dModelRef = useRef(null);

  const text = useTypingEffect(responseMessage, 100);

  const initializeAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    // Try to resume the AudioContext if it's in a suspended state
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().then(() => {
        console.log('AudioContext resumed successfully');
        setAudioReady(true);
      });
    } else {
      setAudioReady(true);
    }
  };

  useEffect(() => {
    live2dModelRef.current = live2dModel;
  }, [live2dModel]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const getLive2dModelName = async (name) => {
      console.log("Received name in React App: ", name);
      setModelName(name)

      if (window.flutter_inappwebview) {
        window.flutter_inappwebview
          .callHandler("flutterHandler", {
            status: "success",
            message: "Live2d Model Name received in React App",
          })
          .then(function (result) {
            console.log(result);
          });
      }
    };
    // 将函数绑定到window对象
    window.getLive2dModelName = getLive2dModelName;

    // 组件卸载时，清理
    return () => {
      delete window.getLive2dModelName;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMessage = async (event) => {
      const receivedMessage = event.data
      if (receivedMessage && receivedMessage.type) {
        const type = receivedMessage.type
        if (type === 'modelName') {
          const modelName = receivedMessage.data
          const live2dModel = await Live2DModel.from(live2dConfig[modelName].path);
          setModelName(modelName)
          setLive2dModel(live2dModel)
        } else if (type === 'transcript') {
          const transcript = receivedMessage.data
          const jwt = receivedMessage.jwt
          await handleSendMessage(transcript, true, jwt)
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!live2dModel) return;
    const getTextFromFlutter = async (text) => {
      console.log("Received Text in React App: ", text);
      await handleSendMessage(text, true);

      if (window.flutter_inappwebview) {
        window.flutter_inappwebview
          .callHandler("flutterHandler", {
            status: "success",
            message: "Text received in React App",
          })
          .then(function (result) {
            console.log(result);
          });
      }
    };

    // 将函数绑定到window对象
    window.getTextFromFlutter = getTextFromFlutter;

    // 组件卸载时，清理
    return () => {
      delete window.getTextFromFlutter;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live2dModel]);

  const mapFrequencyToMouthOpen = (frequencyAverage) => {
    const scaleFactor = 3;
    let mouthOpenValue = (frequencyAverage / 255) * scaleFactor;
    mouthOpenValue = Math.min(Math.max(mouthOpenValue, 0), 1);

    return mouthOpenValue;
  };

  const processArrayBuffer = async (arrayBuffer) => {
    const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = audioCtxRef.current.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtxRef.current.destination);
    source.start(0);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateSpeaking = () => {
      analyser.getByteFrequencyData(dataArray);

      // 使用音量来控制嘴巴开合
      const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      const mouthOpenValue = mapFrequencyToMouthOpen(average);

      setMouthOpenY(live2dModelRef.current, mouthOpenValue);

      if (!source.ended) {
        requestAnimationFrame(updateSpeaking);
      }
    };

    updateSpeaking();
  };

  useEffect(() => {
    if (pixiApp || !modelName || !audioReady) return;
    const initApp = async () => {
      const app = new PIXI.Application({
        view: document.getElementById("live2dCanvas"),
        autoStart: true,
        transparent: true,
      });
      const model = await Live2DModel.from(live2dConfig[modelName].path);

      app.stage.addChild(model);

      setModelSize(
        model,
        live2dConfig[modelName].x,
        live2dConfig[modelName].y,
        live2dConfig[modelName].scale,
      );

      setPixiApp(app);
      setLive2dModel(model);
    };
    initApp();
  }, [pixiApp, modelName, audioReady]);

  const setModelSize = (model, x, y, scale) => {
    model.x = x;
    model.y = y;
    model.rotation = Math.PI;
    model.skew.x = Math.PI;
    model.scale.set(scale);
  };

  const setMouthOpenY = (model, v) => {
    v = Math.max(0, Math.min(1, v));
    model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", v);
  };

  useEffect(() => {
    if (responseMessage) {
      window.parent.postMessage(`Response from Child Iframe ${responseMessage}`, 'https://app.michaelwu.online');
    }
  }, [responseMessage]);

  const handleSendMessage = async (overrideMessage, override, myJWT) => {
    try {
      setIsLoading(true);
      setResponseMessage('')
      let tempMessage = inputMessage;
      if (override) tempMessage = overrideMessage;
      setInputMessage("");

      const resMessage = await sendMessageToAI(
        {
          inputMessage: tempMessage,
          role: getRole(live2dModelRef.current.tag)
        },
        myJWT ? myJWT : jwt,
      );
      const message = parseResponseMessage(resMessage);

      const resAudio = await generateAudioFromAzure({
        text: message.content,
      });

      setResponseMessage(message.content);

      await processArrayBuffer(resAudio.data, live2dModelRef.current);

      if (message.mood === "Sad") {
        live2dModelRef.current.expression("f03");
      }
      if (message.mood === "Happy") {
        live2dModelRef.current.expression("f04");
      }
      if (message.mood === "Natural") {
        live2dModelRef.current.expression("f05");
      }
    } catch (e) {
      console.error(e);
      setInputMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={"appContainer"}
      style={{ backgroundImage: "url(/assets/bg.jpg)" }}
    >
      <div className="canvasContainer">
        {audioReady ? (
          !modelName ? <CirclesWithBar
            height="200"
            width="200"
            color="#FF4081"
            outerCircleColor="#FF4081"
            innerCircleColor="#FF4081"
            barColor="#FF4081"
            ariaLabel="circles-with-bar-loading"
            wrapperClass=""
            visible={true}
          /> : <canvas id="live2dCanvas"></canvas>
        ) : <button onClick={initializeAudio} style={{ border: 'none', borderRadius: '20px', minWidth: '100px', padding: '10px', fontSize: '20px', background: '#FF4081', color: 'white' }}>Start</button>}
        {responseMessage && <div className="chatBox">
          <div className="content">{text}</div>
        </div>}
      </div>
    </div>
  );
}

export default App;
