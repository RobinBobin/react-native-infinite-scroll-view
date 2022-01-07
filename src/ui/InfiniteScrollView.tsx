import { observer } from "mobx-react-lite";
import React, {
  useCallback,
  useMemo
} from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View
} from "react-native";
import { Page } from "./Page";
import { ContextType } from "../types/context";
import { useContext } from "../utils/ui";
import "../../wdyr";

let InfiniteScrollView: React.FC = () => {
  console.log("render InfiniteScrollView");
  
  const context = useContext();
  
  const { previous, medium, next } = context.dataHolder.pageReferences;
  
  return (
    <View
      onLayout={useOnLayout()}
      style={useContainerStyle(context)}
    >
      <Page page={previous} />
      <Page page={medium} />
      <Page page={next} />
    </View>
  );
};

InfiniteScrollView.whyDidYouRender = {
  customName: "InfiniteScrollView"
};

InfiniteScrollView = React.memo(observer(InfiniteScrollView));

export { InfiniteScrollView };

const useContainerStyle = (context: ContextType <any>) => (
  useMemo(() => {
    console.log("InfiniteScrollView useContainerStyle()");
    
    return [
      context.style,
      StyleSheet.create({
        container: {
          overflow: "hidden"
        }
      }).container
    ];
  }, [context.style])
);

const useOnLayout = () => (
  useCallback(({nativeEvent}: LayoutChangeEvent) => {
  }, [])
);
