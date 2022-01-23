# warez

```
 __     __     ______     ______     ______     ______
/\ \  _ \ \   /\  __ \   /\  == \   /\  ___\   /\___  \
\ \ \/ ".\ \  \ \  __ \  \ \  __<   \ \  __\   \/_/  /__
 \ \__/".~\_\  \ \_\ \_\  \ \_\ \_\  \ \_____\   /\_____\
  \/_/   \/_/   \/_/\/_/   \/_/ /_/   \/_____/   \/_____/
==========INPUT=HARDWARE=DETECTION=FOR=JAVASCRIPT========
```

Sometimes it makes sense for a user interface to adapt to the input device being
used. For example, in my app [KameSame](https://kamesame.com) I wanted to expand
the input size when the user was interacting with an Apple Pencil as opposed to
the touchscreen or a physical keyboard
([demo](https://twitter.com/searls/status/1484717281406078978)). Unfortunately,
browsers don't make it easy to answer the question "what's the most recent input
method that's been used?", or "what methods have been used since the page was
loaded?"

This tiny package helps answer those questions with a pretty straightforward
little API.

## Install

```
$ npm i -S warez
```

Then `const warez = require('warez')` or `import * as warez from 'warez'` or
whatever.

## Usage

### Monitoring input

The package offers `start()` and `stop()` functions that govern whether user
interactions are being actively monitored. If you intend to track the current
input device, just kick things off with:

```js
warez.start()
```

And you can remove the event handlers with:

```js
warez.stop()
```

### Querying input device information

If you want to know the most recently used input device, you can call:

```js
warez.currentDevice() // will be 'pen', 'keyboard', touch', or 'mouse'
```

And if you call:

```js
warez.allDevices() // an array of one or more of the above input types
```

### Be notified when the current device changes

You can also register an event handler to respond whenever the input device
currently being used by the user changes:

```js
warez.onDeviceChange(e => {
  console.log('Now using device', e.current)
  console.log('Previous device was', e.previous)

  // You might update any nodes in the DOM whose CSS styles ought to reflect
  // the current input device with something like this:
  document.querySelectorAll('[data-warez]').forEach(node => {
    node.setAttribute('data-warez', e.current)
  })
})
```

If you want to remove the handler, you can pass a reference to the function:

```js
warez.removeDeviceChangeHandler(yourHandlerFunction)
```

## Demo

Here's a little demo of the [test page](/test.html) included in this repo:

<img src="https://user-images.githubusercontent.com/79303/150662901-e1a0810f-afa3-4259-8127-1935c2e96616.gif" width="60%"/>
