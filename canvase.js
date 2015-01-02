(function (window, document, Math) {
    $ = (function () {
        var copyIsArray,
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty;
        class2type = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Object]': 'object'
        }, type = function (obj) {
            return obj === null ? String (obj) : class2type[toString.call (obj)] || "object";
        }, isWindow = function (obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        }, isFunction = function (obj) {
            return type (obj) === "function";
        }, isArray = Array.isArray || function (obj) {
            return type (obj) === "array";
        }, isPlainObject = function (obj) {
            if (! obj || type (obj) !== "object" || obj.nodeType || isWindow (obj)) {
                return false;
            }
            if (obj.constructor && ! hasOwn.call (obj, "constructor") && ! hasOwn.call (obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
            var key;
            for (key in obj) {
            }
            return key === undefined || hasOwn.call (obj, key);
        }, extend = function () {
            var options,
                name,
                src,
                copy,
                copyIsArray,
                clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            if (typeof target !== "object" && ! isFunction (target)) {
                target = {};
            }
            if (length === i) {
                target = this;
                -- i;
            }
            for (; i < length; i ++) {
                if ((options = arguments[i]) !== null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        }
                        if (deep && copy && (isPlainObject (copy) || (copyIsArray = isArray (copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && isArray (src) ? src : [];
                            }
                            else {
                                clone = src && isPlainObject (src) ? src : {};
                            }
                            target[name] = extend (deep, clone, copy);
                        }
                        else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        };
        return {
            extend: extend
        };
    }) ();
    var Class = {
        create: function () {
            return function () {
                this.ini.apply (this, arguments);
            };
        }
    };
    var Default = {
        box: function () {
            return {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
        },
        layouts: function () {
            return {
                weight: 0,
                width: 'match_parent',
                height: 'match_parent',
                background: '#ffffff',
                padding: Default.box (),
                margin: Default.box ()
            };
        },
        parent: function (canvase) {
            return {
                _widthInner: canvase.width,
                _heightInner: canvase.height,
                _width: canvase.width,
                _height: canvase.height,
                _widthOuter: canvase.width,
                _heightOuter: canvase.height,
                _clipWidth: canvase.width,
                _clipHeight: canvase.height,
                _left: 0,
                _top: 0,
                _clipLeft: 0,
                _clipTop: 0,
                _layouts: Default.layouts ()
            };
        }
    };
    var View = Class.create ();
    View.prototype.ini = function (canvase, context, parent, layouts) {
        this._canvase = canvase;
        this._context = context;
        this._parent = parent;
        this._layouts = layouts;
        this._default ();
    };
    View.prototype.render = function () {
        this._measure ();
        this._layout ();
        if (this._visiable) {
            this._draw ();
        }
    };
    View.prototype._default = function () {
        this._parent = this._parent || Default.parent (this._canvase);
        this._layouts = $.extend (true, {}, Default.layouts (), this._layouts);
        this._children = [];
    };
    View.prototype._visiable = function () {
        return this._layouts.background !== undefined;
    };
    var FrameLayout = Class.create ();
    FrameLayout.prototype = View.prototype;
    FrameLayout.prototype._measure = function () {
        var width = 0,
            height = 0,
            w,
            h,
            key;
        if (typeof this._layouts.width == 'number' && this._layouts.width >= 0) {
            this._widthOuter = this._layouts.width;
        }
        else if (this._layouts.width == 'match_parent' && this._parent._layouts.width == 'wrap_content') {
            this._layouts.width = 'wrap_content';
        }
        else if (this._layouts.width != 'wrap_content') {
            this._widthOuter = this._parent._widthInner;
        }
        if (this._layouts.width != 'wrap_content') {
            this._width = this._widthOuter - this._layouts.margin.left - this._layouts.margin.right;
            this._widthInner = this._width - this._layouts.padding.left - this._layouts.padding.right;
        }
        if (typeof this._layouts.height == 'number' && this._layouts.height >= 0) {
            this._heightOuter = this._layouts.height;
        }
        else if (this._layouts.height == 'match_parent' && this._parent._layouts.height == 'wrap_content') {
            this._layouts.height = 'wrap_content';
        }
        else if (this._layouts.height != 'wrap_content') {
            this._heightOuter = this._parent._heightInner;
        }
        if (this._layouts.height != 'wrap_content') {
            this._height = this._heightOuter - this._layouts.margin.top - this._layouts.margin.bottom;
            this._heightInner = this._height - this._layouts.padding.top - this._layouts.padding.bottom;
        }
        for (key in this._children) {
            this._children[key]._measure ();
        }
        if (this._layouts.width == 'wrap_content') {
            for (key in this._children) {
                w = this._children[key]._widthOuter;
                width = w > width ? w : width;
            }
            this._widthOuter = width;
            this._width = this._widthOuter - this._layouts.margin.left - this._layouts.margin.right;
            this._widthInner = this._width - this._layouts.padding.left - this._layouts.padding.right;
        }
        if (this._layouts.height == 'wrap_content') {
            for (key in this._children) {
                h = this._children[key]._heightOuter;
                height = h > height ? h : height;
            }
            this._heightOuter = height;
            this._height = this._heightOuter - this._layouts.margin.top - this._layouts.margin.bottom;
            this._heightInner = this._height - this._layouts.padding.top - this._layouts.padding.bottom;
        }
    };
    FrameLayout.prototype._layout = function () {
        var cw,
            cwp,
            ch,
            chp,
            key;
        this._left = this._parent._left + this._parent._layouts.padding.left + this._layouts.margin.left;
        this._top = this._parent._top + this._parent._layouts.padding.top + this._layouts.margin.top;
        this._clipLeft = this._left > this._parent._clipLeft ? this._left : this._parent._clipLeft;
        this._clipTop = this._top > this._parent._clipTop ? this._top : this._parent._clipTop;
        cw = this._left + this._width - this._clipLeft;
        cwp = this._parent._left + this._parent._width - this._clipLeft;
        this._clipWidth = cw < cwp ? cw : cwp;
        ch = this._top + this._height - this._clipTop;
        chp = this._parent._top + this._parent._height - this._clipTop;
        this._clipHeight = ch < chp ? ch : chp;
        for (key in this._children) {
            this._children[key]._layout ();
        }
    };
    FrameLayout.prototype._draw = function () {
        this._image = this._context.getImageData (0, 0, this._canvase.width, this._canvase.height);
        this._doDraw ();
    };
    FrameLayout.prototype._reDraw = function () {
        this._context.putImageData (this._image, 0, 0);
        this._doDraw ();
    };
    FrameLayout.prototype._doDraw = function () {
        var key;
        this._context.save ();
        this._context.rect (this._clipLeft, this._clipTop, this._clipWidth, this._clipHeight);
        this._context.clip ();
        this._context.fillStyle = this._layouts.background;
        this._context.fillRect (this._left, this._top, this._width, this._height);
        this._context.restore ();
        for (key in this._children) {
            this._children[key]._draw ();
        }
    };
    var Views = {
        'FrameLayout': FrameLayout
    };
    function CanVase (element, manifest) {
        this.canvase = typeof element == 'string' ? document.querySelector (element) : element;
        this.context = this.canvase.getContext ("2d");
        this._manifest = {};
        $.extend (true, this._manifest, manifest);
        this._init ();
        this._render ();
    }
    CanVase.prototype = {
        version: '1.0.1',
        _init: function () {
            this._initCanvase ();
            this._initManifest ();
        },
        _initCanvase: function () {
            this._canvase = document.createElement ("canvas");
            this._canvase.width = this.canvase.width;
            this._canvase.height = this.canvase.height;
            this._context = this._canvase.getContext ("2d");
        },
        _initManifest: function () {
            this._viewmain = this._parseView (this._manifest, undefined);
        },
        _parseView: function (manifest, parentView) {
            var func,
                view,
                child,
                key;
            func = Views[manifest.name];
            if (func === undefined) {
                return;
            }
            view = new func (this._canvase, this._context, parentView, manifest.layouts);
            if (manifest.children !== undefined) {
                for (key in manifest.children) {
                    child = this._parseView (manifest.children[key], view);
                    if (child !== undefined) {
                        view._children.push (child);
                    }
                }
            }
            return view;
        },
        _render: function () {
            this._viewmain.render ();
            this.context.drawImage (this._canvase, 0, 0);
        }
    };
    if (typeof module != 'undefined' && module.exports) {
        module.exports = CanVase;
    }
    else {
        window.CanVase = CanVase;
    }
}) (window, document, Math);
var sample = {
    name: 'FrameLayout',
    layouts: {
        background: '#eff0f2',
        padding: {
            top: 10
        }
    },
    children: [{
        name: 'FrameLayout',
        layouts: {
            width: 'match_parent',
            height: 100,
            background: '#e74c3c',
            margin: {
                left: 50,
                right: 50
            }
        }
    }]
};
setTimeout (function () {
    var canvas = document.createElement ('canvas');
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    document.body.appendChild (canvas);
    var canvase = new CanVase (canvas, sample);
}, 1000);
