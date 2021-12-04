import { observer } from "mobx-react-lite";
import React, {
  ForwardedRef,
  useCallback,
  useImperativeHandle,
  useMemo
} from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View
} from "react-native";
import { ContextType } from "../types/context";
import { PageRef } from "../types/ui/page/Ref";
import { useContext } from "../utils/ui";

const Page = observer((props: PageProps, ref: ForwardedRef <PageRef>) => {
  const context = useContext();
  
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
    context.dataHolder.pages[props.index].layout = nativeEvent.layout;
  }, [
    context
    // = props.index can't change = //
  ]);
  
  const containerStyle = useContainerStyle(context, props.index);
  
  usePageMethods(ref);
  
  return (
    false && context.dataHolder.pages[props.index].isUnused
    ?
      null
    :
      <View
        onLayout={onLayout}
        style={containerStyle}
      >
        
      </View>
  );
}, {
  forwardRef: true
});

export { Page };

interface PageProps {
  index: number
};

function useContainerStyle(context: ContextType <any>, index: number) {
  return useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor:
          context.dataHolder.pages[index].isPrevious ? "red"
          : context.dataHolder.pages[index].isMedium ? "green"
          : context.dataHolder.pages[index].isNext ? "blue"
          : "black",
        // position: "absolute",
        [context.dataHolder.horizontal ? "width" : "height"]: 100,
        // [context.dataHolder.horizontal ? "height" : "width"]: "100%"
      }
    }).container;
  }, [
    context.dataHolder.horizontal,
    context.dataHolder.pages[index].position
  ]);
}

function usePageMethods(ref: ForwardedRef <PageRef>) {
  useImperativeHandle(ref, () => ({
  }), []);
}
