/**
 * Wrapper para expo-av Video compatible con web
 */

import React from 'react';
import { View } from 'react-native';

export const ResizeMode = {
  CONTAIN: 'contain' as const,
  COVER: 'cover' as const,
  STRETCH: 'stretch' as const,
};

interface VideoProps {
  source: any;
  style?: any;
  resizeMode?: string;
  isLooping?: boolean;
  shouldPlay?: boolean;
  useNativeControls?: boolean;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

export const Video: React.FC<VideoProps> = (props) => {
  const { source, style, resizeMode, isLooping, shouldPlay, useNativeControls } = props;
  
  const videoUrl = typeof source === 'object' && source.uri ? source.uri : source;
  
  return (
    <View style={style}>
      <video
        src={videoUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: resizeMode === 'cover' ? 'cover' : 'contain',
        }}
        loop={isLooping}
        autoPlay={shouldPlay}
        controls={useNativeControls}
        playsInline
      />
    </View>
  );
};
