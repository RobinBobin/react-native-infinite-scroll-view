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
import { ContextType } from "../types/context";
import {
  getFlexDirection,
  useContext
} from "../utils/ui";

const Page = observer(() => {
  const context = useContext();
  
  const page = context.dataHolder.pages[0];
  
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
    page.layout = nativeEvent.layout;
    
    console.log(`Page 0, layout: ${JSON.stringify(page.layout)}`);
  }, [context]);
  
  console.log(`Page 0, position: ${page.position}, item count: ${page.data.length}`);
  
  return (
    <View
      onLayout={onLayout}
      style={useContainerStyle(context)}
    >
      {
        page.data.map((item, index) => (
          <View
            key={index}
          >
            {
              context.renderItem({
                item: item.item
              })
            }
          </View>
        ))
      }
    </View>
  );
});

export { Page };

function useContainerStyle(context: ContextType <any>) {
  return useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: "pink",
        flexDirection: getFlexDirection(context.dataHolder)
      }
    }).container;
  }, [
    context.dataHolder.horizontal
  ]);
}
