declare module 'react-simple-maps' {
  import { ReactNode, CSSProperties } from 'react';

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  }

  export interface Geography {
    rsmKey: string;
    id: string;
    properties: {
      name?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export interface ComposableMapProps {
    projectionConfig?: ProjectionConfig;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Geography[] }) => ReactNode;
  }

  export interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: (event: any) => void;
    onMouseMove?: (event: any) => void;
    key?: string;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const ZoomableGroup: React.FC<{ children: ReactNode }>;
}
