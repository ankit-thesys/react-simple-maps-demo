declare module 'react-simple-maps' {
  import { FC, SVGProps, CSSProperties } from 'react';

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: any;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      rotate?: [number, number, number];
      scale?: number;
      center?: [number, number];
    };
    width?: number;
    height?: number;
    children?: React.ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (context: { geographies: any[] }) => React.ReactNode;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
  }

  export interface AnnotationProps {
    subject: [number, number];
    dx?: number;
    dy?: number;
    connectorProps?: SVGProps<SVGPathElement>;
    children?: React.ReactNode;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    children?: React.ReactNode;
  }

  export const ComposableMap: FC<ComposableMapProps>;
  export const Geographies: FC<GeographiesProps>;
  export const Geography: FC<GeographyProps>;
  export const Marker: FC<MarkerProps>;
  export const Annotation: FC<AnnotationProps>;
  export const ZoomableGroup: FC<ZoomableGroupProps>;
  export const Line: FC<any>;
  export const Graticule: FC<any>;
  export const Sphere: FC<any>;
}

