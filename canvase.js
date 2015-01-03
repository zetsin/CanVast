(function (window, document, Math) {
    var $ = (function () {
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
            extend: extend,
            isFunction: isFunction
        };
    }) ();
    var Override = {
        MeasureFrameLayout: function () {
            var width = 0,
                height = 0,
                w,
                h,
                key;
            if (typeof this.layouts.width == 'number' && this.layouts.width >= 0) {
                this.widthOuter = this.layouts.width;
            }
            else if (this.layouts.width == 'match_parent' && this.parent.layouts.width == 'wrap_content') {
                this.layouts.width = 'wrap_content';
            }
            else if (this.layouts.width != 'wrap_content') {
                this.widthOuter = this.parent.widthInner;
            }
            if (this.layouts.width != 'wrap_content') {
                this.width = this.widthOuter - this.layouts.margin.left - this.layouts.margin.right;
                this.widthInner = this.width - this.layouts.padding.left - this.layouts.padding.right;
            }
            if (typeof this.layouts.height == 'number' && this.layouts.height >= 0) {
                this.heightOuter = this.layouts.height;
            }
            else if (this.layouts.height == 'match_parent' && this.parent.layouts.height == 'wrap_content') {
                this.layouts.height = 'wrap_content';
            }
            else if (this.layouts.height != 'wrap_content') {
                this.heightOuter = this.parent.heightInner;
            }
            if (this.layouts.height != 'wrap_content') {
                this.height = this.heightOuter - this.layouts.margin.top - this.layouts.margin.bottom;
                this.heightInner = this.height - this.layouts.padding.top - this.layouts.padding.bottom;
            }
            for (key in this.children) {
                this.children[key].measure ();
            }
            if (this.layouts.width == 'wrap_content') {
                for (key in this.children) {
                    w = this.children[key].widthOuter;
                    width = w > width ? w : width;
                }
                this.widthOuter = width;
                this.width = this.widthOuter - this.layouts.margin.left - this.layouts.margin.right;
                this.widthInner = this.width - this.layouts.padding.left - this.layouts.padding.right;
            }
            if (this.layouts.height == 'wrap_content') {
                for (key in this.children) {
                    h = this.children[key].heightOuter;
                    height = h > height ? h : height;
                }
                this.heightOuter = height;
                this.height = this.heightOuter - this.layouts.margin.top - this.layouts.margin.bottom;
                this.heightInner = this.height - this.layouts.padding.top - this.layouts.padding.bottom;
            }
        },
        LayoutFrameLayout: function () {
            var cw,
                cwp,
                ch,
                chp,
                key;
            this.left = this.parent.left + this.parent.layouts.padding.left + this.layouts.margin.left;
            this.top = this.parent.top + this.parent.layouts.padding.top + this.layouts.margin.top;
            this.clipLeft = this.left > this.parent.clipLeft ? this.left : this.parent.clipLeft;
            this.clipTop = this.top > this.parent.clipTop ? this.top : this.parent.clipTop;
            cw = this.left + this.width - this.clipLeft;
            cwp = this.parent.left + this.parent.width - this.clipLeft;
            this.clipWidth = cw < cwp ? cw : cwp;
            ch = this.top + this.height - this.clipTop;
            chp = this.parent.top + this.parent.height - this.clipTop;
            this.clipHeight = ch < chp ? ch : chp;
            for (key in this.children) {
                this.children[key].layout ();
            }
        },
        DrawFrameLayout: function () {
            var key;
            this.context.save ();
            this.context.rect (this.clipLeft, this.clipTop, this.clipWidth, this.clipHeight);
            this.context.clip ();
            this.context.fillStyle = this.layouts.background;
            this.context.fillRect (this.left, this.top, this.width, this.height);
            this.context.restore ();
            for (key in this.children) {
                this.children[key].draw ();
            }
        }
    };
    var Structure = {
        BaseLayout: function () {
            return {
                layouts: {
                    weight: 0,
                    width: 'match_parent',
                    height: 'match_parent',
                    background: '#ffffff',
                    padding: {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    },
                    margin: {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    }
                },
                override: {}
            };
        },
        FrameLayout: function () {
            return $.extend (true, Structure.BaseLayout (), {
                override: {
                    measure: 'MeasureFrameLayout',
                    layout: 'LayoutFrameLayout',
                    draw: 'DrawFrameLayout'
                }
            });
        }
    };
    var View = function (canvase, context, parent, manifest) {
        var structure, key;
        this._canvase = canvase;
        this.context = context;
        this.parent = parent || {
            widthInner: canvase.width,
            heightInner: canvase.height,
            width: canvase.width,
            height: canvase.height,
            widthOuter: canvase.width,
            heightOuter: canvase.height,
            clipWidth: canvase.width,
            clipHeight: canvase.height,
            left: 0,
            top: 0,
            clipLeft: 0,
            clipTop: 0,
            layouts: Structure.BaseLayout ().layouts
        };
        structure = Structure[manifest.name || 'BaseLayout'] ();
        this.layouts = $.extend (true, {}, structure.layouts, manifest.layouts);
        $.extend(true, structure.override, manifest.override)
        for(key in structure.override) {
            if(typeof structure.override[key] == 'string') {
                this[key] = Override[structure.override[key]];
            } else if($.isFunction(structure.override[key])) {
                this[key] = structure.override[key];
            }
        }
        this.children = [];
    };
    View.prototype.render = function () {
        this._image = this.context.getImageData (0, 0, this._canvase.width, this._canvase.height);
        ! $.isFunction (this.measure) || this.measure ();
        ! $.isFunction (this.layout) || this.layout ();
        ! $.isFunction (this.draw) || this.draw ();
    };
    function CanVase (element, manifest) {
        this.canvase = typeof element == 'string' ? document.querySelector (element) : element;
        this.context = this.canvase.getContext ("2d");
        this._manifest = {};
        $.extend (true, this._manifest, manifest);
        this._initCanvase ();
        this._initManifest (manifest);
        this._render ();
    }
    CanVase.prototype = {
        version: '1.0.1',
        _initCanvase: function () {
            this._canvase = document.createElement ("canvas");
            this._canvase.width = this.canvase.width;
            this._canvase.height = this.canvase.height;
            this._context = this._canvase.getContext ("2d");
        },
        _initManifest: function (manifest) {
            this._viewroot = this._parseView (manifest, undefined);
        },
        _parseView: function (manifest, parentView) {
            var view,
                child,
                key;
            view = new View (this._canvase, this._context, parentView, manifest);
            if (manifest.children !== undefined) {
                for (key in manifest.children) {
                    child = this._parseView (manifest.children[key], view);
                    if (child !== undefined) {
                        view.children.push (child);
                    }
                }
            }
            return view;
        },
        _render: function () {
            this._viewroot.render ();
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
onload = function () {
    document.documentElement.style.cssText = 'width: 100%; height: 100%;';
    document.body.style.cssText = 'width: 100%; height: 100%; padding: 0; margin: 0; overflow: hidden;';
    var canvas = document.createElement ('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.offsetHeight;
    document.body.appendChild (canvas);
    var canvase = new CanVase (canvas, sample);
};
