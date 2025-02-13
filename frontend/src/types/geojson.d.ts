declare namespace GeoJSON {
  export interface Position {
    0: number;
    1: number;
    2?: number;
  }

  export interface Geometry {
    type: string;
    coordinates: Position[] | Position[][] | Position[][][];
  }

  export interface Polygon {
    type: "Polygon";
    coordinates: Position[][];
  }

  export interface Feature {
    type: "Feature";
    geometry: Geometry;
    properties: { [key: string]: any };
  }

  export interface FeatureCollection {
    type: "FeatureCollection";
    features: Feature[];
  }
} 