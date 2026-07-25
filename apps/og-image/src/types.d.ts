// Satori's public Node-compatible signature mentions Buffer; the Worker only supplies ArrayBuffer data.
type Buffer = Uint8Array;

declare module "*.wasm" {
  const value: WebAssembly.Module;
  export default value;
}

declare module "*.png?inline" {
  const value: string;
  export default value;
}

declare module "*.ttf?arraybuffer&base64" {
  const value: ArrayBuffer;
  export default value;
}
