import {
  css,
  html,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

export class SimpleGreeting extends LitElement {
  static properties = {
    name: {},
  };
  static styles = css`
          :host {
            color: blue;
          }
        `;
  constructor() {
    super();
    // Declare reactive properties
    this.name = "World";
  }
  render() {
    return html`<p>Hello Man, ${this.name}!</p>`;
  }
}
customElements.define("simple-greeting", SimpleGreeting);

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

export class VerticalFlexBox extends LitElement {
  constructor() {
    super();
  }
  static styles = css`
          :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
          }
        `;
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("v-box", VerticalFlexBox);

export class HorizontalFlexBox extends LitElement {
  constructor() {
    super();
  }
  static styles = css`
          :host {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
          }
        `;
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("h-box", HorizontalFlexBox);

export class GridBox extends LitElement {
  constructor() {
    super();
  }
  static styles = css`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 10px;
          }
        `;
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("grid-box", GridBox);

export class GridBox2 extends LitElement {
  constructor() {
    super();
  }
  static styles = css`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 10px;
          }
        `;
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("grid-2", GridBox2);

export class GridBox3 extends LitElement {
  constructor() {
    super();
  }
  static styles = css`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(3, 1fr);
            grid-column-gap: 10px;
          }
        `;
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("grid-3", GridBox3);

export class GridBox4 extends LitElement {
  constructor() {
    super();
  }
  static styles = css`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(4, 1fr);
            grid-column-gap: 10px;
          }
        `;
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("grid-4", GridBox4);

export class GridBox2x2 extends LitElement {
  constructor() {
    super();
  }
  static styles = css`
          :host {
            display: grid;
            align-items: center;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            grid-column-gap: 10px;
          }
        `;
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("grid-2x2", GridBox2x2);
