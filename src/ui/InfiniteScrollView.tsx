import React, {
  useCallback,
  useEffect,
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
import BaseItemType from "../data/BaseItemType";
import DataHolder from "../data/DataHolder";
import Page from "./Page";

export default function InfiniteScrollView <ItemT extends BaseItemType> (props: InfiniteScrollViewProps <ItemT>) {
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
    // console.log("onLayout", nativeEvent.layout);
  }, []);
  
  useListeners(props);
  
  const { pages, pageRefs } = usePages(props);
  
  return (
    <View
      onLayout={onLayout}
      style={useContainerStyle(props)}
    >
      { pages }
    </View>
  );
};

export interface InfiniteScrollViewProps <ItemT extends BaseItemType> {
  dataHolder: DataHolder <ItemT>;
  inverted?: boolean;
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

function useListeners <ItemT extends BaseItemType> (props: InfiniteScrollViewProps <ItemT>) {
  const onSetData = useCallback(() => {
    console.log("page1", props.dataHolder.page1.data.length, props.dataHolder.page1.data[0]);
    console.log("page2", props.dataHolder.page2.data.length, props.dataHolder.page2.data[0]);
    console.log("page3", props.dataHolder.page3.data.length, props.dataHolder.page3.data[0]);
  }, [props.dataHolder]);
  
  useEffect(() => {
    props.dataHolder._setListeners(
      onSetData
    );
  }, [props.dataHolder]);
}

function usePages <ItemT extends BaseItemType> (props: InfiniteScrollViewProps <ItemT>) {
  const pageRefs = useRef([
    useRef(),
    useRef(),
    useRef(),
  ]).current;
  
  return useMemo(() => {
    //@ts-ignore
    const horizontal = props.style.flexDirection === "row";
    
    return {
      pages: <>
        <Page
          backgroundColor="red"
          data={props.dataHolder.page1}
          horizontal={horizontal}
          ref={pageRefs[0]}
        />
        <Page
          backgroundColor="green"
          data={props.dataHolder.page2}
          horizontal={horizontal}
          ref={pageRefs[1]}
        />
        <Page
          backgroundColor="blue"
          data={props.dataHolder.page3}
          horizontal={horizontal}
          ref={pageRefs[2]}
        />
      </>,
      pageRefs
    };
  }, [
    props.dataHolder,
    props.style
  ]);
}
