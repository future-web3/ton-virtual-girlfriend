import React, { useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import cx from "classnames";
import { sleep, capitalizeFirstLetter } from "@/helpers";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import styles from "../../styles/Model.module.css";
import { FaMicrophone } from "react-icons/fa";
import { useRouter } from "next/router";
import { availableModelNames } from "@/helpers";
import { useNft } from "@/contexts/NftContext/hooks";
import Layout from "@/components/Layout/Layout";

const languages = [
  { name: "Chinese", value: "zh-CN" },
  { name: "English", value: "en-US" },
];

const IFRAME_URL = process.env.NEXT_PUBLIC_VIRTUAL_MODEL_URL ?? "";

const Chat: NextPage = () => {
  const router = useRouter();
  const modelName = router.query.id;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isModelAvailable, setIsModelAvailable] = useState(true);
  const { onSetTriggerTokenRefresh } = useNft();

  useEffect(() => {
    const handleMessage = async (event: any) => {
      if (event.origin !== IFRAME_URL) {
        return;
      }
      await sleep(1000);
      onSetTriggerTokenRefresh();
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof modelName === "string") {
      const parsedModelNames = availableModelNames.map((item) =>
        item.toLowerCase()
      );
      if (parsedModelNames.includes(modelName.toLowerCase())) {
        setIsModelAvailable(true);
      } else {
        setIsModelAvailable(false);
      }
    } else {
      setIsModelAvailable(false);
    }
  }, [modelName]);

  useEffect(() => {
    const sendMessageToIframe = async () => {
      if (!iframeLoaded || !isModelAvailable) return;
      const message = {
        type: "modelName",
        data: capitalizeFirstLetter(modelName as string),
      };
      await sleep(1000);
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(message, IFRAME_URL);
      }
    };
    sendMessageToIframe();
  }, [iframeLoaded, isModelAvailable, modelName]);

  useEffect(() => {
    const sendMessageToIframe = () => {
      if (isListening || !transcript || !iframeLoaded) return;
      const jwt = localStorage.getItem("jwt");
      const message = { type: "transcript", data: transcript, jwt };
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(message, IFRAME_URL);
      }
    };
    sendMessageToIframe();
  }, [isListening, transcript, iframeLoaded]);

  const handleMouseDown = () => {
    setTranscript("");
    setIsListening(true);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage.value;

    recognition.onresult = (event) => {
      for (const result of event.results) {
        setTranscript(result[0].transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error", event.error);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, selectedLanguage]);

  return (
    <Layout>
      {isModelAvailable ? (
        <div className="w-full h-full">
          <iframe
            className="w-screen h-screen"
            ref={iframeRef}
            src={IFRAME_URL}
            onLoad={() => setIframeLoaded(true)}
          />
          <div className="absolute right-2 top-2">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              languages={languages}
            />
          </div>
          <div className="absolute bottom-16 left-[50%] translate-x-[-50%] flex items-center justify-center flex-col gap-1 z-10">
            <p className="font-rubik text-white min-w-[300px] text-3xl text-center font-bold">
              {transcript}
            </p>
            <button
              className={cx(styles.voiceBtn, {
                [styles.recording]: isListening,
              })}
              onMouseDown={handleMouseDown}
              onMouseUp={() => setIsListening(false)}
              onTouchStart={handleMouseDown}
              onTouchEnd={() => setIsListening(false)}
            >
              <FaMicrophone
                size={50}
                className={`${!isListening && "text-[#ff4081]"}`}
              />
              {isListening && <span className={styles.wave} />}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-home bg-center bg-no-repeat bg-cover h-screen w-screen p-10">
          <div className="flex items-center justify-center flex-col h-full gap-10">
            <div className="font-main text-3xl text-center text-[#ff4081]">
              Model is unavailable
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Chat;
