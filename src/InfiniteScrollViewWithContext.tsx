import React from "react";
import { StyleSheet } from "react-native";
import Context from "./Context";
import { ContextType } from "./types/context";
import { BaseItemType } from "./types/data";
import { InfiniteScrollView } from "./ui/InfiniteScrollView";

export default function InfiniteScrollViewWithContext <ItemT extends BaseItemType> (props: ContextType <ItemT> ) {
  return (
    <Context.Provider
      value={{
        ...props,
        style: StyleSheet.flatten(props.style)
      }}
    >
      <InfiniteScrollView />
    </Context.Provider>
  );
};
