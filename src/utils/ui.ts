import { useContext as useContextBase } from "react";
import Context from "../Context";
import { DataHolder } from "../data/DataHolder";
import { ContextType } from "../types/context";
import { BaseItemType } from "../types/data";

export function getFlexDirection(dataHolder: DataHolder <any>) {
  return dataHolder.horizontal ? "row" : "column";
};

export function useContext <ItemT extends BaseItemType> () {
  return useContextBase <ContextType <ItemT>> (Context);
};
