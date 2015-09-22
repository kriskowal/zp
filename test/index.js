'use strict';

var test = require('tape');
var zp = require('../index');
var HtmlDelegate = require('../html');

test('escapes interior markup', function t(assert) {

    var delegate = new HtmlDelegate();
    zp('<before>\0tag(<inside>\0)<after>', delegate);
    assert.equals(delegate.output, '&lt;before&gt;<tag>&lt;inside&gt;</tag>&lt;after&gt;', 'input becomes output');

    assert.end();
});

test('supports recursion', function t(assert) {

    var delegate = new HtmlDelegate();
    zp('The \0quick(\0brown(fox\0)\0) leaped over the \0lazy(dog\0).', delegate);
    assert.equals(delegate.output, 'The <quick><brown>fox</brown></quick> leaped over the <lazy>dog</lazy>.', 'input becomes output');

    assert.end();
});

test('detects unmatched tags', function t(assert) {
    var delegate = new HtmlDelegate();
    var result = zp('\0start(', delegate);
    if (!result.err) {
        assert.fail('expected unmatch tag error');
        return assert.end();
    }
    assert.equals(result.err.message, 'Unmatched tag: start', 'error message for unmatched tags');
    assert.end();
});

test('detects extra close tags', function t(assert) {
    var delegate = new HtmlDelegate();
    var result = zp('\0)', delegate);
    if (!result.err) {
        assert.fail('expected extra closing tag error');
        return assert.end();
    }
    assert.equals(result.err.message, 'Unexpected closing "\\0)" tag', 'error message for extra close tags');
    assert.end();
});
