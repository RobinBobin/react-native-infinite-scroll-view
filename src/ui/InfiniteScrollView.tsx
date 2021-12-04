import React, {
  useCallback,
  useMemo,
  useRef
} from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View
} from "react-native";
import { Page } from "./Page";
import { ContextType } from "../types/context";
import { PageRef } from "../types/ui/page/Ref";
import { useContext } from "../utils/ui";

const InfiniteScrollView = () => {
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
  }, []);
  
  const context = useContext();
  
  const { pages, pageRefs } = usePages();
  
  // props.dataHolder.pages.forEach((page, index) => {
  //   console.log(`${index}, position: ${page.position}, layout: ${JSON.stringify(page.layout)}`);
  // });
  
  return (
    <View
      onLayout={onLayout}
      style={useContainerStyle(context)}
    >
      { pages }
    </View>
  );
};

export { InfiniteScrollView };

function useContainerStyle(context: ContextType <any>) {
  return useMemo(() => [
    context.style,
    StyleSheet.create({
      container: {
        flexDirection: context.dataHolder.horizontal ? "row" : "column",
        // overflow: "hidden"
      }
    }).container
  ], [
    context.dataHolder.horizontal,
    context.style
  ]);
}

function usePages() {
  const pageRefs = useRef([
    useRef <PageRef> (),
    useRef <PageRef> (),
    useRef <PageRef> (),
  ]).current;
  
  const pages = useMemo(() => {
    return Array.from(Array(3).keys()).map(index =>
      <Page
        index={index}
        key={index}
        ref={pageRefs[index]}
      />
    );
  }, []);
  
  return useMemo(() => ({
    pages,
    pageRefs
  }), [pages]);
}
