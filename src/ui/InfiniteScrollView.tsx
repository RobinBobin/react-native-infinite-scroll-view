import { observer } from "mobx-react-lite";
import React, {
  useCallback,
  useMemo,
  useRef
} from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { Page } from "./Page";
import { BaseItemType } from "../data/BaseItemType";
import { DataHolder } from "../data/DataHolder";
import { PageRef } from "../utils/page/Ref";

const InfiniteScrollView = observer(
  <ItemT extends BaseItemType> (
    props: InfiniteScrollViewProps <ItemT>
  ) => {
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
  }, []);
  
  const { pages, pageRefs } = usePages(props);
  
  // props.dataHolder.pages.forEach((page, index) => {
  //   console.log(`${index}, position: ${page.position}, layout: ${JSON.stringify(page.layout)}`);
  // });
  
  return (
    <View
      onLayout={onLayout}
      style={useContainerStyle(props)}
    >
      { pages }
    </View>
  );
});

export { InfiniteScrollView };

export interface InfiniteScrollViewProps <ItemT extends BaseItemType> {
  dataHolder: DataHolder <ItemT>;
  renderItem: RenderItem <ItemT>;
  style: StyleProp <ViewStyle>;
};

export interface RenderItemInfo <ItemT extends BaseItemType> {
  item: ItemT
};

export type RenderItem <ItemT extends BaseItemType> = (info: RenderItemInfo <ItemT>) => React.ReactElement;

function useContainerStyle <ItemT extends BaseItemType> (props: InfiniteScrollViewProps <ItemT>) {
  return useMemo(() => [
    props.style,
    StyleSheet.create({
      container: {
        // overflow: "hidden"
      }
    }).container
  ], [props.style]);
}

function usePages <ItemT extends BaseItemType> (props: InfiniteScrollViewProps <ItemT>) {
  const pageRefs = useRef([
    useRef <PageRef> (),
    useRef <PageRef> (),
    useRef <PageRef> (),
  ]).current;
  
  const pages = useMemo(() => {
    const horizontal = StyleSheet.flatten(props.style).flexDirection === "row";
    
    return Array.from(Array(3).keys()).map(index =>
      <Page
        data={props.dataHolder.pages[index]}
        horizontal={horizontal}
        key={index}
        ref={pageRefs[index]}
      />
    );
  }, [
    props.dataHolder,
    props.style
  ]);
  
  return useMemo(() => ({
    pages,
    pageRefs
  }), [pages]);
}
