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
  buttonsTarget: "div[data-theme-switcher]",
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
        ? "url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%3E%3C%21--%21%20Font%20Awesome%20Pro%206.2.1%20by%20%40fontawesome%20-%20https%3A%2F%2Ffontawesome.com%20License%20-%20https%3A%2F%2Ffontawesome.com%2Flicense%20%28Commercial%20License%29%20Copyright%202022%20Fonticons%2C%20Inc.%20--%3E%3Cpath%20%20fill%3D%22currentcolor%22%20stroke%3D%22currentcolor%22%20d%3D%22M421.6%20379.9c-.6641%200-1.35%20.0625-2.049%20.1953c-11.24%202.143-22.37%203.17-33.32%203.17c-94.81%200-174.1-77.14-174.1-175.5c0-63.19%2033.79-121.3%2088.73-152.6c8.467-4.812%206.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3%2031.1%2032%20132.2%2032%20256c0%20123.6%20100.1%20224%20223.8%20224c69.04%200%20132.1-31.45%20173.8-82.93C435.3%20389.1%20429.1%20379.9%20421.6%20379.9zM255.8%20432C158.9%20432%2080%20353%2080%20256c0-76.32%2048.77-141.4%20116.7-165.8C175.2%20125%20163.2%20165.6%20163.2%20207.8c0%2099.44%2065.13%20183.9%20154.9%20212.8C298.5%20428.1%20277.4%20432%20255.8%20432z%22%2F%3E%3C%2Fsvg%3E)"
        : "url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20fill%3D%22currentcolor%22%3E%3C%21--%21%20Font%20Awesome%20Pro%206.2.1%20by%20%40fontawesome%20-%20https%3A%2F%2Ffontawesome.com%20License%20-%20https%3A%2F%2Ffontawesome.com%2Flicense%20%28Commercial%20License%29%20Copyright%202022%20Fonticons%2C%20Inc.%20--%3E%3Cpath%20color%3D%22white%22%20fill%3D%22currentcolor%22%20d%3D%22M256%20144C194.1%20144%20144%20194.1%20144%20256c0%2061.86%2050.14%20112%20112%20112s112-50.14%20112-112C368%20194.1%20317.9%20144%20256%20144zM256%20320c-35.29%200-64-28.71-64-64c0-35.29%2028.71-64%2064-64s64%2028.71%2064%2064C320%20291.3%20291.3%20320%20256%20320zM256%20112c13.25%200%2024-10.75%2024-24v-64C280%2010.75%20269.3%200%20256%200S232%2010.75%20232%2024v64C232%20101.3%20242.8%20112%20256%20112zM256%20400c-13.25%200-24%2010.75-24%2024v64C232%20501.3%20242.8%20512%20256%20512s24-10.75%2024-24v-64C280%20410.8%20269.3%20400%20256%20400zM488%20232h-64c-13.25%200-24%2010.75-24%2024s10.75%2024%2024%2024h64C501.3%20280%20512%20269.3%20512%20256S501.3%20232%20488%20232zM112%20256c0-13.25-10.75-24-24-24h-64C10.75%20232%200%20242.8%200%20256s10.75%2024%2024%2024h64C101.3%20280%20112%20269.3%20112%20256zM391.8%20357.8c-9.344-9.375-24.56-9.372-33.94%20.0031s-9.375%2024.56%200%2033.93l45.25%2045.28c4.672%204.688%2010.83%207.031%2016.97%207.031s12.28-2.344%2016.97-7.031c9.375-9.375%209.375-24.56%200-33.94L391.8%20357.8zM120.2%20154.2c4.672%204.688%2010.83%207.031%2016.97%207.031S149.5%20158.9%20154.2%20154.2c9.375-9.375%209.375-24.56%200-33.93L108.9%2074.97c-9.344-9.375-24.56-9.375-33.94%200s-9.375%2024.56%200%2033.94L120.2%20154.2zM374.8%20161.2c6.141%200%2012.3-2.344%2016.97-7.031l45.25-45.28c9.375-9.375%209.375-24.56%200-33.94s-24.59-9.375-33.94%200l-45.25%2045.28c-9.375%209.375-9.375%2024.56%200%2033.93C362.5%20158.9%20368.7%20161.2%20374.8%20161.2zM120.2%20357.8l-45.25%2045.28c-9.375%209.375-9.375%2024.56%200%2033.94c4.688%204.688%2010.83%207.031%2016.97%207.031s12.3-2.344%2016.97-7.031l45.25-45.28c9.375-9.375%209.375-24.56%200-33.93S129.6%20348.4%20120.2%20357.8z%22%2F%3E%3C%2Fsvg%3E)",
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
