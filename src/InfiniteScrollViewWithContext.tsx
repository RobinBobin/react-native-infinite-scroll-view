import deepEqual from "deep-equal";
import React from "react";
import { StyleSheet } from "react-native";
import Context from "./Context";
import { ContextType } from "./types/context";
import { BaseItemType } from "./types/data";
import { InfiniteScrollView } from "./ui/InfiniteScrollView";

export default <ItemT extends BaseItemType> () => {
  const InfiniteScrollViewWithContext: React.FC <ContextType <ItemT>> = (props) => {
    console.log("InfiniteScrollViewWithContext rendered");
    
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
  
  return React.memo(InfiniteScrollViewWithContext, (prev, next) => deepEqual(prev, next, {
    strict: true
  }));
};
