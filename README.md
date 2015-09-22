# ZP

> Zero-prefixed markup language

This is a markup language originally intended for annotating color hints for
Narwhal's option parser.
The language avoids overlap and escaping issues by using a strange and perilous
hack that can only be used once: the null character, "\0".

The language looks thusly:

```
The \0quick(\0brown(fox\)\) leaped over the \0lazy(dog\0).
```

The `zp` function accepts a string of markup and a delegate that drives the
production of output based on `push`, `pop`, `write`, and `end` methods.

```js
var zp = require('zp');
var HtmlDelegate = require('zp/html');

var delegate = new HtmlDelegate();
var result = zp('The \0quick(\0brown(fox\0)\0) leaped over the \0lazy(dog\0).', delegate);
if (result.err) throw result.err;

console.log(result.value);
// The <quick><brown>fox</brown></quick> leaped over the <lazy>dog</lazy>.
```
