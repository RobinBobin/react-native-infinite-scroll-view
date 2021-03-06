import React, {
  useCallback
} from "react";
import {
  LayoutChangeEvent,
  StyleSheet
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withDecay
} from "react-native-reanimated";
import { ContextType } from "../types/context";
import {
  isVertical,
  useContext
} from "../utils/ui";
import "../../wdyr";

let InfiniteScrollView: React.FC = () => {
  const context = useContext();
  
  context.debugLogsEnabled && console.log("render InfiniteScrollView");
  
  const {
    gestureHandler,
    pageAnimatedStyle
  } = useGestureHandler(context);
  
  return (
    <GestureHandlerRootView
      onLayout={useOnLayout()}
      style={context.style}
    >
      <PanGestureHandler
        maxPointers={1}
        onGestureEvent={gestureHandler}
      >
        <Animated.View
          style={styles.pageContainer}
        >
          {context.dataHolder.usePages(pageAnimatedStyle)}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

InfiniteScrollView.whyDidYouRender = {
  customName: "InfiniteScrollView"
};

InfiniteScrollView = React.memo(InfiniteScrollView);

export { InfiniteScrollView };

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    overflow: "hidden"
  }
});

const useGestureHandler = (context: ContextType <any>) => {
  const translation = context.dataHolder.useTranslation();
  
  const vertical = isVertical(context.style);
  
  const pageAnimatedStyle = useAnimatedStyle(() => {
    const t = vertical ? {
      translateY: translation.value
    } : {
      translateX: translation.value
    };
    
    return {
      transform: [t]
    };
  }, [vertical]);
  
  const gestureHandler = useAnimatedGestureHandler <
    PanGestureHandlerGestureEvent,
    {
      initialTranslation: number
    }
  > ({
    onActive(event, context) {
      translation.value = context.initialTranslation + (vertical ? event.translationY : event.translationX);
    },
    onEnd(event) {
      translation.value = withDecay({
        velocity: vertical ? event.velocityY : event.velocityX
      });
    },
    onStart(_, context) {
      context.initialTranslation = translation.value;
    }
  }, [vertical]);
  
  return {
    gestureHandler,
    pageAnimatedStyle
  };
};

const useOnLayout = () => (
  useCallback(({nativeEvent}: LayoutChangeEvent) => {
  }, [])
);
