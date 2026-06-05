'use client';

import React, { useRef, useEffect, forwardRef } from 'react';

interface ModelViewerProps {
  src: string;
  alt: string;
  ar?: boolean;
  'ar-modes'?: string;
  'environment-image'?: string;
  'auto-rotate'?: boolean;
  'camera-controls'?: boolean;
  'shadow-intensity'?: string;
  exposure?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

// Cast 'model-viewer' to any to bypass TypeScript JSX IntrinsicElements error
const ModelViewerTag = 'model-viewer' as any;

const ModelViewer = forwardRef<any, ModelViewerProps>((props, ref) => {
  return <ModelViewerTag ref={ref} {...props} />;
});

ModelViewer.displayName = 'ModelViewer';

export default ModelViewer;