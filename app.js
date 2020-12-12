class VoteCard extends Vcomponents {
  constructor() {
    super();
  }
  render() {
    return V.html`<div class="alert alert-primary" role="alert">
                    A simple primary alert—check it out!
                  </div>`;
  }
}

V.Createcomponents([VoteCard]);

const vm = new V({
  mount: "#app",
  data: {
    message: "Hello world",
    count: 10,
    counter: 10,
    items: [1, 2, 3, 4, 5, 6],
    names: ["juan", "maria", "jose", "pablo", "albis"],
  },
  methods: {
    more() {
      console.log(this);
    },
  },
  computed: {
    messages() {
      return this.names.map((el) => this.message + " " + el).join("<br>");
    },
  },
});


console.log(Object.keys(vm.data))