import axios from "axios";
import config from "../../config/config";

export const sendMessageToAI = async (data, token) => {
  try {
    const headerConfig = { headers: { Authorization: `Bearer ${token}` } };
    const path = `${config.apiAddress}/chat`;
    const result = await axios.post(path, data, headerConfig);
    return result;
  } catch (error) {
    return error.message;
  }
};

export const generateAudioFromElevenLabs = async (data) => {
  try {
    // const headerConfig = { headers: { Authorization: `Bearer ${token}` } };
    const path = `${config.apiAddress}/elevenlabs/tts`;
    const result = await axios.post(path, data, {
      responseType: "arraybuffer",
    });
    return result;
  } catch (error) {
    return error.message;
  }
};

export const generateAudioFromAzure = async (data) => {
  try {
    // const headerConfig = { headers: { Authorization: `Bearer ${token}` } };
    const path = `${config.apiAddress}/azure/tts`;
    const result = await axios.post(path, data, {
      responseType: "arraybuffer",
    });
    return result;
  } catch (error) {
    return error.message;
  }
};
