/**
 * @from https://github.com/isaacs/inherits
 */
function inherits(ctor, superCtor) { /*jshint ignore:line */
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}