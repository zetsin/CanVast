(function (window, document, Math) {
    var $ = (function () {
        var copyIsArray,
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty,
            class2type = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Object]': 'object'
        },
            type = function (obj) {
            return obj === null ? String (obj) : class2type[toString.call (obj)] || "object";
        },
            isWindow = function (obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        },
            isFunction = function (obj) {
            return type (obj) === "function";
        },
            isArray = Array.isArray || function (obj) {
            return type (obj) === "array";
        },
            isPlainObject = function (obj) {
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
        },
            extend = function () {
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
        RenderLayout: function () {
            this._image = this.context.getImageData (0, 0, this.canvas.width, this.canvas.height);
            ! $.isFunction (this.measure) || this.measure ();
            ! $.isFunction (this.layout) || this.layout ();
            ! $.isFunction (this.draw) || this.draw ();
        },
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
                    render: 'RenderLayout',
                    measure: 'MeasureFrameLayout',
                    layout: 'LayoutFrameLayout',
                    draw: 'DrawFrameLayout'
                }
            });
        }
    };
    var View = function (canvast, canvas, context, parent, manifest) {
        var structure,
            key;
        this.canvast = canvast;
        this.canvas = canvas;
        this.context = context;
        this.parent = parent || {
            widthInner: canvas.width,
            heightInner: canvas.height,
            width: canvas.width,
            height: canvas.height,
            widthOuter: canvas.width,
            heightOuter: canvas.height,
            clipWidth: canvas.width,
            clipHeight: canvas.height,
            left: 0,
            top: 0,
            clipLeft: 0,
            clipTop: 0,
            layouts: Structure.BaseLayout ().layouts
        };
        structure = Structure[manifest.name || 'BaseLayout'] ();
        this.layouts = $.extend (true, {}, structure.layouts, manifest.layouts);
        $.extend (true, structure.override, manifest.override);
        for (key in structure.override) {
            if (typeof structure.override[key] == 'string') {
                this[key] = Override[structure.override[key]];
            }
            else if ($.isFunction (structure.override[key])) {
                this[key] = structure.override[key];
            }
        }
        this.children = [];
    };
    function CanVast (element, manifest) {
        this.canvas = typeof element == 'string' ? document.querySelector (element) : element;
        this.context = this.canvas.getContext ("2d");
        this._manifest = {};
        $.extend (true, this._manifest, manifest);
        this._initcanvast ();
        this._initManifest (manifest);
        this._render ();
    }
    CanVast.prototype = {
        version: '1.0.1',
        _initcanvast: function () {
            this._canvas = document.createElement ("canvas");
            this._canvas.width = this.canvas.width;
            this._canvas.height = this.canvas.height;
            this._context = this._canvas.getContext ("2d");
        },
        _initManifest: function (manifest) {
            this._viewroot = this._parseView (manifest, undefined);
        },
        _parseView: function (manifest, parentView) {
            var view,
                child,
                key;
            view = new View (this, this._canvas, this._context, parentView, manifest);
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
            this.context.drawImage (this._canvas, 0, 0);
        }
    };
    if (typeof module != 'undefined' && module.exports) {
        module.exports = CanVast;
    }
    else {
        window.CanVast = CanVast;
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
            background: '#1abc9c',
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
    var canVast = new CanVast (canvas, sample);
};
