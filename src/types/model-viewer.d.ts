import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'environment-image'?: string;
          'auto-rotate'?: boolean | string;
          'camera-controls'?: boolean | string;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          exposure?: string;
          style?: React.CSSProperties;
          'onARClick'?: () => void;
          slot?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};