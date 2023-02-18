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

export class Columns extends LitElement {
  static properties = {
    styles: "",
  };
  constructor() {
    super();
  }
}

export class Columns2 extends Columns {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(2, 1fr); ${this.styles}"><slot></slot></grid-box>`;
  }
}
customElements.define("columns-2", Columns2);

export class Columns3 extends Columns {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(3, 1fr); ${this.styles}"><slot></slot></grid-box>`;
  }
}
customElements.define("columns-3", Columns3);

export class Columns4 extends Columns {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(4, 1fr); ${this.styles}"><slot></slot></grid-box>`;
  }
}
customElements.define("columns-4", Columns4);

export class Columns5 extends Columns {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(5, 1fr); ${this.styles}"><slot></slot></grid-box>`;
  }
}
customElements.define("columns-5", Columns5);

export class Columns6 extends Columns {
  render() {
    return html`<grid-box styles="grid-template-columns: repeat(6, 1fr); ${this.styles}"><slot></slot></grid-box>`;
  }
}
customElements.define("columns-6", Columns6);
