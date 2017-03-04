# starbot-vk-adapter [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

## About

VK ([vk.com](https://vk.com)) adapter for [StarBot](https://github.com/antitim/starbot)

## Installation

```sh
$ npm install --save starbot-vk-adapter
```

## Options

```js
const bot = new Starbot({
  ...
  adapter: {
    type: 'starbot-vk-adapter',
    token: 'token',
    groupId: 'groupId',
    confirmCode: 'confirmCode'
  }
  ...
});
```

## License

MIT © [antitim](http://vk.com/antitim)


[npm-image]: https://badge.fury.io/js/starbot-vk-adapter.svg
[npm-url]: https://npmjs.org/package/starbot-vk-adapter
[travis-image]: https://travis-ci.org/antitim/starbot-vk-adapter.svg?branch=master
[travis-url]: https://travis-ci.org/antitim/starbot-vk-adapter
