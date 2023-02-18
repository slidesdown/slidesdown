// Documentation: https://lit.dev/docs/components/styles/#dynamic-classes-and-styles
import { css, html, LitElement } from "lit";

export class FontAwesomeIcon extends LitElement {
  static properties = {
    class: {},
  };
  constructor() {
    super();
    this.class = "fa-solid fa-face-smile";
  }
  render() {
    return html`<i class="${this.class}">!</i>`;
  }
}
customElements.define("fa-i", FontAwesomeIcon);

export class FlexBox extends LitElement {
  static properties = {
    styles: "",
  };
  constructor() {
    super();
  }
  static styles = css`
          .flex {
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        `;
  render() {
    return html`<div class="flex" style="${this.styles}"><slot></slot></div>`;
  }
}
// -------------------- FlexBox

customElements.define("flex-box", FlexBox);

export class VerticalFlexBox extends LitElement {
  render() {
    return html`<flex-box styles="flex-direction: column; ${this.styles}"><slot></slot></grid-box>`;
  }
}
customElements.define("v-box", VerticalFlexBox);

export class HorizontalFlexBox extends LitElement {
  render() {
    return html`<flex-box styles="flex-direction: row;"><slot></slot></grid-box>`;
  }
}
customElements.define("h-box", HorizontalFlexBox);

// -------------------- GridBox

export class GridBox extends LitElement {
  static properties = {
    styles: "",
  };
  constructor() {
    super();
  }
  static styles = css`
          .grid {
            display: grid;
            align-items: center;
            gap: 10px;
          }
        `;
  render() {
    return html`<div class="grid" style="${this.styles}"><slot></slot></div>`;
  }
}
customElements.define("grid-box", GridBox);

export class Column2 extends LitElement {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(2, 1fr)"><slot></slot></grid-box>`;
  }
}
customElements.define("column-2", Column2);

export class Column3 extends LitElement {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(3, 1fr)"><slot></slot></grid-box>`;
  }
}
customElements.define("column-3", Column3);

export class Column4 extends LitElement {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(4, 1fr)"><slot></slot></grid-box>`;
  }
}
customElements.define("column-4", Column4);

export class Column5 extends LitElement {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(5, 1fr)"><slot></slot></grid-box>`;
  }
}
customElements.define("column-5", Column5);

export class Column6 extends LitElement {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(6, 1fr)"><slot></slot></grid-box>`;
  }
}
customElements.define("column-6", Column6);
