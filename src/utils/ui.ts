import { useContext as useContextBase } from "react";
import {
  StyleProp,
  ViewStyle
} from "react-native";
import Context from "../Context";
import { ContextType } from "../types/context";
import { BaseItemType } from "../types/data";

export const getFlexDirection = (style: StyleProp <ViewStyle>) => (
  // @ts-ignore
  style.flexDirection
);

export const isVertical = (style: StyleProp <ViewStyle>) => {
  const flexDirection = getFlexDirection(style);
  
  return !(flexDirection === "row" || flexDirection === "row-reverse");
};

export const useContext = () => useContextBase <ContextType <BaseItemType>> (Context);
