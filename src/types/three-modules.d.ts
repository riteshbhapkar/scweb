declare module 'https://cdn.skypack.dev/three@0.136.0' {
  export * from 'three';
}

declare module 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js' {
  import { Object3D, Scene, AnimationClip } from 'three';
  
  export interface GLTF {
    scene: Scene;
    scenes: Scene[];
    animations: AnimationClip[];
    asset: {
      copyright?: string;
      generator?: string;
      version?: string;
      minVersion?: string;
      extensions?: any;
      extras?: any;
    };
  }
  
  export default class GLTFLoader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}