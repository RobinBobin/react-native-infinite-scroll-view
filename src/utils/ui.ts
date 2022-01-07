import { useContext as useContextBase } from "react";
import Context from "../Context";
import { ContextType } from "../types/context";
import { BaseItemType } from "../types/data";

export const isVertical = (flexDirection: string) => !(
  flexDirection === "row" || flexDirection === "row-reverse"
);

export function useContext() {
  return useContextBase <ContextType <BaseItemType>> (Context);
};
