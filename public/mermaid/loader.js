import mermaid from "./mermaid.js";
// export { mermaid, mermaid as default };
if (typeof globalThis !== "undefined") {
  globalThis.mermaid = mermaid;
}
