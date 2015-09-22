var zp = require('./index');
var HtmlDelegate = require('./html');

var delegate = new HtmlDelegate();
var result = zp('The \0quick(\0brown(fox\0)\0) leaped over the \0lazy(dog\0).', delegate);
if (result.err) throw result.err;

console.log(result.value);
// The <quick><brown>fox</brown></quick> leaped over the <lazy>dog</lazy>.
