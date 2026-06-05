'use client';

import React, { forwardRef } from 'react';

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

const ModelViewer = forwardRef<any, ModelViewerProps>((props, ref) => {
  // Using React.createElement completely bypasses the JSX IntrinsicElements type checker.
  // This is the safest way to wrap Web Components in React + TypeScript.
  return React.createElement('model-viewer', { ...props, ref });
});

ModelViewer.displayName = 'ModelViewer';

export default ModelViewer;