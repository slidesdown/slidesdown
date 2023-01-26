/*!
 * Minimal theme switcher
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2022 - Licensed under MIT
 */

const themeSwitcher = {
  // Config
  _scheme: "auto",
  // menuTarget: "details[role='list']",
  buttonsTarget: "a[data-theme-switcher]",
  // buttonAttribute: "data-theme-switcher",
  rootAttribute: "data-theme",
  localStorageKey: "picoPreferedColorScheme",
  themeDark: "dark",
  themeLight: "light",

  // Init
  init() {
    this.scheme = this.schemeFromLocalStorage;
    this.initSwitchers();
  },

  // Get color scheme from local storage
  get schemeFromLocalStorage() {
    if (typeof window.localStorage !== "undefined") {
      if (window.localStorage.getItem(this.localStorageKey) !== null) {
        return window.localStorage.getItem(this.localStorageKey);
      }
    }
    return this._scheme;
  },

  // Prefered color scheme
  get preferedColorScheme() {
    return window.matchMedia(`(prefers-color-scheme: ${this.themeDark})`)
        .matches
      ? this.themeDark
      : this.themeLight;
  },

  // Init switchers
  initSwitchers() {
    const buttons = document.querySelectorAll(this.buttonsTarget);
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        // Set scheme
        // this.scheme = scheme;
        this.scheme = "toggle";
      }, false);
    });
  },

  // Set scheme
  set scheme(scheme) {
    if (scheme == "auto") {
      this.preferedColorScheme == this.themeDark
        ? (this._scheme = this.themeDark)
        : (this._scheme = this.themeLight);
    } else if (scheme == "toggle") {
      this._scheme = this._scheme === this.themeLight
        ? this.themeDark
        : this.themeLight;
    } else if (scheme == this.themeDark || scheme == this.themeLight) {
      this._scheme = scheme;
    }
    this.applyScheme();
    this.schemeToLocalStorage();
  },

  // Get scheme
  get scheme() {
    return this._scheme;
  },

  // Apply scheme
  applyScheme() {
    document
      .querySelector("html")
      .setAttribute(this.rootAttribute, this.scheme);
    document.querySelector(":root").style.setProperty(
      "--icon-theme",
      this.scheme === this.themeLight
        ? "url(/icons/sun-bright-regular.svg)"
        : "url(/icons/moon-regular.svg)",
    );
  },

  // Store scheme to local storage
  schemeToLocalStorage() {
    if (typeof window.localStorage !== "undefined") {
      window.localStorage.setItem(this.localStorageKey, this.scheme);
    }
  },
};

// Init
themeSwitcher.init();
