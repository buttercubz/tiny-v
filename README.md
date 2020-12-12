# tiny-v
a toy that simulates the syntax of vue 2.x but works xd

# features

- list rendering
> not not works with multiple nested objects, only one level objects
```jsx
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>

new V({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```
## more examples:

v-for with a Range
```jsx
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```
## Interpolation

```jsx
<span>Message: {{ msg }}</span>
```

also support interpolation with expressions

```jsx
<span>{{ 'node'.split('').reverse().join('') }}</span>
```

## Computed Properties
> as in vue the computed have access to the data object through this['...']
```jsx
<div id="example">
  <p>{{ deno }}</p>
</div>

new V({
  el: '#example',
  data: {
    message: 'node'
  },
  computed: {
    deno() {
      return this.message.split('').reverse().join('')
    }
  }
})
```

## Method Event Handlers

```jsx
<div id="example-2">
  <button v-click="greet">Greet</button>
</div>

new V({
  el: '#example-2',
  data: {
    name: 'tiny V'
  },
  methods: {
    greet(event) {
      alert('Hello ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

```
