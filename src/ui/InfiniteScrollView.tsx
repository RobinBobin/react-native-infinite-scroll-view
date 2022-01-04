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

const InfiniteScrollView: React.FC = React.memo(observer(() => {
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
  }, []);
  
  const context = useContext();
  
  const { previous, medium, next } = context.dataHolder.getPages();
  
  return (
    <View
      onLayout={onLayout}
      style={useContainerStyle(context)}
    >
      <Page page={previous} />
      <Page page={medium} />
      <Page page={next} />
    </View>
  );
}));

InfiniteScrollView.whyDidYouRender = {
  customName: "InfiniteScrollView"
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
