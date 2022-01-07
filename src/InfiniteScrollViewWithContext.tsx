import deepEqual from "deep-equal";
import React from "react";
import { StyleSheet } from "react-native";
import Context from "./Context";
import { DataHolder } from "./data/DataHolder";
import { ContextType } from "./types/context";
import { BaseItemType } from "./types/data";
import { InfiniteScrollView } from "./ui/InfiniteScrollView";

export default <ItemT extends BaseItemType> () => {
  const InfiniteScrollViewWithContext: React.FC <
    ContextType <ItemT, DataHolder <ItemT>>
  > = (props) =>
  {
    console.log("render InfiniteScrollViewWithContext");
    
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
  
  return React.memo(InfiniteScrollViewWithContext, deepEqualStrict);
};

function deepEqualStrict(actual: any, expected: any) {
  return deepEqual(actual, expected, { strict: true });
}
