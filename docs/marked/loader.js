import * as m from "./marked.js";
const mymarked = globalThis.marked;
delete globalThis.marked;
export { mymarked as default, mymarked as marked };
