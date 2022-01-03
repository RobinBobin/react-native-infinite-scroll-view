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

const InfiniteScrollView = () => {
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
  }, []);
  
  const context = useContext();
  
  return (
    <View
      onLayout={onLayout}
      style={useContainerStyle(context)}
    >
      {/* <Page /> */}
    </View>
  );
};

export { InfiniteScrollView };

function useContainerStyle(context: ContextType <any>) {
  return useMemo(() => [
    context.style,
    StyleSheet.create({
      container: {
        overflow: "hidden"
      }
    }).container
  ], [context.style]);
}
