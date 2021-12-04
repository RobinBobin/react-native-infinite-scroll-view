import { useContext as useContextBase } from "react";
import Context from "../Context";
import { ContextType } from "../types/context";
import { BaseItemType } from "../types/data";

export function useContext <ItemT extends BaseItemType> () {
  return useContextBase <ContextType <ItemT>> (Context);
}
