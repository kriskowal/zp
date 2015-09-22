'use strict';

function zp(pattern, delegate) {
    var index = 0;
    var seek;
    var tag;
    var err;
    var depth = 0;
    while (index < pattern.length) {
        seek = pattern.indexOf('\0', index);
        if (seek < 0) {
            delegate.write(pattern.slice(index, pattern.length));
            return delegate.end(null, pattern.length);
        }
        delegate.write(pattern.slice(index, seek));
        index = seek;
        if (pattern.indexOf('\0)', index) === index) {
            err = delegate.pop(index);
            if (err) {
                return delegate.end(err, index);
            }
            index = seek + 2;
            continue;
        }
        seek = pattern.indexOf('(', index);
        if (seek < 0) {
            err = new SyntaxError('Expected tag name and paren "(" after null character');
            err.index = index;
            return delegate.end(err, index);
        }
        delegate.push(pattern.slice(index + 1, seek));
        index = seek + 1;
    }

    return delegate.end(null, index);
}

module.exports = zp;
