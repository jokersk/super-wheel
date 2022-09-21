# Base use

```js
import Superwheel from 'super-wheel'
```

```js
Superwheel.create(HTMLElment)
```

```js
Superwheel.in(0, 1).do(process => {})
```

```js
Superwheel.onResize(({ is, process }) => {
    if (is('lg')) {
        console.log(process)
    }
})
```
