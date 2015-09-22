'use strict';

var Result = require('rezult');

function HtmlDelegate() {
    this.stack = [];
    this.output = '';
}

HtmlDelegate.prototype.push = function push(tag) {
    // console.log("PUSH", JSON.stringify(tag));
    this.output += '<' + tag + '>';
    this.stack.push(tag);
};

HtmlDelegate.prototype.pop = function pop(index) {
    if (!this.stack.length) {
        var err = new SyntaxError('Unexpected closing "\\0)" tag');
        err.index = index;
        return err;
    }
    var tag = this.stack.pop();
    this.output += '</' + tag + '>';
    // console.log("POP", JSON.stringify(tag));
};

HtmlDelegate.prototype.write = function write(text) {
    // console.log("WRITE", JSON.stringify(text));
    this.output += text.replace(/[<>&]/g, escape)
};

HtmlDelegate.prototype.end = function end(err, index) {
    if (err) {
        return new Result(err);
    }
    if (this.stack.length > 1) {
        err = new SyntaxError('Unmatched tags: ' + this.stack.join(', '));
        err.index = index;
    } else if (this.stack.length > 0) {
        err = new SyntaxError('Unmatched tag: ' + this.stack[0]);
        err.index = index;
    }
    return new Result(err, this.output);
};

function escape(character) {
    switch (character) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
    }
}

module.exports = HtmlDelegate;
