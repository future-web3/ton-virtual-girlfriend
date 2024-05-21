import { TelegramContext } from "./TelegramProvider";
import { useContext } from "react";

export const useTelegram = () => useContext(TelegramContext);
