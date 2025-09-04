/**
 *
 * JavaScript functionality is separated into individual files.
 *
 * Example:
 *  - Home    => assets/js/pages/home.page.js
 *  - About   => assets/js/pages/about.page.js
 *  - Contact => assets/js/pages/contact.page.js
 *
 */

const navs = [
  {
    id: "home",
    href: "./index.html",
    title: "Home",
  },
  {
    id: "about",
    href: "./about.html",
    title: "About Us",
  },
  {
    id: "contact",
    href: "./contact.html",
    title: "Contact Us",
  },
];

const linkedNames = {
  class: "className",
  text: "innerText",
  html: "innerHTML",
};

///////////////////////////
/// Web Components
//////////////////////////

/**
 * @typedef  Object TravelApp
 * @property {string} module - The module to load.
 *
 */
export default class TravelApp extends HTMLElement {
  baseUrl = "https://zenozaga.github.io/heath_census";
  containerProps = {};

  constructor() {
    super();

    for (const attr of this.attributes) {
      if (attr.name.startsWith("container-")) {
        let name = attr.name.substring(10);
        this.containerProps[name] = attr.value;
      }
    }

    this.activeNav = this.attributes?.["active-nav"]?.value || "home";
    this.hideSearchBar = this.attributes?.["hide-searchbar"]?.value === "true";

    this.module = this.attributes.module?.value;
  }

  //////////////////////////
  /// Helpers
  /////////////////////////

  /**
   * This method was called when the element is ready.
   *
   * @returns
   */
  loadModule(module) {
    import(module).then((handler) => {
      handler.default(this);
    });
  }

  /////////////////////////
  /// Render Template
  /////////////////////////

  connectedCallback() {
    this.onRender();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log({ name, oldValue, newValue });
  }

  onRender() {
    const navigation = element("nav", {
      class: "navigation flex items-center justify-between",
      childrens: [
        element("div", {
          class: "logo",
          childrens: element("a", {
            href: "/index.html",
            class: "logo-text",
            childrens: [
              document.createTextNode("Travel"),
              element("span", {
                class: "logo-text-middle",
                text: "Max",
              }),
            ],
          }),
        }),

        // List of links
        element("ul", {
          class: "navigation-menu",
          childrens: navs.map((nav) =>
            element("li", {
              childrens: [
                element("a", {
                  href: nav.href,
                  class: `nav-link ${
                    nav.id === this.activeNav ? "active" : ""
                  }`,
                  text: nav.title,
                }),
              ],
            })
          ),
        }),

        // empty searchbar
        this.hideSearchBar && element("div", { class: "search-wrapper" }),

        // search bar
        !this.hideSearchBar &&
          element("form", {
            class: "search-wrapper flex justify-center items-center",
            childrens: [
              element("input", {
                type: "text",
                id: "search-input",
                placeholder: "Search destinations...",
                list: "suggestions",
              }),
              element("datalist", {
                id: "suggestions",
                childrens: [
                  element("option", { value: "Beaches" }),
                  element("option", { value: "Temples" }),
                  element("option", { value: "Countries" }),
                ],
              }),
              element("div", {
                class: "buttons flex gap-2",
                childrens: [
                  element("button", {
                    id: "search-button",
                    type: "button",
                    text: "Search",
                  }),
                  element("button", {
                    id: "clear-button",
                    disabled: true,
                    type: "button",
                    text: "Clear",
                  }),
                ],
              }),
            ],
          }),
      ],
    });

    const container = element("div", {
      class: "main-content container flex gap-10",
      attr: this.containerProps,
    });

    const app = element("div", {
      id: "travel-app",
      class: "flex flex-col",
      childrens: [
        element("header", {
          class: "navigation-wrapper",
          childrens: [element("div", { class: "overlay-blur" }), navigation],
        }),
        element("aside", {
          class: "social-wrapper flex flex-col items-center justify-center",
          childrens: [
            element("div", { class: "social-line" }),
            element("div", {
              class: "social-widget flex flex-col items-center gap-4",
              childrens: [
                element("a", {
                  href: "https://twitter.com",
                  target: "_blank",
                  childrens: [
                    element("img", {
                      src: `${this.baseUrl}/assets/icons/twitter.svg`,
                      class: "social-icon twitter",
                    }),
                  ],
                }),
                element("a", {
                  href: "https://facebook.com",
                  target: "_blank",
                  childrens: [
                    element("img", {
                      src: `${this.baseUrl}/assets/icons/facebook.svg`,
                      class: "social-icon facebook",
                    }),
                  ],
                }),
                element("a", {
                  href: "https://instagram.com",
                  target: "_blank",
                  childrens: [
                    element("img", {
                      src: `${this.baseUrl}/assets/icons/instagram.svg`,
                      class: "social-icon instagram",
                    }),
                  ],
                }),
                element("a", {
                  href: "https://youtube.com",
                  target: "_blank",
                  childrens: [
                    element("img", {
                      src: `${this.baseUrl}/assets/icons/youtube.svg`,
                      class: "social-icon youtube",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        element("main", {
          id: "main-wrapper",
          class: "main-wrapper",
          childrens: [container],
        }),
      ],
    });

    const childs = Array.from(this.childNodes);
    append(container, childs);

    this.appendChild(app);
    this.onReady();
    if (this.module) this.loadModule(`${this.baseUrl}/assets/js/pages/${this.module}`);
  }

  onReady() {
    var pass = false;
    const app = document.getElementById("travel-app");

    onScroll();

    window.addEventListener("scroll", onScroll);

    function onScroll() {
      const scrollPosition = window.scrollY;

      if (!pass && scrollPosition > 50) {
        app.classList.add("scrolled");
        pass = true;
      } else if (pass && scrollPosition <= 50) {
        app.classList.remove("scrolled");
        pass = false;
      }
    }
  }
}

/////////////////////////
/// Functions
/////////////////////////

/**
 * @typedef {{[key: string]: any} & {
 *  childrens?: Array<Node> | Node
 * }} Props
 *
 * @param {string} tag
 * @param {Node|Node[]|Props|string}  propsOrChildren
 * @returns {HTMLElement}
 */

function element(tag, propsOrChildren) {
  const el = document.createElement(tag);

  if (typeof propsOrChildren === "string") {
    el.innerHTML = propsOrChildren;
    return el;
  }

  if (Array.isArray(propsOrChildren) || propsOrChildren instanceof Node) {
    append(
      el,
      propsOrChildren instanceof Array ? propsOrChildren : [propsOrChildren]
    );
    return el;
  }

  Object.entries(propsOrChildren).forEach(([key, value]) => {
    if (linkedNames[key]) {
      el[linkedNames[key]] = value;
      return;
    }

    switch (key) {
      case "childrens": {
        append(el, Array.isArray(value) ? value : [value]);
        break;
      }

      case "attr":
        Object.entries(value).forEach(([attrName, attrValue]) => {
          el.setAttribute(attrName, attrValue);
        });
        break;

      case "style":
        Object.entries(value).forEach(([styleName, styleValue]) => {
          el.style[styleName] = styleValue;
        });
        break;

      case "on":
        Object.entries(value).forEach(([eventName, eventHandler]) => {
          el.addEventListener(eventName, eventHandler);
        });
        break;

      default:
        el.setAttribute(key, value);
    }
  });

  return el;
}

/**
 * Safe append
 *
 * @param {*} parent
 * @param  {...any} childs
 */
function append(parent, childs) {
  childs.forEach((child) => {
    if (!child) return;
    if (child === "false") return;
    if (Boolean(child) === false) return;
    parent.appendChild(child);
  });
}

function navigate(title, url, state = {}) {
  history.pushState(state, title, url);
}
