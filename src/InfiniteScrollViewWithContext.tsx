import React from "react";
import { StyleSheet } from "react-native";
import Context from "./Context";
import { DataHolder } from "./data/DataHolder";
import { ContextType } from "./types/context";
import { BaseItemType } from "./types/data";
import { InfiniteScrollView } from "./ui/InfiniteScrollView";
import { strictDeepEqual } from "./utils";

export default <ItemT extends BaseItemType> () => {
  const InfiniteScrollViewWithContext: React.FC <
    ContextType <ItemT, DataHolder <ItemT>>
  > = props =>
  {
    props.debugLogsEnabled && console.log("render InfiniteScrollViewWithContext");
    
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
  
  return React.memo(InfiniteScrollViewWithContext, strictDeepEqual);
};
