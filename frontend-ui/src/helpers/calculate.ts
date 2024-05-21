import { availableModelNames } from "./constants";
import { Attribute } from "@/services/graph";

export const calculateGptTokenAmount = (tonAmount: string) => {
  const amount = Number(tonAmount);
  return amount * 1000000;
};

export const getRandomModel = () => {
  const randomIndex = Math.floor(Math.random() * availableModelNames.length);
  return availableModelNames[randomIndex].toLowerCase();
};

export const getModelName = (attributes: Attribute[]) => {
  const modelName = attributes.find((item) => item.traitType === "modelName");
  if (modelName) {
    return modelName.value;
  } else {
    getRandomModel();
  }
};
