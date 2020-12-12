let instance = 0;
class V {
  constructor({ mount = "body", data = {}, methods = {}, computed = {} }) {
    // declare instance
    this.computed = computed;
    this.methods = methods;
    this.mount = mount;
    this.data = data;

    this.__proxy__data(this.mount, this.data);
    this.__bind__data();
    this.__add__events();

    window[`$V${instance++}`] = { ...this.__get__set__internal };
  }

  /**
   * create native html component
   */
  static Createcomponents(components = []) {
    components.forEach((component) => {
      window.customElements.define(
        `v-${component.name.toLowerCase()}`,
        component
      );
    });
  }

  static html(strings, ...dynamics) {
    let content = "";
    strings.forEach((string, index) => {
      content += string + (dynamics[index] ?? "");
    });

    return content;
  }

  // define proxy for render data
  __proxy__data(mount, data) {
    try {
      // assing data to access from the global scope
      this.__bind__computed();
      for (const _ in data) window[_] = data[_];
      this.__list__rendering();

      const object_data = data;

      const quoteData = new Proxy(object_data, {
        set: (target, property, value) => {
          target[property] = value;
          quoteNode.render(object_data);
          return true;
        },
      });

      const quoteNode = document.querySelector(mount);
      quoteNode.template = quoteNode.innerHTML;
      const Error = this.__launch_visual_error;
      quoteNode.render = function (data) {
        this.innerHTML = this.template.replace(
          /\{\{((?:.|\r?\n)+?)\}\}/g,
          (__, val) => {
            try {
              // match expressions and elements
              const values = data[val.trim()];
              return values ? values : eval(val);
            } catch (e) {
              console.error(e.message);
              console.error(e.stack);
              Error(
                { message: e.message, stack: e.stack },
                `(${val}) invalid operation`
              );
              return undefined;
            }
          }
        );
      };

      const quotes = [];
      const quoteNumber = Math.ceil(Math.random());
      quoteData.quote = quotes[quoteNumber];
    } catch (e) {
      this.__launch_visual_error(
        { message: e.message, stack: e.stack },
        e.message
      );
    }
  }

  // bind elements
  __bind__data() {
    const elements = document.querySelectorAll("[v-bind]");
    const scope = {};
    elements.forEach((element) => {
      //execute scope setter
      if (element.type === "text" || element.type === "textarea") {
        const propToBind = element.getAttribute("v-bind");
        addScopeProp(propToBind);

        element.onkeyup = function () {
          scope[propToBind] = element.value;
        };
      }

      //bind prop to elements
      function addScopeProp(prop) {
        //add property if needed
        if (!scope.hasOwnProperty(prop)) {
          //value to populate with newvalue
          let value = null;
          Object.defineProperty(scope, prop, {
            set: function (newValue) {
              value = newValue;
              elements.forEach(function (element) {
                //change value to bind elements
                if (element.getAttribute("v-bind") === prop) {
                  if (
                    element.type &&
                    (element.type === "text" || element.type === "textarea")
                  ) {
                    element.value = newValue;
                  } else if (!element.type) {
                    element.innerHTML = newValue;
                  }
                }
              });
            },
            get: function () {
              return value;
            },
            el: true,
          });
        }
      }
    });
  }

  /**
   * assing events for any element
   */
  __add__events() {
    const elements = document.querySelectorAll("[v-click]");

    for (const element of elements) {
      try {
        if (this.methods[element.getAttribute("v-click")]) {
          const listener = this.methods[element.getAttribute("v-click")].bind(
            this.data
          );
          element.addEventListener("click", listener);
          element.removeAttribute("v-click");
        } else {
        }
      } catch (e) {
        this.__launch_visual_error(
          { message: e.message, stack: e.stack },
          e.message
        );

        const source = element.parentElement.innerHTML;
        const target = e.message.split(" ").filter((el) => source.includes(el));
        const start = source.indexOf("v-click=");
        const end = source.indexOf(target[0]) + target[0]?.length + 1;

        this.__generate__code__frame(source, start, end || start + start);
      }
    }
  }

  /**
   * bind computed methods with data object
   */
  __bind__computed() {
    for (const key in this.computed) {
      const bindScope = this.computed[key].bind(this.data);
      this.data[key] = bindScope();
    }
  }

  /**
   * list rendering handler
   */
  __list__rendering(el = document) {
    const elements = el.querySelectorAll("[v-for]");

    for (const element of elements) {
      const [variable, iterator] = element
        .getAttribute("v-for")
        .split("in")
        .map((x) => x.trim());

      console.log({ variable, iterator });

      try {
        let inside = element.innerHTML;

        inside = inside.replace(/{/g, "");
        inside = inside.replace(/}/g, "");
        inside = inside.trim();

        let ObjectIterator =
          typeof eval(iterator) === "string"
            ? this.data[iterator]
            : eval(iterator);

        if (
          !isNaN(parseInt(ObjectIterator)) &&
          typeof ObjectIterator === "number"
        ) {
          const acc = [];
          for (let i = 0; i <= parseInt(ObjectIterator); acc[i] = i++);
          ObjectIterator = acc;
        }

        // const expresion = /\<((?:.|\r?\n)+?)\>/g;
        for (const _ of ObjectIterator) {
          if (inside.includes(variable.trim() + ".")) {
            Object.keys(_).forEach((key) => {
              if (inside.includes(`${variable.trim()}.${key}`)) {
                element.innerHTML += inside.replace(
                  `${variable.trim()}.${key}`,
                  _[key]
                );
              }
            });
          } else {
            element.innerHTML += inside.replace(variable.trim(), _);
          }
        }

        // fix global rendering bug
        if (element.children.length) {
          element.removeChild(element.firstElementChild);
        }

        element.removeAttribute("v-for");
      } catch (e) {
        const source = element.parentElement.innerHTML;
        const target = e.message.split(" ").filter((el) => source.includes(el));
        const start = source.indexOf("v-for=");
        const end = source.indexOf(target[0]) + target[0]?.length + 1;

        this.__launch_visual_error(
          { stack: e.stack, message: e.message },
          e.message
        );

        this.__generate__code__frame(source, start, end || start + start);
      }
    }
  }

  /**
   * launch visual error
   */
  __launch_visual_error({ stack, message }, log = "not valid operation") {
    console.error(message);
    console.error(stack);
    setTimeout(() => {
      document.body.style.backgroundColor = "#181b1c";
      document.body.style.color = "#f9f7f4";

      document.body.innerHTML = `
      <div style="margin: 40px;">
        <h3 style="color: #e32945;">Error:
          <span style="color: #dbdbd9;">
            ${log}
          </span>
        </h3>
        <hr>
        <strong>\uD83D\uDCA5 Crashed: \uD83D\uDC49
          <span>${message}</span>
        </strong>
        <br>
        <code style="max-width: 150px; color: #757471;">${stack}</code>
      </div>
      `;
    }, 200);
  }

  /**
   * generate code frame
   */
  __generate__code__frame(source, start, end) {
    function repeat(str, n) {
      var result = "";
      if (n > 0) {
        while (true) {
          // eslint-disable-line
          if (n & 1) {
            result += str;
          }
          n >>>= 1;
          if (n <= 0) {
            break;
          }
          str += str;
        }
      }
      return result;
    }

    let range = 2;

    if (start === void 0) start = 0;
    if (end === void 0) end = source.length;

    let lines = source.split(/\r?\n/);
    let count = 0;
    let res = [];
    for (let i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count >= start) {
        for (var j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length) {
            continue;
          }
          res.push(
            "" +
              (j + 1) +
              repeat(" ", 3 - String(j + 1).length) +
              "|  " +
              lines[j]
          );
          var lineLength = lines[j].length;
          if (j === i) {
            // push underline
            let pad = start - (count - lineLength) + 1;
            let length = end > count ? lineLength - pad : end - start;
            res.push("   |  " + repeat(" ", pad) + repeat("^", length));
          } else if (j > i) {
            if (end > count) {
              var length$1 = Math.min(end - count, lineLength);
              res.push("   |  " + repeat("^", length$1));
            }
            count += lineLength + 1;
          }
        }
        break;
      }
    }
    console.log(
      "%cPossible error in:",
      "color: #f77148; font-weight:bold; font-size: 15px;"
    );
    console.log(
      `%c${res.join("\n")}`,
      "color: #c7bfbd; font-weight:bold; font-size: 13px;"
    );
  }
}

class Vcomponents extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this.render();
  }

  render() {}
}
