/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.2
*/

YAHOO.util.Config = function(owner) {
    if (owner) {
        this.init(owner);
    }
};
YAHOO.util.Config.CONFIG_CHANGED_EVENT = "configChanged";
YAHOO.util.Config.BOOLEAN_TYPE = "boolean";
YAHOO.util.Config.prototype = {
    owner: null,
    queueInProgress: false,
    config: null,
    initialConfig: null,
    eventQueue: null,
    configChangedEvent: null,
    checkBoolean: function(val) {
        return (typeof val == YAHOO.util.Config.BOOLEAN_TYPE);
    },
    checkNumber: function(val) {
        return (!isNaN(val));
    },
    fireEvent: function(key, value) {
        var property = this.config[key];
        if (property && property.event) {
            property.event.fire(value);
        }
    },
    addProperty: function(key, propertyObject) {
        key = key.toLowerCase();
        this.config[key] = propertyObject;
        propertyObject.event = new YAHOO.util.CustomEvent(key, this.owner);
        propertyObject.key = key;
        if (propertyObject.handler) {
            propertyObject.event.subscribe(propertyObject.handler, this.owner);
        }
        this.setProperty(key, propertyObject.value, true);
        if (!propertyObject.suppressEvent) {
            this.queueProperty(key, propertyObject.value);
        }
    },
    getConfig: function() {
        var cfg = {};
        for (var prop in this.config) {
            var property = this.config[prop];
            if (property && property.event) {
                cfg[prop] = property.value;
            }
        }
        return cfg;
    },
    getProperty: function(key) {
        var property = this.config[key.toLowerCase()];
        if (property && property.event) {
            return property.value;
        } else {
            return undefined;
        }
    },
    resetProperty: function(key) {
        key = key.toLowerCase();
        var property = this.config[key];
        if (property && property.event) {
            if (this.initialConfig[key] && !YAHOO.lang.isUndefined(this.initialConfig[key])) {
                this.setProperty(key, this.initialConfig[key]);
            }
            return true;
        } else {
            return false;
        }
    },
    setProperty: function(key, value, silent) {
        key = key.toLowerCase();
        if (this.queueInProgress && !silent) {
            this.queueProperty(key, value);
            return true;
        } else {
            var property = this.config[key];
            if (property && property.event) {
                if (property.validator && !property.validator(value)) {
                    return false;
                } else {
                    property.value = value;
                    if (!silent) {
                        this.fireEvent(key, value);
                        this.configChangedEvent.fire([key, value]);
                    }
                    return true;
                }
            } else {
                return false;
            }
        }
    },
    queueProperty: function(key, value) {
        key = key.toLowerCase();
        var property = this.config[key];
        if (property && property.event) {
            if (!YAHOO.lang.isUndefined(value) && property.validator && !property.validator(value)) {
                return false;
            } else {
                if (!YAHOO.lang.isUndefined(value)) {
                    property.value = value;
                } else {
                    value = property.value;
                }
                var foundDuplicate = false;
                var iLen = this.eventQueue.length;
                for (var i = 0; i < iLen; i++) {
                    var queueItem = this.eventQueue[i];
                    if (queueItem) {
                        var queueItemKey = queueItem[0];
                        var queueItemValue = queueItem[1];
                        if (queueItemKey == key) {
                            this.eventQueue[i] = null;
                            this.eventQueue.push([key, (!YAHOO.lang.isUndefined(value) ? value : queueItemValue)]);
                            foundDuplicate = true;
                            break;
                        }
                    }
                }
                if (!foundDuplicate && !YAHOO.lang.isUndefined(value)) {
                    this.eventQueue.push([key, value]);
                }
            }
            if (property.supercedes) {
                var sLen = property.supercedes.length;
                for (var s = 0; s < sLen; s++) {
                    var supercedesCheck = property.supercedes[s];
                    var qLen = this.eventQueue.length;
                    for (var q = 0; q < qLen; q++) {
                        var queueItemCheck = this.eventQueue[q];
                        if (queueItemCheck) {
                            var queueItemCheckKey = queueItemCheck[0];
                            var queueItemCheckValue = queueItemCheck[1];
                            if (queueItemCheckKey == supercedesCheck.toLowerCase()) {
                                this.eventQueue.push([queueItemCheckKey, queueItemCheckValue]);
                                this.eventQueue[q] = null;
                                break;
                            }
                        }
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    },
    refireEvent: function(key) {
        key = key.toLowerCase();
        var property = this.config[key];
        if (property && property.event && !YAHOO.lang.isUndefined(property.value)) {
            if (this.queueInProgress) {
                this.queueProperty(key);
            } else {
                this.fireEvent(key, property.value);
            }
        }
    },
    applyConfig: function(userConfig, init) {
        if (init) {
            this.initialConfig = userConfig;
        }
        for (var prop in userConfig) {
            this.queueProperty(prop, userConfig[prop]);
        }
    },
    refresh: function() {
        for (var prop in this.config) {
            this.refireEvent(prop);
        }
    },
    fireQueue: function() {
        this.queueInProgress = true;
        for (var i = 0; i < this.eventQueue.length; i++) {
            var queueItem = this.eventQueue[i];
            if (queueItem) {
                var key = queueItem[0];
                var value = queueItem[1];
                var property = this.config[key];
                property.value = value;
                this.fireEvent(key, value);
            }
        }
        this.queueInProgress = false;
        this.eventQueue = [];
    },
    subscribeToConfigEvent: function(key, handler, obj, override) {
        var property = this.config[key.toLowerCase()];
        if (property && property.event) {
            if (!YAHOO.util.Config.alreadySubscribed(property.event, handler, obj)) {
                property.event.subscribe(handler, obj, override);
            }
            return true;
        } else {
            return false;
        }
    },
    unsubscribeFromConfigEvent: function(key, handler, obj) {
        var property = this.config[key.toLowerCase()];
        if (property && property.event) {
            return property.event.unsubscribe(handler, obj);
        } else {
            return false;
        }
    },
    toString: function() {
        var output = "Config";
        if (this.owner) {
            output += " [" + this.owner.toString() + "]";
        }
        return output;
    },
    outputEventQueue: function() {
        var output = "";
        for (var q = 0; q < this.eventQueue.length; q++) {
            var queueItem = this.eventQueue[q];
            if (queueItem) {
                output += queueItem[0] + "=" + queueItem[1] + ", ";
            }
        }
        return output;
    }
};
YAHOO.util.Config.prototype.init = function(owner) {
    this.owner = owner;
    this.configChangedEvent = new YAHOO.util.CustomEvent(YAHOO.util.CONFIG_CHANGED_EVENT, this);
    this.queueInProgress = false;
    this.config = {};
    this.initialConfig = {};
    this.eventQueue = [];
};
YAHOO.util.Config.alreadySubscribed = function(evt, fn, obj) {
    for (var e = 0; e < evt.subscribers.length; e++) {
        var subsc = evt.subscribers[e];
        if (subsc && subsc.obj == obj && subsc.fn == fn) {
            return true;
        }
    }
    return false;
};
YAHOO.widget.Module = function(el, userConfig) {
    if (el) {
        this.init(el, userConfig);
    } else {}
};
YAHOO.widget.Module.IMG_ROOT = null;
YAHOO.widget.Module.IMG_ROOT_SSL = null;
YAHOO.widget.Module.CSS_MODULE = "yui-module";
YAHOO.widget.Module.CSS_HEADER = "hd";
YAHOO.widget.Module.CSS_BODY = "bd";
YAHOO.widget.Module.CSS_FOOTER = "ft";
YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL = "javascript:false;";
YAHOO.widget.Module.textResizeEvent = new YAHOO.util.CustomEvent("textResize");
YAHOO.widget.Module._EVENT_TYPES = {
    "BEFORE_INIT": "beforeInit",
    "INIT": "init",
    "APPEND": "append",
    "BEFORE_RENDER": "beforeRender",
    "RENDER": "render",
    "CHANGE_HEADER": "changeHeader",
    "CHANGE_BODY": "changeBody",
    "CHANGE_FOOTER": "changeFooter",
    "CHANGE_CONTENT": "changeContent",
    "DESTORY": "destroy",
    "BEFORE_SHOW": "beforeShow",
    "SHOW": "show",
    "BEFORE_HIDE": "beforeHide",
    "HIDE": "hide"
};
YAHOO.widget.Module._DEFAULT_CONFIG = {
    "VISIBLE": {
        key: "visible",
        value: true,
        validator: YAHOO.lang.isBoolean
    },
    "EFFECT": {
        key: "effect",
        suppressEvent: true,
        supercedes: ["visible"]
    },
    "MONITOR_RESIZE": {
        key: "monitorresize",
        value: true
    }
};
YAHOO.widget.Module.prototype = {
    constructor: YAHOO.widget.Module,
    element: null,
    header: null,
    body: null,
    footer: null,
    id: null,
    imageRoot: YAHOO.widget.Module.IMG_ROOT,
    initEvents: function() {
        var EVENT_TYPES = YAHOO.widget.Module._EVENT_TYPES;
        this.beforeInitEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.BEFORE_INIT, this);
        this.initEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.INIT, this);
        this.appendEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.APPEND, this);
        this.beforeRenderEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.BEFORE_RENDER, this);
        this.renderEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.RENDER, this);
        this.changeHeaderEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.CHANGE_HEADER, this);
        this.changeBodyEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.CHANGE_BODY, this);
        this.changeFooterEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.CHANGE_FOOTER, this);
        this.changeContentEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.CHANGE_CONTENT, this);
        this.destroyEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.DESTORY, this);
        this.beforeShowEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.BEFORE_SHOW, this);
        this.showEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.SHOW, this);
        this.beforeHideEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.BEFORE_HIDE, this);
        this.hideEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.HIDE, this);
    },
    platform: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1) {
            return "windows";
        } else if (ua.indexOf("macintosh") != -1) {
            return "mac";
        } else {
            return false;
        }
    }(),
    browser: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('opera') != -1) {
            return 'opera';
        } else if (ua.indexOf('msie 7') != -1) {
            return 'ie7';
        } else if (ua.indexOf('msie') != -1) {
            return 'ie';
        } else if (ua.indexOf('safari') != -1) {
            return 'safari';
        } else if (ua.indexOf('gecko') != -1) {
            return 'gecko';
        } else {
            return false;
        }
    }(),
    isSecure: function() {
        if (window.location.href.toLowerCase().indexOf("https") === 0) {
            return true;
        } else {
            return false;
        }
    }(),
    initDefaultConfig: function() {
        var DEFAULT_CONFIG = YAHOO.widget.Module._DEFAULT_CONFIG;
        this.cfg.addProperty(DEFAULT_CONFIG.VISIBLE.key, {
            handler: this.configVisible,
            value: DEFAULT_CONFIG.VISIBLE.value,
            validator: DEFAULT_CONFIG.VISIBLE.validator
        });
        this.cfg.addProperty(DEFAULT_CONFIG.EFFECT.key, {
            suppressEvent: DEFAULT_CONFIG.EFFECT.suppressEvent,
            supercedes: DEFAULT_CONFIG.EFFECT.supercedes
        });
        this.cfg.addProperty(DEFAULT_CONFIG.MONITOR_RESIZE.key, {
            handler: this.configMonitorResize,
            value: DEFAULT_CONFIG.MONITOR_RESIZE.value
        });
    },
    init: function(el, userConfig) {
        this.initEvents();
        this.beforeInitEvent.fire(YAHOO.widget.Module);
        this.cfg = new YAHOO.util.Config(this);
        if (this.isSecure) {
            this.imageRoot = YAHOO.widget.Module.IMG_ROOT_SSL;
        }
        if (typeof el == "string") {
            var elId = el;
            el = document.getElementById(el);
            if (!el) {
                el = document.createElement("div");
                el.id = elId;
            }
        }
        this.element = el;
        if (el.id) {
            this.id = el.id;
        }
        var childNodes = this.element.childNodes;
        if (childNodes) {
            for (var i = 0; i < childNodes.length; i++) {
                var child = childNodes[i];
                switch (child.className) {
                    case YAHOO.widget.Module.CSS_HEADER:
                        this.header = child;
                        break;
                    case YAHOO.widget.Module.CSS_BODY:
                        this.body = child;
                        break;
                    case YAHOO.widget.Module.CSS_FOOTER:
                        this.footer = child;
                        break;
                }
            }
        }
        this.initDefaultConfig();
        YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Module.CSS_MODULE);
        if (userConfig) {
            this.cfg.applyConfig(userConfig, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)) {
            this.renderEvent.subscribe(this.cfg.fireQueue, this.cfg, true);
        }
        this.initEvent.fire(YAHOO.widget.Module);
    },
    initResizeMonitor: function() {
        if (this.browser != "opera") {
            var resizeMonitor = document.getElementById("_yuiResizeMonitor");
            if (!resizeMonitor) {
                resizeMonitor = document.createElement("iframe");
                var bIE = (this.browser.indexOf("ie") === 0);
                if (this.isSecure && YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL && bIE) {
                    resizeMonitor.src = YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL;
                }
                resizeMonitor.id = "_yuiResizeMonitor";
                resizeMonitor.style.visibility = "hidden";
                document.body.appendChild(resizeMonitor);
                resizeMonitor.style.width = "10em";
                resizeMonitor.style.height = "10em";
                resizeMonitor.style.position = "absolute";
                var nLeft = -1 * resizeMonitor.offsetWidth;
                var nTop = -1 * resizeMonitor.offsetHeight;
                resizeMonitor.style.top = nTop + "px";
                resizeMonitor.style.left = nLeft + "px";
                resizeMonitor.style.borderStyle = "none";
                resizeMonitor.style.borderWidth = "0";
                YAHOO.util.Dom.setStyle(resizeMonitor, "opacity", "0");
                resizeMonitor.style.visibility = "visible";
                if (!bIE) {
                    var doc = resizeMonitor.contentWindow.document;
                    doc.open();
                    doc.close();
                }
            }
            var fireTextResize = function() {
                YAHOO.widget.Module.textResizeEvent.fire();
            };
            if (resizeMonitor && resizeMonitor.contentWindow) {
                this.resizeMonitor = resizeMonitor;
                YAHOO.widget.Module.textResizeEvent.subscribe(this.onDomResize, this, true);
                if (!YAHOO.widget.Module.textResizeInitialized) {
                    if (!YAHOO.util.Event.addListener(this.resizeMonitor.contentWindow, "resize", fireTextResize)) {
                        YAHOO.util.Event.addListener(this.resizeMonitor, "resize", fireTextResize);
                    }
                    YAHOO.widget.Module.textResizeInitialized = true;
                }
            }
        }
    },
    onDomResize: function(e, obj) {
        var nLeft = -1 * this.resizeMonitor.offsetWidth,
            nTop = -1 * this.resizeMonitor.offsetHeight;
        this.resizeMonitor.style.top = nTop + "px";
        this.resizeMonitor.style.left = nLeft + "px";
    },
    setHeader: function(headerContent) {
        if (!this.header) {
            this.header = document.createElement("div");
            this.header.className = YAHOO.widget.Module.CSS_HEADER;
        }
        if (typeof headerContent == "string") {
            this.header.innerHTML = headerContent;
        } else {
            this.header.innerHTML = "";
            this.header.appendChild(headerContent);
        }
        this.changeHeaderEvent.fire(headerContent);
        this.changeContentEvent.fire();
    },
    appendToHeader: function(element) {
        if (!this.header) {
            this.header = document.createElement("div");
            this.header.className = YAHOO.widget.Module.CSS_HEADER;
        }
        this.header.appendChild(element);
        this.changeHeaderEvent.fire(element);
        this.changeContentEvent.fire();
    },
    setBody: function(bodyContent) {
        if (!this.body) {
            this.body = document.createElement("div");
            this.body.className = YAHOO.widget.Module.CSS_BODY;
        }
        if (typeof bodyContent == "string") {
            this.body.innerHTML = bodyContent;
        } else {
            this.body.innerHTML = "";
            this.body.appendChild(bodyContent);
        }
        this.changeBodyEvent.fire(bodyContent);
        this.changeContentEvent.fire();
    },
    appendToBody: function(element) {
        if (!this.body) {
            this.body = document.createElement("div");
            this.body.className = YAHOO.widget.Module.CSS_BODY;
        }
        this.body.appendChild(element);
        this.changeBodyEvent.fire(element);
        this.changeContentEvent.fire();
    },
    setFooter: function(footerContent) {
        if (!this.footer) {
            this.footer = document.createElement("div");
            this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
        }
        if (typeof footerContent == "string") {
            this.footer.innerHTML = footerContent;
        } else {
            this.footer.innerHTML = "";
            this.footer.appendChild(footerContent);
        }
        this.changeFooterEvent.fire(footerContent);
        this.changeContentEvent.fire();
    },
    appendToFooter: function(element) {
        if (!this.footer) {
            this.footer = document.createElement("div");
            this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
        }
        this.footer.appendChild(element);
        this.changeFooterEvent.fire(element);
        this.changeContentEvent.fire();
    },
    render: function(appendToNode, moduleElement) {
        this.beforeRenderEvent.fire();
        if (!moduleElement) {
            moduleElement = this.element;
        }
        var me = this;
        var appendTo = function(element) {
            if (typeof element == "string") {
                element = document.getElementById(element);
            }
            if (element) {
                element.appendChild(me.element);
                me.appendEvent.fire();
            }
        };
        if (appendToNode) {
            appendTo(appendToNode);
        } else {
            if (!YAHOO.util.Dom.inDocument(this.element)) {
                return false;
            }
        }
        if (this.header && !YAHOO.util.Dom.inDocument(this.header)) {
            var firstChild = moduleElement.firstChild;
            if (firstChild) {
                moduleElement.insertBefore(this.header, firstChild);
            } else {
                moduleElement.appendChild(this.header);
            }
        }
        if (this.body && !YAHOO.util.Dom.inDocument(this.body)) {
            if (this.footer && YAHOO.util.Dom.isAncestor(this.moduleElement, this.footer)) {
                moduleElement.insertBefore(this.body, this.footer);
            } else {
                moduleElement.appendChild(this.body);
            }
        }
        if (this.footer && !YAHOO.util.Dom.inDocument(this.footer)) {
            moduleElement.appendChild(this.footer);
        }
        this.renderEvent.fire();
        return true;
    },
    destroy: function() {
        var parent;
        if (this.element) {
            YAHOO.util.Event.purgeElement(this.element, true);
            parent = this.element.parentNode;
        }
        if (parent) {
            parent.removeChild(this.element);
        }
        this.element = null;
        this.header = null;
        this.body = null;
        this.footer = null;
        for (var e in this) {
            if (e instanceof YAHOO.util.CustomEvent) {
                e.unsubscribeAll();
            }
        }
        YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize, this);
        this.destroyEvent.fire();
    },
    show: function() {
        this.cfg.setProperty("visible", true);
    },
    hide: function() {
        this.cfg.setProperty("visible", false);
    },
    configVisible: function(type, args, obj) {
        var visible = args[0];
        if (visible) {
            this.beforeShowEvent.fire();
            YAHOO.util.Dom.setStyle(this.element, "display", "block");
            this.showEvent.fire();
        } else {
            this.beforeHideEvent.fire();
            YAHOO.util.Dom.setStyle(this.element, "display", "none");
            this.hideEvent.fire();
        }
    },
    configMonitorResize: function(type, args, obj) {
        var monitor = args[0];
        if (monitor) {
            this.initResizeMonitor();
        } else {
            YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize, this, true);
            this.resizeMonitor = null;
        }
    }
};
YAHOO.widget.Module.prototype.toString = function() {
    return "Module " + this.id;
};
YAHOO.widget.Overlay = function(el, userConfig) {
    YAHOO.widget.Overlay.superclass.constructor.call(this, el, userConfig);
};
YAHOO.extend(YAHOO.widget.Overlay, YAHOO.widget.Module);
YAHOO.widget.Overlay._EVENT_TYPES = {
    "BEFORE_MOVE": "beforeMove",
    "MOVE": "move"
};
YAHOO.widget.Overlay._DEFAULT_CONFIG = {
    "X": {
        key: "x",
        validator: YAHOO.lang.isNumber,
        suppressEvent: true,
        supercedes: ["iframe"]
    },
    "Y": {
        key: "y",
        validator: YAHOO.lang.isNumber,
        suppressEvent: true,
        supercedes: ["iframe"]
    },
    "XY": {
        key: "xy",
        suppressEvent: true,
        supercedes: ["iframe"]
    },
    "CONTEXT": {
        key: "context",
        suppressEvent: true,
        supercedes: ["iframe"]
    },
    "FIXED_CENTER": {
        key: "fixedcenter",
        value: false,
        validator: YAHOO.lang.isBoolean,
        supercedes: ["iframe", "visible"]
    },
    "WIDTH": {
        key: "width",
        suppressEvent: true,
        supercedes: ["iframe"]
    },
    "HEIGHT": {
        key: "height",
        suppressEvent: true,
        supercedes: ["iframe"]
    },
    "ZINDEX": {
        key: "zindex",
        value: null
    },
    "CONSTRAIN_TO_VIEWPORT": {
        key: "constraintoviewport",
        value: false,
        validator: YAHOO.lang.isBoolean,
        supercedes: ["iframe", "x", "y", "xy"]
    },
    "IFRAME": {
        key: "iframe",
        value: (YAHOO.widget.Module.prototype.browser == "ie" ? true : false),
        validator: YAHOO.lang.isBoolean,
        supercedes: ["zIndex"]
    }
};
YAHOO.widget.Overlay.IFRAME_SRC = "javascript:false;";
YAHOO.widget.Overlay.TOP_LEFT = "tl";
YAHOO.widget.Overlay.TOP_RIGHT = "tr";
YAHOO.widget.Overlay.BOTTOM_LEFT = "bl";
YAHOO.widget.Overlay.BOTTOM_RIGHT = "br";
YAHOO.widget.Overlay.CSS_OVERLAY = "yui-overlay";
YAHOO.widget.Overlay.prototype.init = function(el, userConfig) {
    YAHOO.widget.Overlay.superclass.init.call(this, el);
    this.beforeInitEvent.fire(YAHOO.widget.Overlay);
    YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Overlay.CSS_OVERLAY);
    if (userConfig) {
        this.cfg.applyConfig(userConfig, true);
    }
    if (this.platform == "mac" && this.browser == "gecko") {
        if (!YAHOO.util.Config.alreadySubscribed(this.showEvent, this.showMacGeckoScrollbars, this)) {
            this.showEvent.subscribe(this.showMacGeckoScrollbars, this, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(this.hideEvent, this.hideMacGeckoScrollbars, this)) {
            this.hideEvent.subscribe(this.hideMacGeckoScrollbars, this, true);
        }
    }
    this.initEvent.fire(YAHOO.widget.Overlay);
};
YAHOO.widget.Overlay.prototype.initEvents = function() {
    YAHOO.widget.Overlay.superclass.initEvents.call(this);
    var EVENT_TYPES = YAHOO.widget.Overlay._EVENT_TYPES;
    this.beforeMoveEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.BEFORE_MOVE, this);
    this.moveEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.MOVE, this);
};
YAHOO.widget.Overlay.prototype.initDefaultConfig = function() {
    YAHOO.widget.Overlay.superclass.initDefaultConfig.call(this);
    var DEFAULT_CONFIG = YAHOO.widget.Overlay._DEFAULT_CONFIG;
    this.cfg.addProperty(DEFAULT_CONFIG.X.key, {
        handler: this.configX,
        validator: DEFAULT_CONFIG.X.validator,
        suppressEvent: DEFAULT_CONFIG.X.suppressEvent,
        supercedes: DEFAULT_CONFIG.X.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.Y.key, {
        handler: this.configY,
        validator: DEFAULT_CONFIG.Y.validator,
        suppressEvent: DEFAULT_CONFIG.Y.suppressEvent,
        supercedes: DEFAULT_CONFIG.Y.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.XY.key, {
        handler: this.configXY,
        suppressEvent: DEFAULT_CONFIG.XY.suppressEvent,
        supercedes: DEFAULT_CONFIG.XY.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.CONTEXT.key, {
        handler: this.configContext,
        suppressEvent: DEFAULT_CONFIG.CONTEXT.suppressEvent,
        supercedes: DEFAULT_CONFIG.CONTEXT.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.FIXED_CENTER.key, {
        handler: this.configFixedCenter,
        value: DEFAULT_CONFIG.FIXED_CENTER.value,
        validator: DEFAULT_CONFIG.FIXED_CENTER.validator,
        supercedes: DEFAULT_CONFIG.FIXED_CENTER.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.WIDTH.key, {
        handler: this.configWidth,
        suppressEvent: DEFAULT_CONFIG.WIDTH.suppressEvent,
        supercedes: DEFAULT_CONFIG.WIDTH.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.HEIGHT.key, {
        handler: this.configHeight,
        suppressEvent: DEFAULT_CONFIG.HEIGHT.suppressEvent,
        supercedes: DEFAULT_CONFIG.HEIGHT.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.ZINDEX.key, {
        handler: this.configzIndex,
        value: DEFAULT_CONFIG.ZINDEX.value
    });
    this.cfg.addProperty(DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.key, {
        handler: this.configConstrainToViewport,
        value: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.value,
        validator: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.validator,
        supercedes: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.IFRAME.key, {
        handler: this.configIframe,
        value: DEFAULT_CONFIG.IFRAME.value,
        validator: DEFAULT_CONFIG.IFRAME.validator,
        supercedes: DEFAULT_CONFIG.IFRAME.supercedes
    });
};
YAHOO.widget.Overlay.prototype.moveTo = function(x, y) {
    this.cfg.setProperty("xy", [x, y]);
};
YAHOO.widget.Overlay.prototype.hideMacGeckoScrollbars = function() {
    YAHOO.util.Dom.removeClass(this.element, "show-scrollbars");
    YAHOO.util.Dom.addClass(this.element, "hide-scrollbars");
};
YAHOO.widget.Overlay.prototype.showMacGeckoScrollbars = function() {
    YAHOO.util.Dom.removeClass(this.element, "hide-scrollbars");
    YAHOO.util.Dom.addClass(this.element, "show-scrollbars");
};
YAHOO.widget.Overlay.prototype.configVisible = function(type, args, obj) {
    var visible = args[0];
    var currentVis = YAHOO.util.Dom.getStyle(this.element, "visibility");
    if (currentVis == "inherit") {
        var e = this.element.parentNode;
        while (e.nodeType != 9 && e.nodeType != 11) {
            currentVis = YAHOO.util.Dom.getStyle(e, "visibility");
            if (currentVis != "inherit") {
                break;
            }
            e = e.parentNode;
        }
        if (currentVis == "inherit") {
            currentVis = "visible";
        }
    }
    var effect = this.cfg.getProperty("effect");
    var effectInstances = [];
    if (effect) {
        if (effect instanceof Array) {
            for (var i = 0; i < effect.length; i++) {
                var eff = effect[i];
                effectInstances[effectInstances.length] = eff.effect(this, eff.duration);
            }
        } else {
            effectInstances[effectInstances.length] = effect.effect(this, effect.duration);
        }
    }
    var isMacGecko = (this.platform == "mac" && this.browser == "gecko");
    if (visible) {
        if (isMacGecko) {
            this.showMacGeckoScrollbars();
        }
        if (effect) {
            if (visible) {
                if (currentVis != "visible" || currentVis === "") {
                    this.beforeShowEvent.fire();
                    for (var j = 0; j < effectInstances.length; j++) {
                        var ei = effectInstances[j];
                        if (j === 0 && !YAHOO.util.Config.alreadySubscribed(ei.animateInCompleteEvent, this.showEvent.fire, this.showEvent)) {
                            ei.animateInCompleteEvent.subscribe(this.showEvent.fire, this.showEvent, true);
                        }
                        ei.animateIn();
                    }
                }
            }
        } else {
            if (currentVis != "visible" || currentVis === "") {
                this.beforeShowEvent.fire();
                YAHOO.util.Dom.setStyle(this.element, "visibility", "visible");
                this.cfg.refireEvent("iframe");
                this.showEvent.fire();
            }
        }
    } else {
        if (isMacGecko) {
            this.hideMacGeckoScrollbars();
        }
        if (effect) {
            if (currentVis == "visible") {
                this.beforeHideEvent.fire();
                for (var k = 0; k < effectInstances.length; k++) {
                    var h = effectInstances[k];
                    if (k === 0 && !YAHOO.util.Config.alreadySubscribed(h.animateOutCompleteEvent, this.hideEvent.fire, this.hideEvent)) {
                        h.animateOutCompleteEvent.subscribe(this.hideEvent.fire, this.hideEvent, true);
                    }
                    h.animateOut();
                }
            } else if (currentVis === "") {
                YAHOO.util.Dom.setStyle(this.element, "visibility", "hidden");
            }
        } else {
            if (currentVis == "visible" || currentVis === "") {
                this.beforeHideEvent.fire();
                YAHOO.util.Dom.setStyle(this.element, "visibility", "hidden");
                this.cfg.refireEvent("iframe");
                this.hideEvent.fire();
            }
        }
    }
};
YAHOO.widget.Overlay.prototype.doCenterOnDOMEvent = function() {
    if (this.cfg.getProperty("visible")) {
        this.center();
    }
};
YAHOO.widget.Overlay.prototype.configFixedCenter = function(type, args, obj) {
    var val = args[0];
    if (val) {
        this.center();
        if (!YAHOO.util.Config.alreadySubscribed(this.beforeShowEvent, this.center, this)) {
            this.beforeShowEvent.subscribe(this.center, this, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowResizeEvent, this.doCenterOnDOMEvent, this)) {
            YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.doCenterOnDOMEvent, this, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowScrollEvent, this.doCenterOnDOMEvent, this)) {
            YAHOO.widget.Overlay.windowScrollEvent.subscribe(this.doCenterOnDOMEvent, this, true);
        }
    } else {
        YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
        YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);
    }
};
YAHOO.widget.Overlay.prototype.configHeight = function(type, args, obj) {
    var height = args[0];
    var el = this.element;
    YAHOO.util.Dom.setStyle(el, "height", height);
    this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.configWidth = function(type, args, obj) {
    var width = args[0];
    var el = this.element;
    YAHOO.util.Dom.setStyle(el, "width", width);
    this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.configzIndex = function(type, args, obj) {
    var zIndex = args[0];
    var el = this.element;
    if (!zIndex) {
        zIndex = YAHOO.util.Dom.getStyle(el, "zIndex");
        if (!zIndex || isNaN(zIndex)) {
            zIndex = 0;
        }
    }
    if (this.iframe) {
        if (zIndex <= 0) {
            zIndex = 1;
        }
        YAHOO.util.Dom.setStyle(this.iframe, "zIndex", (zIndex - 1));
    }
    YAHOO.util.Dom.setStyle(el, "zIndex", zIndex);
    this.cfg.setProperty("zIndex", zIndex, true);
};
YAHOO.widget.Overlay.prototype.configXY = function(type, args, obj) {
    var pos = args[0];
    var x = pos[0];
    var y = pos[1];
    this.cfg.setProperty("x", x);
    this.cfg.setProperty("y", y);
    this.beforeMoveEvent.fire([x, y]);
    x = this.cfg.getProperty("x");
    y = this.cfg.getProperty("y");
    this.cfg.refireEvent("iframe");
    this.moveEvent.fire([x, y]);
};
YAHOO.widget.Overlay.prototype.configX = function(type, args, obj) {
    var x = args[0];
    var y = this.cfg.getProperty("y");
    this.cfg.setProperty("x", x, true);
    this.cfg.setProperty("y", y, true);
    this.beforeMoveEvent.fire([x, y]);
    x = this.cfg.getProperty("x");
    y = this.cfg.getProperty("y");
    YAHOO.util.Dom.setX(this.element, x, true);
    this.cfg.setProperty("xy", [x, y], true);
    this.cfg.refireEvent("iframe");
    this.moveEvent.fire([x, y]);
};
YAHOO.widget.Overlay.prototype.configY = function(type, args, obj) {
    var x = this.cfg.getProperty("x");
    var y = args[0];
    this.cfg.setProperty("x", x, true);
    this.cfg.setProperty("y", y, true);
    this.beforeMoveEvent.fire([x, y]);
    x = this.cfg.getProperty("x");
    y = this.cfg.getProperty("y");
    YAHOO.util.Dom.setY(this.element, y, true);
    this.cfg.setProperty("xy", [x, y], true);
    this.cfg.refireEvent("iframe");
    this.moveEvent.fire([x, y]);
};
YAHOO.widget.Overlay.prototype.showIframe = function() {
    if (this.iframe) {
        this.iframe.style.display = "block";
    }
};
YAHOO.widget.Overlay.prototype.hideIframe = function() {
    if (this.iframe) {
        this.iframe.style.display = "none";
    }
};
YAHOO.widget.Overlay.prototype.configIframe = function(type, args, obj) {
    var val = args[0];
    if (val) {
        if (!YAHOO.util.Config.alreadySubscribed(this.showEvent, this.showIframe, this)) {
            this.showEvent.subscribe(this.showIframe, this, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(this.hideEvent, this.hideIframe, this)) {
            this.hideEvent.subscribe(this.hideIframe, this, true);
        }
        var x = this.cfg.getProperty("x");
        var y = this.cfg.getProperty("y");
        if (!x || !y) {
            this.syncPosition();
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
        }
        if (!isNaN(x) && !isNaN(y)) {
            if (!this.iframe) {
                this.iframe = document.createElement("iframe");
                if (this.isSecure) {
                    this.iframe.src = YAHOO.widget.Overlay.IFRAME_SRC;
                }
                var parent = this.element.parentNode;
                if (parent) {
                    parent.appendChild(this.iframe);
                } else {
                    document.body.appendChild(this.iframe);
                }
                YAHOO.util.Dom.setStyle(this.iframe, "position", "absolute");
                YAHOO.util.Dom.setStyle(this.iframe, "border", "none");
                YAHOO.util.Dom.setStyle(this.iframe, "margin", "0");
                YAHOO.util.Dom.setStyle(this.iframe, "padding", "0");
                YAHOO.util.Dom.setStyle(this.iframe, "opacity", "0");
                if (this.cfg.getProperty("visible")) {
                    this.showIframe();
                } else {
                    this.hideIframe();
                }
            }
            var iframeDisplay = YAHOO.util.Dom.getStyle(this.iframe, "display");
            if (iframeDisplay == "none") {
                this.iframe.style.display = "block";
            }
            YAHOO.util.Dom.setXY(this.iframe, [x, y]);
            var width = this.element.clientWidth;
            var height = this.element.clientHeight;
            YAHOO.util.Dom.setStyle(this.iframe, "width", (width + 2) + "px");
            YAHOO.util.Dom.setStyle(this.iframe, "height", (height + 2) + "px");
            if (iframeDisplay == "none") {
                this.iframe.style.display = "none";
            }
        }
    } else {
        if (this.iframe) {
            this.iframe.style.display = "none";
        }
        this.showEvent.unsubscribe(this.showIframe, this);
        this.hideEvent.unsubscribe(this.hideIframe, this);
    }
};
YAHOO.widget.Overlay.prototype.configConstrainToViewport = function(type, args, obj) {
    var val = args[0];
    if (val) {
        if (!YAHOO.util.Config.alreadySubscribed(this.beforeMoveEvent, this.enforceConstraints, this)) {
            this.beforeMoveEvent.subscribe(this.enforceConstraints, this, true);
        }
    } else {
        this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this);
    }
};
YAHOO.widget.Overlay.prototype.configContext = function(type, args, obj) {
    var contextArgs = args[0];
    if (contextArgs) {
        var contextEl = contextArgs[0];
        var elementMagnetCorner = contextArgs[1];
        var contextMagnetCorner = contextArgs[2];
        if (contextEl) {
            if (typeof contextEl == "string") {
                this.cfg.setProperty("context", [document.getElementById(contextEl), elementMagnetCorner, contextMagnetCorner], true);
            }
            if (elementMagnetCorner && contextMagnetCorner) {
                this.align(elementMagnetCorner, contextMagnetCorner);
            }
        }
    }
};
YAHOO.widget.Overlay.prototype.align = function(elementAlign, contextAlign) {
    var contextArgs = this.cfg.getProperty("context");
    if (contextArgs) {
        var context = contextArgs[0];
        var element = this.element;
        var me = this;
        if (!elementAlign) {
            elementAlign = contextArgs[1];
        }
        if (!contextAlign) {
            contextAlign = contextArgs[2];
        }
        if (element && context) {
            var contextRegion = YAHOO.util.Dom.getRegion(context);
            var doAlign = function(v, h) {
                switch (elementAlign) {
                    case YAHOO.widget.Overlay.TOP_LEFT:
                        me.moveTo(h, v);
                        break;
                    case YAHOO.widget.Overlay.TOP_RIGHT:
                        me.moveTo(h - element.offsetWidth, v);
                        break;
                    case YAHOO.widget.Overlay.BOTTOM_LEFT:
                        me.moveTo(h, v - element.offsetHeight);
                        break;
                    case YAHOO.widget.Overlay.BOTTOM_RIGHT:
                        me.moveTo(h - element.offsetWidth, v - element.offsetHeight);
                        break;
                }
            };
            switch (contextAlign) {
                case YAHOO.widget.Overlay.TOP_LEFT:
                    doAlign(contextRegion.top, contextRegion.left);
                    break;
                case YAHOO.widget.Overlay.TOP_RIGHT:
                    doAlign(contextRegion.top, contextRegion.right);
                    break;
                case YAHOO.widget.Overlay.BOTTOM_LEFT:
                    doAlign(contextRegion.bottom, contextRegion.left);
                    break;
                case YAHOO.widget.Overlay.BOTTOM_RIGHT:
                    doAlign(contextRegion.bottom, contextRegion.right);
                    break;
            }
        }
    }
};
YAHOO.widget.Overlay.prototype.enforceConstraints = function(type, args, obj) {
    var pos = args[0];
    var x = pos[0];
    var y = pos[1];
    var offsetHeight = this.element.offsetHeight;
    var offsetWidth = this.element.offsetWidth;
    var viewPortWidth = YAHOO.util.Dom.getViewportWidth();
    var viewPortHeight = YAHOO.util.Dom.getViewportHeight();
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var topConstraint = scrollY + 10;
    var leftConstraint = scrollX + 10;
    var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
    var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
    if (x < leftConstraint) {
        x = leftConstraint;
    } else if (x > rightConstraint) {
        x = rightConstraint;
    }
    if (y < topConstraint) {
        y = topConstraint;
    } else if (y > bottomConstraint) {
        y = bottomConstraint;
    }
    this.cfg.setProperty("x", x, true);
    this.cfg.setProperty("y", y, true);
    this.cfg.setProperty("xy", [x, y], true);
};
YAHOO.widget.Overlay.prototype.center = function() {
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var viewPortWidth = YAHOO.util.Dom.getClientWidth();
    var viewPortHeight = YAHOO.util.Dom.getClientHeight();
    var elementWidth = this.element.offsetWidth;
    var elementHeight = this.element.offsetHeight;
    var x = (viewPortWidth / 2) - (elementWidth / 2) + scrollX;
    var y = (viewPortHeight / 2) - (elementHeight / 2) + scrollY;
    this.cfg.setProperty("xy", [parseInt(x, 10), parseInt(y, 10)]);
    this.cfg.refireEvent("iframe");
};
YAHOO.widget.Overlay.prototype.syncPosition = function() {
    var pos = YAHOO.util.Dom.getXY(this.element);
    this.cfg.setProperty("x", pos[0], true);
    this.cfg.setProperty("y", pos[1], true);
    this.cfg.setProperty("xy", pos, true);
};
YAHOO.widget.Overlay.prototype.onDomResize = function(e, obj) {
    YAHOO.widget.Overlay.superclass.onDomResize.call(this, e, obj);
    var me = this;
    setTimeout(function() {
        me.syncPosition();
        me.cfg.refireEvent("iframe");
        me.cfg.refireEvent("context");
    }, 0);
};
YAHOO.widget.Overlay.prototype.destroy = function() {
    if (this.iframe) {
        this.iframe.parentNode.removeChild(this.iframe);
    }
    this.iframe = null;
    YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
    YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);
    YAHOO.widget.Overlay.superclass.destroy.call(this);
};
YAHOO.widget.Overlay.prototype.toString = function() {
    return "Overlay " + this.id;
};
YAHOO.widget.Overlay.windowScrollEvent = new YAHOO.util.CustomEvent("windowScroll");
YAHOO.widget.Overlay.windowResizeEvent = new YAHOO.util.CustomEvent("windowResize");
YAHOO.widget.Overlay.windowScrollHandler = function(e) {
    if (YAHOO.widget.Module.prototype.browser == "ie" || YAHOO.widget.Module.prototype.browser == "ie7") {
        if (!window.scrollEnd) {
            window.scrollEnd = -1;
        }
        clearTimeout(window.scrollEnd);
        window.scrollEnd = setTimeout(function() {
            YAHOO.widget.Overlay.windowScrollEvent.fire();
        }, 1);
    } else {
        YAHOO.widget.Overlay.windowScrollEvent.fire();
    }
};
YAHOO.widget.Overlay.windowResizeHandler = function(e) {
    if (YAHOO.widget.Module.prototype.browser == "ie" || YAHOO.widget.Module.prototype.browser == "ie7") {
        if (!window.resizeEnd) {
            window.resizeEnd = -1;
        }
        clearTimeout(window.resizeEnd);
        window.resizeEnd = setTimeout(function() {
            YAHOO.widget.Overlay.windowResizeEvent.fire();
        }, 100);
    } else {
        YAHOO.widget.Overlay.windowResizeEvent.fire();
    }
};
YAHOO.widget.Overlay._initialized = null;
if (YAHOO.widget.Overlay._initialized === null) {
    YAHOO.util.Event.addListener(window, "scroll", YAHOO.widget.Overlay.windowScrollHandler);
    YAHOO.util.Event.addListener(window, "resize", YAHOO.widget.Overlay.windowResizeHandler);
    YAHOO.widget.Overlay._initialized = true;
}
YAHOO.widget.OverlayManager = function(userConfig) {
    this.init(userConfig);
};
YAHOO.widget.OverlayManager.CSS_FOCUSED = "focused";
YAHOO.widget.OverlayManager.prototype = {
    constructor: YAHOO.widget.OverlayManager,
    overlays: null,
    initDefaultConfig: function() {
        this.cfg.addProperty("overlays", {
            suppressEvent: true
        });
        this.cfg.addProperty("focusevent", {
            value: "mousedown"
        });
    },
    init: function(userConfig) {
        this.cfg = new YAHOO.util.Config(this);
        this.initDefaultConfig();
        if (userConfig) {
            this.cfg.applyConfig(userConfig, true);
        }
        this.cfg.fireQueue();
        var activeOverlay = null;
        this.getActive = function() {
            return activeOverlay;
        };
        this.focus = function(overlay) {
            var o = this.find(overlay);
            if (o) {
                if (activeOverlay != o) {
                    if (activeOverlay) {
                        activeOverlay.blur();
                    }
                    activeOverlay = o;
                    YAHOO.util.Dom.addClass(activeOverlay.element, YAHOO.widget.OverlayManager.CSS_FOCUSED);
                    this.overlays.sort(this.compareZIndexDesc);
                    var topZIndex = YAHOO.util.Dom.getStyle(this.overlays[0].element, "zIndex");
                    if (!isNaN(topZIndex) && this.overlays[0] != overlay) {
                        activeOverlay.cfg.setProperty("zIndex", (parseInt(topZIndex, 10) + 2));
                    }
                    this.overlays.sort(this.compareZIndexDesc);
                    o.focusEvent.fire();
                }
            }
        };
        this.remove = function(overlay) {
            var o = this.find(overlay);
            if (o) {
                var originalZ = YAHOO.util.Dom.getStyle(o.element, "zIndex");
                o.cfg.setProperty("zIndex", -1000, true);
                this.overlays.sort(this.compareZIndexDesc);
                this.overlays = this.overlays.slice(0, this.overlays.length - 1);
                o.hideEvent.unsubscribe(o.blur);
                o.destroyEvent.unsubscribe(this._onOverlayDestroy, o);
                if (o.element) {
                    YAHOO.util.Event.removeListener(o.element, this.cfg.getProperty("focusevent"), this._onOverlayElementFocus);
                }
                o.cfg.setProperty("zIndex", originalZ, true);
                o.cfg.setProperty("manager", null);
                o.focusEvent.unsubscribeAll();
                o.blurEvent.unsubscribeAll();
                o.focusEvent = null;
                o.blurEvent = null;
                o.focus = null;
                o.blur = null;
            }
        };
        this.blurAll = function() {
            for (var o = 0; o < this.overlays.length; o++) {
                this.overlays[o].blur();
            }
        };
        this._onOverlayBlur = function(p_sType, p_aArgs) {
            activeOverlay = null;
        };
        var overlays = this.cfg.getProperty("overlays");
        if (!this.overlays) {
            this.overlays = [];
        }
        if (overlays) {
            this.register(overlays);
            this.overlays.sort(this.compareZIndexDesc);
        }
    },
    _onOverlayElementFocus: function(p_oEvent) {
        var oTarget = YAHOO.util.Event.getTarget(p_oEvent),
            oClose = this.close;
        if (oClose && (oTarget == oClose || YAHOO.util.Dom.isAncestor(oClose, oTarget))) {
            this.blur();
        } else {
            this.focus();
        }
    },
    _onOverlayDestroy: function(p_sType, p_aArgs, p_oOverlay) {
        this.remove(p_oOverlay);
    },
    register: function(overlay) {
        if (overlay instanceof YAHOO.widget.Overlay) {
            overlay.cfg.addProperty("manager", {
                value: this
            });
            overlay.focusEvent = new YAHOO.util.CustomEvent("focus", overlay);
            overlay.blurEvent = new YAHOO.util.CustomEvent("blur", overlay);
            var mgr = this;
            overlay.focus = function() {
                mgr.focus(this);
            };
            overlay.blur = function() {
                if (mgr.getActive() == this) {
                    YAHOO.util.Dom.removeClass(this.element, YAHOO.widget.OverlayManager.CSS_FOCUSED);
                    this.blurEvent.fire();
                }
            };
            overlay.blurEvent.subscribe(mgr._onOverlayBlur);
            overlay.hideEvent.subscribe(overlay.blur);
            overlay.destroyEvent.subscribe(this._onOverlayDestroy, overlay, this);
            YAHOO.util.Event.addListener(overlay.element, this.cfg.getProperty("focusevent"), this._onOverlayElementFocus, null, overlay);
            var zIndex = YAHOO.util.Dom.getStyle(overlay.element, "zIndex");
            if (!isNaN(zIndex)) {
                overlay.cfg.setProperty("zIndex", parseInt(zIndex, 10));
            } else {
                overlay.cfg.setProperty("zIndex", 0);
            }
            this.overlays.push(overlay);
            return true;
        } else if (overlay instanceof Array) {
            var regcount = 0;
            for (var i = 0; i < overlay.length; i++) {
                if (this.register(overlay[i])) {
                    regcount++;
                }
            }
            if (regcount > 0) {
                return true;
            }
        } else {
            return false;
        }
    },
    find: function(overlay) {
        if (overlay instanceof YAHOO.widget.Overlay) {
            for (var o = 0; o < this.overlays.length; o++) {
                if (this.overlays[o] == overlay) {
                    return this.overlays[o];
                }
            }
        } else if (typeof overlay == "string") {
            for (var p = 0; p < this.overlays.length; p++) {
                if (this.overlays[p].id == overlay) {
                    return this.overlays[p];
                }
            }
        }
        return null;
    },
    compareZIndexDesc: function(o1, o2) {
        var zIndex1 = o1.cfg.getProperty("zIndex");
        var zIndex2 = o2.cfg.getProperty("zIndex");
        if (zIndex1 > zIndex2) {
            return -1;
        } else if (zIndex1 < zIndex2) {
            return 1;
        } else {
            return 0;
        }
    },
    showAll: function() {
        for (var o = 0; o < this.overlays.length; o++) {
            this.overlays[o].show();
        }
    },
    hideAll: function() {
        for (var o = 0; o < this.overlays.length; o++) {
            this.overlays[o].hide();
        }
    },
    toString: function() {
        return "OverlayManager";
    }
};
YAHOO.widget.Tooltip = function(el, userConfig) {
    YAHOO.widget.Tooltip.superclass.constructor.call(this, el, userConfig);
};
YAHOO.extend(YAHOO.widget.Tooltip, YAHOO.widget.Overlay);
YAHOO.widget.Tooltip.CSS_TOOLTIP = "yui-tt";
YAHOO.widget.Tooltip._DEFAULT_CONFIG = {
    "PREVENT_OVERLAP": {
        key: "preventoverlap",
        value: true,
        validator: YAHOO.lang.isBoolean,
        supercedes: ["x", "y", "xy"]
    },
    "SHOW_DELAY": {
        key: "showdelay",
        value: 200,
        validator: YAHOO.lang.isNumber
    },
    "AUTO_DISMISS_DELAY": {
        key: "autodismissdelay",
        value: 5000,
        validator: YAHOO.lang.isNumber
    },
    "HIDE_DELAY": {
        key: "hidedelay",
        value: 250,
        validator: YAHOO.lang.isNumber
    },
    "TEXT": {
        key: "text",
        suppressEvent: true
    },
    "CONTAINER": {
        key: "container"
    }
};
YAHOO.widget.Tooltip.prototype.init = function(el, userConfig) {
    if (document.readyState && document.readyState != "complete") {
        var deferredInit = function() {
            this.init(el, userConfig);
        };
        YAHOO.util.Event.addListener(window, "load", deferredInit, this, true);
    } else {
        YAHOO.widget.Tooltip.superclass.init.call(this, el);
        this.beforeInitEvent.fire(YAHOO.widget.Tooltip);
        YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Tooltip.CSS_TOOLTIP);
        if (userConfig) {
            this.cfg.applyConfig(userConfig, true);
        }
        this.cfg.queueProperty("visible", false);
        this.cfg.queueProperty("constraintoviewport", true);
        this.setBody("");
        this.render(this.cfg.getProperty("container"));
        this.initEvent.fire(YAHOO.widget.Tooltip);
    }
};
YAHOO.widget.Tooltip.prototype.initDefaultConfig = function() {
    YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);
    var DEFAULT_CONFIG = YAHOO.widget.Tooltip._DEFAULT_CONFIG;
    this.cfg.addProperty(DEFAULT_CONFIG.PREVENT_OVERLAP.key, {
        value: DEFAULT_CONFIG.PREVENT_OVERLAP.value,
        validator: DEFAULT_CONFIG.PREVENT_OVERLAP.validator,
        supercedes: DEFAULT_CONFIG.PREVENT_OVERLAP.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.SHOW_DELAY.key, {
        handler: this.configShowDelay,
        value: 200,
        validator: DEFAULT_CONFIG.SHOW_DELAY.validator
    });
    this.cfg.addProperty(DEFAULT_CONFIG.AUTO_DISMISS_DELAY.key, {
        handler: this.configAutoDismissDelay,
        value: DEFAULT_CONFIG.AUTO_DISMISS_DELAY.value,
        validator: DEFAULT_CONFIG.AUTO_DISMISS_DELAY.validator
    });
    this.cfg.addProperty(DEFAULT_CONFIG.HIDE_DELAY.key, {
        handler: this.configHideDelay,
        value: DEFAULT_CONFIG.HIDE_DELAY.value,
        validator: DEFAULT_CONFIG.HIDE_DELAY.validator
    });
    this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, {
        handler: this.configText,
        suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent
    });
    this.cfg.addProperty(DEFAULT_CONFIG.CONTAINER.key, {
        handler: this.configContainer,
        value: document.body
    });
};
YAHOO.widget.Tooltip.prototype.configText = function(type, args, obj) {
    var text = args[0];
    if (text) {
        this.setBody(text);
    }
};
YAHOO.widget.Tooltip.prototype.configContainer = function(type, args, obj) {
    var container = args[0];
    if (typeof container == 'string') {
        this.cfg.setProperty("container", document.getElementById(container), true);
    }
};
YAHOO.widget.Tooltip.prototype._removeEventListeners = function() {
    var aElements = this._context;
    if (aElements) {
        var nElements = aElements.length;
        if (nElements > 0) {
            var i = nElements - 1,
                oElement;
            do {
                oElement = aElements[i];
                YAHOO.util.Event.removeListener(oElement, "mouseover", this.onContextMouseOver);
                YAHOO.util.Event.removeListener(oElement, "mousemove", this.onContextMouseMove);
                YAHOO.util.Event.removeListener(oElement, "mouseout", this.onContextMouseOut);
            }
            while (i--);
        }
    }
};
YAHOO.widget.Tooltip.prototype.configContext = function(type, args, obj) {
    var context = args[0];
    if (context) {
        if (!(context instanceof Array)) {
            if (typeof context == "string") {
                this.cfg.setProperty("context", [document.getElementById(context)], true);
            } else {
                this.cfg.setProperty("context", [context], true);
            }
            context = this.cfg.getProperty("context");
        }
        this._removeEventListeners();
        this._context = context;
        var aElements = this._context;
        if (aElements) {
            var nElements = aElements.length;
            if (nElements > 0) {
                var i = nElements - 1,
                    oElement;
                do {
                    oElement = aElements[i];
                    YAHOO.util.Event.addListener(oElement, "mouseover", this.onContextMouseOver, this);
                    YAHOO.util.Event.addListener(oElement, "mousemove", this.onContextMouseMove, this);
                    YAHOO.util.Event.addListener(oElement, "mouseout", this.onContextMouseOut, this);
                }
                while (i--);
            }
        }
    }
};
YAHOO.widget.Tooltip.prototype.onContextMouseMove = function(e, obj) {
    obj.pageX = YAHOO.util.Event.getPageX(e);
    obj.pageY = YAHOO.util.Event.getPageY(e);
};
YAHOO.widget.Tooltip.prototype.onContextMouseOver = function(e, obj) {
    if (obj.hideProcId) {
        clearTimeout(obj.hideProcId);
        obj.hideProcId = null;
    }
    var context = this;
    YAHOO.util.Event.addListener(context, "mousemove", obj.onContextMouseMove, obj);
    if (context.title) {
        obj._tempTitle = context.title;
        context.title = "";
    }
    obj.showProcId = obj.doShow(e, context);
};
YAHOO.widget.Tooltip.prototype.onContextMouseOut = function(e, obj) {
    var el = this;
    if (obj._tempTitle) {
        el.title = obj._tempTitle;
        obj._tempTitle = null;
    }
    if (obj.showProcId) {
        clearTimeout(obj.showProcId);
        obj.showProcId = null;
    }
    if (obj.hideProcId) {
        clearTimeout(obj.hideProcId);
        obj.hideProcId = null;
    }
    obj.hideProcId = setTimeout(function() {
        obj.hide();
    }, obj.cfg.getProperty("hidedelay"));
};
YAHOO.widget.Tooltip.prototype.doShow = function(e, context) {
    var yOffset = 25;
    if (this.browser == "opera" && context.tagName && context.tagName.toUpperCase() == "A") {
        yOffset += 12;
    }
    var me = this;
    return setTimeout(function() {
        if (me._tempTitle) {
            me.setBody(me._tempTitle);
        } else {
            me.cfg.refireEvent("text");
        }
        me.moveTo(me.pageX, me.pageY + yOffset);
        if (me.cfg.getProperty("preventoverlap")) {
            me.preventOverlap(me.pageX, me.pageY);
        }
        YAHOO.util.Event.removeListener(context, "mousemove", me.onContextMouseMove);
        me.show();
        me.hideProcId = me.doHide();
    }, this.cfg.getProperty("showdelay"));
};
YAHOO.widget.Tooltip.prototype.doHide = function() {
    var me = this;
    return setTimeout(function() {
        me.hide();
    }, this.cfg.getProperty("autodismissdelay"));
};
YAHOO.widget.Tooltip.prototype.preventOverlap = function(pageX, pageY) {
    var height = this.element.offsetHeight;
    var elementRegion = YAHOO.util.Dom.getRegion(this.element);
    elementRegion.top -= 5;
    elementRegion.left -= 5;
    elementRegion.right += 5;
    elementRegion.bottom += 5;
    var mousePoint = new YAHOO.util.Point(pageX, pageY);
    if (elementRegion.contains(mousePoint)) {
        this.cfg.setProperty("y", (pageY - height - 5));
    }
};
YAHOO.widget.Tooltip.prototype.destroy = function() {
    this._removeEventListeners();
    YAHOO.widget.Tooltip.superclass.destroy.call(this);
};
YAHOO.widget.Tooltip.prototype.toString = function() {
    return "Tooltip " + this.id;
};
YAHOO.widget.Panel = function(el, userConfig) {
    YAHOO.widget.Panel.superclass.constructor.call(this, el, userConfig);
};
YAHOO.extend(YAHOO.widget.Panel, YAHOO.widget.Overlay);
YAHOO.widget.Panel.CSS_PANEL = "yui-panel";
YAHOO.widget.Panel.CSS_PANEL_CONTAINER = "yui-panel-container";
YAHOO.widget.Panel._EVENT_TYPES = {
    "SHOW_MASK": "showMask",
    "HIDE_MASK": "hideMask",
    "DRAG": "drag"
};
YAHOO.widget.Panel._DEFAULT_CONFIG = {
    "CLOSE": {
        key: "close",
        value: true,
        validator: YAHOO.lang.isBoolean,
        supercedes: ["visible"]
    },
    "DRAGGABLE": {
        key: "draggable",
        value: (YAHOO.util.DD ? true : false),
        validator: YAHOO.lang.isBoolean,
        supercedes: ["visible"]
    },
    "UNDERLAY": {
        key: "underlay",
        value: "shadow",
        supercedes: ["visible"]
    },
    "MODAL": {
        key: "modal",
        value: false,
        validator: YAHOO.lang.isBoolean,
        supercedes: ["visible"]
    },
    "KEY_LISTENERS": {
        key: "keylisteners",
        suppressEvent: true,
        supercedes: ["visible"]
    }
};
YAHOO.widget.Panel.prototype.init = function(el, userConfig) {
    YAHOO.widget.Panel.superclass.init.call(this, el);
    this.beforeInitEvent.fire(YAHOO.widget.Panel);
    YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Panel.CSS_PANEL);
    this.buildWrapper();
    if (userConfig) {
        this.cfg.applyConfig(userConfig, true);
    }
    this.beforeRenderEvent.subscribe(function() {
        var draggable = this.cfg.getProperty("draggable");
        if (draggable) {
            if (!this.header) {
                this.setHeader("&#160;");
            }
        }
    }, this, true);
    this.renderEvent.subscribe(function() {
        var sWidth = this.cfg.getProperty("width");
        if (!sWidth) {
            this.cfg.setProperty("width", (this.element.offsetWidth + "px"));
        }
    });
    var me = this;
    var doBlur = function() {
        this.blur();
    };
    this.showMaskEvent.subscribe(function() {
        var checkFocusable = function(el) {
            var sTagName = el.tagName.toUpperCase(),
                bFocusable = false;
            switch (sTagName) {
                case "A":
                case "BUTTON":
                case "SELECT":
                case "TEXTAREA":
                    if (!YAHOO.util.Dom.isAncestor(me.element, el)) {
                        YAHOO.util.Event.addListener(el, "focus", doBlur, el, true);
                        bFocusable = true;
                    }
                    break;
                case "INPUT":
                    if (el.type != "hidden" && !YAHOO.util.Dom.isAncestor(me.element, el)) {
                        YAHOO.util.Event.addListener(el, "focus", doBlur, el, true);
                        bFocusable = true;
                    }
                    break;
            }
            return bFocusable;
        };
        this.focusableElements = YAHOO.util.Dom.getElementsBy(checkFocusable);
    }, this, true);
    this.hideMaskEvent.subscribe(function() {
        for (var i = 0; i < this.focusableElements.length; i++) {
            var el2 = this.focusableElements[i];
            YAHOO.util.Event.removeListener(el2, "focus", doBlur);
        }
    }, this, true);
    this.beforeShowEvent.subscribe(function() {
        this.cfg.refireEvent("underlay");
    }, this, true);
    this.initEvent.fire(YAHOO.widget.Panel);
};
YAHOO.widget.Panel.prototype.initEvents = function() {
    YAHOO.widget.Panel.superclass.initEvents.call(this);
    var EVENT_TYPES = YAHOO.widget.Panel._EVENT_TYPES;
    this.showMaskEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.SHOW_MASK, this);
    this.hideMaskEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.HIDE_MASK, this);
    this.dragEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.DRAG, this);
};
YAHOO.widget.Panel.prototype.initDefaultConfig = function() {
    YAHOO.widget.Panel.superclass.initDefaultConfig.call(this);
    var DEFAULT_CONFIG = YAHOO.widget.Panel._DEFAULT_CONFIG;
    this.cfg.addProperty(DEFAULT_CONFIG.CLOSE.key, {
        handler: this.configClose,
        value: DEFAULT_CONFIG.CLOSE.value,
        validator: DEFAULT_CONFIG.CLOSE.validator,
        supercedes: DEFAULT_CONFIG.CLOSE.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.DRAGGABLE.key, {
        handler: this.configDraggable,
        value: DEFAULT_CONFIG.DRAGGABLE.value,
        validator: DEFAULT_CONFIG.DRAGGABLE.validator,
        supercedes: DEFAULT_CONFIG.DRAGGABLE.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.UNDERLAY.key, {
        handler: this.configUnderlay,
        value: DEFAULT_CONFIG.UNDERLAY.value,
        supercedes: DEFAULT_CONFIG.UNDERLAY.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.MODAL.key, {
        handler: this.configModal,
        value: DEFAULT_CONFIG.MODAL.value,
        validator: DEFAULT_CONFIG.MODAL.validator,
        supercedes: DEFAULT_CONFIG.MODAL.supercedes
    });
    this.cfg.addProperty(DEFAULT_CONFIG.KEY_LISTENERS.key, {
        handler: this.configKeyListeners,
        suppressEvent: DEFAULT_CONFIG.KEY_LISTENERS.suppressEvent,
        supercedes: DEFAULT_CONFIG.KEY_LISTENERS.supercedes
    });
};
YAHOO.widget.Panel.prototype.configClose = function(type, args, obj) {
    var val = args[0];
    var doHide = function(e, obj) {
        obj.hide();
    };
    if (val) {
        if (!this.close) {
            this.close = document.createElement("span");
            YAHOO.util.Dom.addClass(this.close, "container-close");
            this.close.innerHTML = "&#160;";
            this.innerElement.appendChild(this.close);
            YAHOO.util.Event.addListener(this.close, "click", doHide, this);
        } else {
            this.close.style.display = "block";
        }
    } else {
        if (this.close) {
            this.close.style.display = "none";
        }
    }
};
YAHOO.widget.Panel.prototype.configDraggable = function(type, args, obj) {
    var val = args[0];
    if (val) {
        if (!YAHOO.util.DD) {
            this.cfg.setProperty("draggable", false);
            return;
        }
        if (this.header) {
            YAHOO.util.Dom.setStyle(this.header, "cursor", "move");
            this.registerDragDrop();
        }
    } else {
        if (this.dd) {
            this.dd.unreg();
        }
        if (this.header) {
            YAHOO.util.Dom.setStyle(this.header, "cursor", "auto");
        }
    }
};
YAHOO.widget.Panel.prototype.configUnderlay = function(type, args, obj) {
    var val = args[0];
    switch (val.toLowerCase()) {
        case "shadow":
            YAHOO.util.Dom.removeClass(this.element, "matte");
            YAHOO.util.Dom.addClass(this.element, "shadow");
            if (!this.underlay) {
                this.underlay = document.createElement("div");
                this.underlay.className = "underlay";
                this.underlay.innerHTML = "&#160;";
                this.element.appendChild(this.underlay);
            }
            this.sizeUnderlay();
            break;
        case "matte":
            YAHOO.util.Dom.removeClass(this.element, "shadow");
            YAHOO.util.Dom.addClass(this.element, "matte");
            break;
        default:
            YAHOO.util.Dom.removeClass(this.element, "shadow");
            YAHOO.util.Dom.removeClass(this.element, "matte");
            break;
    }
};
YAHOO.widget.Panel.prototype.configModal = function(type, args, obj) {
    var modal = args[0];
    if (modal) {
        this.buildMask();
        if (!YAHOO.util.Config.alreadySubscribed(this.beforeShowEvent, this.showMask, this)) {
            this.beforeShowEvent.subscribe(this.showMask, this, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(this.hideEvent, this.hideMask, this)) {
            this.hideEvent.subscribe(this.hideMask, this, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowResizeEvent, this.sizeMask, this)) {
            YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.sizeMask, this, true);
        }
        if (!YAHOO.util.Config.alreadySubscribed(this.destroyEvent, this.removeMask, this)) {
            this.destroyEvent.subscribe(this.removeMask, this, true);
        }
        this.cfg.refireEvent("zIndex");
    } else {
        this.beforeShowEvent.unsubscribe(this.showMask, this);
        this.hideEvent.unsubscribe(this.hideMask, this);
        YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
        this.destroyEvent.unsubscribe(this.removeMask, this);
    }
};
YAHOO.widget.Panel.prototype.removeMask = function() {
    var oMask = this.mask;
    if (oMask) {
        this.hideMask();
        var oParentNode = oMask.parentNode;
        if (oParentNode) {
            oParentNode.removeChild(oMask);
        }
        this.mask = null;
    }
};
YAHOO.widget.Panel.prototype.configKeyListeners = function(type, args, obj) {
    var listeners = args[0];
    if (listeners) {
        if (listeners instanceof Array) {
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if (!YAHOO.util.Config.alreadySubscribed(this.showEvent, listener.enable, listener)) {
                    this.showEvent.subscribe(listener.enable, listener, true);
                }
                if (!YAHOO.util.Config.alreadySubscribed(this.hideEvent, listener.disable, listener)) {
                    this.hideEvent.subscribe(listener.disable, listener, true);
                    this.destroyEvent.subscribe(listener.disable, listener, true);
                }
            }
        } else {
            if (!YAHOO.util.Config.alreadySubscribed(this.showEvent, listeners.enable, listeners)) {
                this.showEvent.subscribe(listeners.enable, listeners, true);
            }
            if (!YAHOO.util.Config.alreadySubscribed(this.hideEvent, listeners.disable, listeners)) {
                this.hideEvent.subscribe(listeners.disable, listeners, true);
                this.destroyEvent.subscribe(listeners.disable, listeners, true);
            }
        }
    }
};
YAHOO.widget.Panel.prototype.configHeight = function(type, args, obj) {
    var height = args[0];
    var el = this.innerElement;
    YAHOO.util.Dom.setStyle(el, "height", height);
    this.cfg.refireEvent("underlay");
    this.cfg.refireEvent("iframe");
};
YAHOO.widget.Panel.prototype.configWidth = function(type, args, obj) {
    var width = args[0];
    var el = this.innerElement;
    YAHOO.util.Dom.setStyle(el, "width", width);
    this.cfg.refireEvent("underlay");
    this.cfg.refireEvent("iframe");
};
YAHOO.widget.Panel.prototype.configzIndex = function(type, args, obj) {
    YAHOO.widget.Panel.superclass.configzIndex.call(this, type, args, obj);
    var maskZ = 0;
    var currentZ = YAHOO.util.Dom.getStyle(this.element, "zIndex");
    if (this.mask) {
        if (!currentZ || isNaN(currentZ)) {
            currentZ = 0;
        }
        if (currentZ === 0) {
            this.cfg.setProperty("zIndex", 1);
        } else {
            maskZ = currentZ - 1;
            YAHOO.util.Dom.setStyle(this.mask, "zIndex", maskZ);
        }
    }
};
YAHOO.widget.Panel.prototype.buildWrapper = function() {
    var elementParent = this.element.parentNode;
    var originalElement = this.element;
    var wrapper = document.createElement("div");
    wrapper.className = YAHOO.widget.Panel.CSS_PANEL_CONTAINER;
    wrapper.id = originalElement.id + "_c";
    if (elementParent) {
        elementParent.insertBefore(wrapper, originalElement);
    }
    wrapper.appendChild(originalElement);
    this.element = wrapper;
    this.innerElement = originalElement;
    YAHOO.util.Dom.setStyle(this.innerElement, "visibility", "inherit");
};
YAHOO.widget.Panel.prototype.sizeUnderlay = function() {
    if (this.underlay && this.browser != "gecko" && this.browser != "safari") {
        this.underlay.style.width = this.innerElement.offsetWidth + "px";
        this.underlay.style.height = this.innerElement.offsetHeight + "px";
    }
};
YAHOO.widget.Panel.prototype.onDomResize = function(e, obj) {
    YAHOO.widget.Panel.superclass.onDomResize.call(this, e, obj);
    var me = this;
    setTimeout(function() {
        me.sizeUnderlay();
    }, 0);
};
YAHOO.widget.Panel.prototype.registerDragDrop = function() {
    if (this.header) {
        if (!YAHOO.util.DD) {
            return;
        }
        this.dd = new YAHOO.util.DD(this.element.id, this.id);
        if (!this.header.id) {
            this.header.id = this.id + "_h";
        }
        var me = this;
        this.dd.startDrag = function() {
            if (me.browser == "ie") {
                YAHOO.util.Dom.addClass(me.element, "drag");
            }
            if (me.cfg.getProperty("constraintoviewport")) {
                var offsetHeight = me.element.offsetHeight;
                var offsetWidth = me.element.offsetWidth;
                var viewPortWidth = YAHOO.util.Dom.getViewportWidth();
                var viewPortHeight = YAHOO.util.Dom.getViewportHeight();
                var scrollX = window.scrollX || document.documentElement.scrollLeft;
                var scrollY = window.scrollY || document.documentElement.scrollTop;
                var topConstraint = scrollY + 10;
                var leftConstraint = scrollX + 10;
                var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
                var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
                this.minX = leftConstraint;
                this.maxX = rightConstraint;
                this.constrainX = true;
                this.minY = topConstraint;
                this.maxY = bottomConstraint;
                this.constrainY = true;
            } else {
                this.constrainX = false;
                this.constrainY = false;
            }
            me.dragEvent.fire("startDrag", arguments);
        };
        this.dd.onDrag = function() {
            me.syncPosition();
            me.cfg.refireEvent("iframe");
            if (this.platform == "mac" && this.browser == "gecko") {
                this.showMacGeckoScrollbars();
            }
            me.dragEvent.fire("onDrag", arguments);
        };
        this.dd.endDrag = function() {
            if (me.browser == "ie") {
                YAHOO.util.Dom.removeClass(me.element, "drag");
            }
            me.dragEvent.fire("endDrag", arguments);
        };
        this.dd.setHandleElId(this.header.id);
        this.dd.addInvalidHandleType("INPUT");
        this.dd.addInvalidHandleType("SELECT");
        this.dd.addInvalidHandleType("TEXTAREA");
    }
};
YAHOO.widget.Panel.prototype.buildMask = function() {
    if (!this.mask) {
        this.mask = document.createElement("div");
        this.mask.id = this.id + "_mask";
        this.mask.className = "mask";
        this.mask.innerHTML = "&#160;";
        var maskClick = function(e, obj) {
            YAHOO.util.Event.stopEvent(e);
        };
        var firstChild = document.body.firstChild;
        if (firstChild) {
            document.body.insertBefore(this.mask, document.body.firstChild);
        } else {
            document.body.appendChild(this.mask);
        }
    }
};
YAHOO.widget.Panel.prototype.hideMask = function() {
    if (this.cfg.getProperty("modal") && this.mask) {
        this.mask.style.display = "none";
        this.hideMaskEvent.fire();
        YAHOO.util.Dom.removeClass(document.body, "masked");
    }
};
YAHOO.widget.Panel.prototype.showMask = function() {
    if (this.cfg.getProperty("modal") && this.mask) {
        YAHOO.util.Dom.addClass(document.body, "masked");
        this.sizeMask();
        this.mask.style.display = "block";
        this.showMaskEvent.fire();
    }
};
YAHOO.widget.Panel.prototype.sizeMask = function() {
    if (this.mask) {
        this.mask.style.height = YAHOO.util.Dom.getDocumentHeight() + "px";
        this.mask.style.width = YAHOO.util.Dom.getDocumentWidth() + "px";
    }
};
YAHOO.widget.Panel.prototype.render = function(appendToNode) {
    return YAHOO.widget.Panel.superclass.render.call(this, appendToNode, this.innerElement);
};
YAHOO.widget.Panel.prototype.destroy = function() {
    YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
    if (this.close) {
        YAHOO.util.Event.purgeElement(this.close);
    }
    YAHOO.widget.Panel.superclass.destroy.call(this);
};
YAHOO.widget.Panel.prototype.toString = function() {
    return "Panel " + this.id;
};
YAHOO.widget.Dialog = function(el, userConfig) {
    YAHOO.widget.Dialog.superclass.constructor.call(this, el, userConfig);
};
YAHOO.extend(YAHOO.widget.Dialog, YAHOO.widget.Panel);
YAHOO.widget.Dialog.CSS_DIALOG = "yui-dialog";
YAHOO.widget.Dialog._EVENT_TYPES = {
    "BEFORE_SUBMIT": "beforeSubmit",
    "SUBMIT": "submit",
    "MANUAL_SUBMIT": "manualSubmit",
    "ASYNC_SUBMIT": "asyncSubmit",
    "FORM_SUBMIT": "formSubmit",
    "CANCEL": "cancel"
};
YAHOO.widget.Dialog._DEFAULT_CONFIG = {
    "POST_METHOD": {
        key: "postmethod",
        value: "async"
    },
    "BUTTONS": {
        key: "buttons",
        value: "none"
    }
};
YAHOO.widget.Dialog.prototype.initDefaultConfig = function() {
    YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);
    this.callback = {
        success: null,
        failure: null,
        argument: null
    };
    var DEFAULT_CONFIG = YAHOO.widget.Dialog._DEFAULT_CONFIG;
    this.cfg.addProperty(DEFAULT_CONFIG.POST_METHOD.key, {
        handler: this.configPostMethod,
        value: DEFAULT_CONFIG.POST_METHOD.value,
        validator: function(val) {
            if (val != "form" && val != "async" && val != "none" && val != "manual") {
                return false;
            } else {
                return true;
            }
        }
    });
    this.cfg.addProperty(DEFAULT_CONFIG.BUTTONS.key, {
        handler: this.configButtons,
        value: DEFAULT_CONFIG.BUTTONS.value
    });
};
YAHOO.widget.Dialog.prototype.initEvents = function() {
    YAHOO.widget.Dialog.superclass.initEvents.call(this);
    var EVENT_TYPES = YAHOO.widget.Dialog._EVENT_TYPES;
    this.beforeSubmitEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.BEFORE_SUBMIT, this);
    this.submitEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.SUBMIT, this);
    this.manualSubmitEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.MANUAL_SUBMIT, this);
    this.asyncSubmitEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.ASYNC_SUBMIT, this);
    this.formSubmitEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.FORM_SUBMIT, this);
    this.cancelEvent = new YAHOO.util.CustomEvent(EVENT_TYPES.CANCEL, this);
};
YAHOO.widget.Dialog.prototype.init = function(el, userConfig) {
    YAHOO.widget.Dialog.superclass.init.call(this, el);
    this.beforeInitEvent.fire(YAHOO.widget.Dialog);
    YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Dialog.CSS_DIALOG);
    this.cfg.setProperty("visible", false);
    if (userConfig) {
        this.cfg.applyConfig(userConfig, true);
    }
    this.showEvent.subscribe(this.focusFirst, this, true);
    this.beforeHideEvent.subscribe(this.blurButtons, this, true);
    this.beforeRenderEvent.subscribe(function() {
        var buttonCfg = this.cfg.getProperty("buttons");
        if (buttonCfg && buttonCfg != "none") {
            if (!this.footer) {
                this.setFooter("");
            }
        }
    }, this, true);
    this.initEvent.fire(YAHOO.widget.Dialog);
};
YAHOO.widget.Dialog.prototype.doSubmit = function() {
    var pm = this.cfg.getProperty("postmethod");
    switch (pm) {
        case "async":
            var method = this.form.getAttribute("method") || 'POST';
            method = method.toUpperCase();
            YAHOO.util.Connect.setForm(this.form);
            var cObj = YAHOO.util.Connect.asyncRequest(method, this.form.getAttribute("action"), this.callback);
            this.asyncSubmitEvent.fire();
            break;
        case "form":
            this.form.submit();
            this.formSubmitEvent.fire();
            break;
        case "none":
        case "manual":
            this.manualSubmitEvent.fire();
            break;
    }
};
YAHOO.widget.Dialog.prototype._onFormKeyDown = function(p_oEvent) {
    var oTarget = YAHOO.util.Event.getTarget(p_oEvent),
        nCharCode = YAHOO.util.Event.getCharCode(p_oEvent);
    if (nCharCode == 13 && oTarget.tagName && oTarget.tagName.toUpperCase() == "INPUT") {
        var sType = oTarget.type;
        if (sType == "text" || sType == "password" || sType == "checkbox" || sType == "radio" || sType == "file") {
            this.defaultHtmlButton.click();
        }
    }
};
YAHOO.widget.Dialog.prototype.registerForm = function() {
    var form = this.element.getElementsByTagName("form")[0];
    if (!form) {
        var formHTML = "<form name=\"frm_" + this.id + "\" action=\"\"></form>";
        this.body.innerHTML += formHTML;
        form = this.element.getElementsByTagName("form")[0];
    }
    this.firstFormElement = function() {
        for (var f = 0; f < form.elements.length; f++) {
            var el = form.elements[f];
            if (el.focus && !el.disabled) {
                if (el.type && el.type != "hidden") {
                    return el;
                }
            }
        }
        return null;
    }();
    this.lastFormElement = function() {
        for (var f = form.elements.length - 1; f >= 0; f--) {
            var el = form.elements[f];
            if (el.focus && !el.disabled) {
                if (el.type && el.type != "hidden") {
                    return el;
                }
            }
        }
        return null;
    }();
    this.form = form;
    if (this.form && (this.browser == "ie" || this.browser == "ie7" || this.browser == "gecko")) {
        YAHOO.util.Event.addListener(this.form, "keydown", this._onFormKeyDown, null, this);
    }
    if (this.cfg.getProperty("modal") && this.form) {
        var me = this;
        var firstElement = this.firstFormElement || this.firstButton;
        if (firstElement) {
            this.preventBackTab = new YAHOO.util.KeyListener(firstElement, {
                shift: true,
                keys: 9
            }, {
                fn: me.focusLast,
                scope: me,
                correctScope: true
            });
            this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
            this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
        }
        var lastElement = this.lastButton || this.lastFormElement;
        if (lastElement) {
            this.preventTabOut = new YAHOO.util.KeyListener(lastElement, {
                shift: false,
                keys: 9
            }, {
                fn: me.focusFirst,
                scope: me,
                correctScope: true
            });
            this.showEvent.subscribe(this.preventTabOut.enable, this.preventTabOut, true);
            this.hideEvent.subscribe(this.preventTabOut.disable, this.preventTabOut, true);
        }
    }
};
YAHOO.widget.Dialog.prototype.configClose = function(type, args, obj) {
    var val = args[0];
    var doCancel = function(e, obj) {
        obj.cancel();
    };
    if (val) {
        if (!this.close) {
            this.close = document.createElement("div");
            YAHOO.util.Dom.addClass(this.close, "container-close");
            this.close.innerHTML = "&#160;";
            this.innerElement.appendChild(this.close);
            YAHOO.util.Event.addListener(this.close, "click", doCancel, this);
        } else {
            this.close.style.display = "block";
        }
    } else {
        if (this.close) {
            this.close.style.display = "none";
        }
    }
};
YAHOO.widget.Dialog.prototype.configButtons = function(type, args, obj) {
    var buttons = args[0];
    if (buttons != "none") {
        this.buttonSpan = null;
        this.buttonSpan = document.createElement("span");
        this.buttonSpan.className = "button-group";
        for (var b = 0; b < buttons.length; b++) {
            var button = buttons[b];
            var htmlButton = document.createElement("button");
            htmlButton.setAttribute("type", "button");
            if (button.isDefault) {
                htmlButton.className = "default";
                this.defaultHtmlButton = htmlButton;
            }
            htmlButton.appendChild(document.createTextNode(button.text));
            YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this, true);
            this.buttonSpan.appendChild(htmlButton);
            button.htmlButton = htmlButton;
            if (b === 0) {
                this.firstButton = button.htmlButton;
            }
            if (b == (buttons.length - 1)) {
                this.lastButton = button.htmlButton;
            }
        }
        this.setFooter(this.buttonSpan);
        this.cfg.refireEvent("iframe");
        this.cfg.refireEvent("underlay");
    } else {
        if (this.buttonSpan) {
            if (this.buttonSpan.parentNode) {
                this.buttonSpan.parentNode.removeChild(this.buttonSpan);
            }
            this.buttonSpan = null;
            this.firstButton = null;
            this.lastButton = null;
            this.defaultHtmlButton = null;
        }
    }
};
YAHOO.widget.Dialog.prototype.focusFirst = function(type, args, obj) {
    if (args) {
        var e = args[1];
        if (e) {
            YAHOO.util.Event.stopEvent(e);
        }
    }
    if (this.firstFormElement) {
        this.firstFormElement.focus();
    } else {
        this.focusDefaultButton();
    }
};
YAHOO.widget.Dialog.prototype.focusLast = function(type, args, obj) {
    if (args) {
        var e = args[1];
        if (e) {
            YAHOO.util.Event.stopEvent(e);
        }
    }
    var buttons = this.cfg.getProperty("buttons");
    if (buttons && buttons instanceof Array) {
        this.focusLastButton();
    } else {
        if (this.lastFormElement) {
            this.lastFormElement.focus();
        }
    }
};
YAHOO.widget.Dialog.prototype.focusDefaultButton = function() {
    if (this.defaultHtmlButton) {
        this.defaultHtmlButton.focus();
    }
};
YAHOO.widget.Dialog.prototype.blurButtons = function() {
    var buttons = this.cfg.getProperty("buttons");
    if (buttons && buttons instanceof Array) {
        var html = buttons[0].htmlButton;
        if (html) {
            html.blur();
        }
    }
};
YAHOO.widget.Dialog.prototype.focusFirstButton = function() {
    var buttons = this.cfg.getProperty("buttons");
    if (buttons && buttons instanceof Array) {
        var html = buttons[0].htmlButton;
        if (html) {
            html.focus();
        }
    }
};
YAHOO.widget.Dialog.prototype.focusLastButton = function() {
    var buttons = this.cfg.getProperty("buttons");
    if (buttons && buttons instanceof Array) {
        var html = buttons[buttons.length - 1].htmlButton;
        if (html) {
            html.focus();
        }
    }
};
YAHOO.widget.Dialog.prototype.configPostMethod = function(type, args, obj) {
    var postmethod = args[0];
    this.registerForm();
    YAHOO.util.Event.addListener(this.form, "submit", function(e) {
        YAHOO.util.Event.stopEvent(e);
        this.submit();
        this.form.blur();
    }, this, true);
};
YAHOO.widget.Dialog.prototype.validate = function() {
    return true;
};
YAHOO.widget.Dialog.prototype.submit = function() {
    if (this.validate()) {
        this.beforeSubmitEvent.fire();
        this.doSubmit();
        this.submitEvent.fire();
        this.hide();
        return true;
    } else {
        return false;
    }
};
YAHOO.widget.Dialog.prototype.cancel = function() {
    this.cancelEvent.fire();
    this.hide();
};
YAHOO.widget.Dialog.prototype.getData = function() {
    var oForm = this.form;
    if (oForm) {
        var aElements = oForm.elements,
            nTotalElements = aElements.length,
            oData = {},
            sName, oElement, nElements;
        for (var i = 0; i < nTotalElements; i++) {
            sName = aElements[i].name;

            function isFormElement(p_oElement) {
                var sTagName = p_oElement.tagName.toUpperCase();
                return ((sTagName == "INPUT" || sTagName == "TEXTAREA" || sTagName == "SELECT") && p_oElement.name == sName);
            }
            oElement = YAHOO.util.Dom.getElementsBy(isFormElement, "*", oForm);
            nElements = oElement.length;
            if (nElements > 0) {
                if (nElements == 1) {
                    oElement = oElement[0];
                    var sType = oElement.type,
                        sTagName = oElement.tagName.toUpperCase();
                    switch (sTagName) {
                        case "INPUT":
                            if (sType == "checkbox") {
                                oData[sName] = oElement.checked;
                            } else if (sType != "radio") {
                                oData[sName] = oElement.value;
                            }
                            break;
                        case "TEXTAREA":
                            oData[sName] = oElement.value;
                            break;
                        case "SELECT":
                            var aOptions = oElement.options,
                                nOptions = aOptions.length,
                                aValues = [],
                                oOption, sValue;
                            for (var n = 0; n < nOptions; n++) {
                                oOption = aOptions[n];
                                if (oOption.selected) {
                                    sValue = oOption.value;
                                    if (!sValue || sValue === "") {
                                        sValue = oOption.text;
                                    }
                                    aValues[aValues.length] = sValue;
                                }
                            }
                            oData[sName] = aValues;
                            break;
                    }
                } else {
                    var sType = oElement[0].type;
                    switch (sType) {
                        case "radio":
                            var oRadio;
                            for (var n = 0; n < nElements; n++) {
                                oRadio = oElement[n];
                                if (oRadio.checked) {
                                    oData[sName] = oRadio.value;
                                    break;
                                }
                            }
                            break;
                        case "checkbox":
                            var aValues = [],
                                oCheckbox;
                            for (var n = 0; n < nElements; n++) {
                                oCheckbox = oElement[n];
                                if (oCheckbox.checked) {
                                    aValues[aValues.length] = oCheckbox.value;
                                }
                            }
                            oData[sName] = aValues;
                            break;
                    }
                }
            }
        }
    }
    return oData;
};
YAHOO.widget.Dialog.prototype.destroy = function() {
    var Event = YAHOO.util.Event,
        oForm = this.form,
        oFooter = this.footer;
    if (oFooter) {
        var aButtons = oFooter.getElementsByTagName("button");
        if (aButtons && aButtons.length > 0) {
            var i = aButtons.length - 1;
            do {
                Event.purgeElement(aButtons[i], false, "click");
            }
            while (i--);
        }
    }
    if (oForm) {
        Event.purgeElement(oForm);
        this.body.removeChild(oForm);
        this.form = null;
    }
    YAHOO.widget.Dialog.superclass.destroy.call(this);
};
YAHOO.widget.Dialog.prototype.toString = function() {
    return "Dialog " + this.id;
};
YAHOO.widget.SimpleDialog = function(el, userConfig) {
    YAHOO.widget.SimpleDialog.superclass.constructor.call(this, el, userConfig);
};
YAHOO.extend(YAHOO.widget.SimpleDialog, YAHOO.widget.Dialog);
YAHOO.widget.SimpleDialog.ICON_BLOCK = "blckicon";
YAHOO.widget.SimpleDialog.ICON_ALARM = "alrticon";
YAHOO.widget.SimpleDialog.ICON_HELP = "hlpicon";
YAHOO.widget.SimpleDialog.ICON_INFO = "infoicon";
YAHOO.widget.SimpleDialog.ICON_WARN = "warnicon";
YAHOO.widget.SimpleDialog.ICON_TIP = "tipicon";
YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG = "yui-simple-dialog";
YAHOO.widget.SimpleDialog._DEFAULT_CONFIG = {
    "ICON": {
        key: "icon",
        value: "none",
        suppressEvent: true
    },
    "TEXT": {
        key: "text",
        value: "",
        suppressEvent: true,
        supercedes: ["icon"]
    }
};
YAHOO.widget.SimpleDialog.prototype.initDefaultConfig = function() {
    YAHOO.widget.SimpleDialog.superclass.initDefaultConfig.call(this);
    var DEFAULT_CONFIG = YAHOO.widget.SimpleDialog._DEFAULT_CONFIG;
    this.cfg.addProperty(DEFAULT_CONFIG.ICON.key, {
        handler: this.configIcon,
        value: DEFAULT_CONFIG.ICON.value,
        suppressEvent: DEFAULT_CONFIG.ICON.suppressEvent
    });
    this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, {
        handler: this.configText,
        value: DEFAULT_CONFIG.TEXT.value,
        suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent,
        supercedes: DEFAULT_CONFIG.TEXT.supercedes
    });
};
YAHOO.widget.SimpleDialog.prototype.init = function(el, userConfig) {
    YAHOO.widget.SimpleDialog.superclass.init.call(this, el);
    this.beforeInitEvent.fire(YAHOO.widget.SimpleDialog);
    YAHOO.util.Dom.addClass(this.element, YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG);
    this.cfg.queueProperty("postmethod", "manual");
    if (userConfig) {
        this.cfg.applyConfig(userConfig, true);
    }
    this.beforeRenderEvent.subscribe(function() {
        if (!this.body) {
            this.setBody("");
        }
    }, this, true);
    this.initEvent.fire(YAHOO.widget.SimpleDialog);
};
YAHOO.widget.SimpleDialog.prototype.registerForm = function() {
    YAHOO.widget.SimpleDialog.superclass.registerForm.call(this);
    this.form.innerHTML += "<input type=\"hidden\" name=\"" + this.id + "\" value=\"\"/>";
};
YAHOO.widget.SimpleDialog.prototype.configIcon = function(type, args, obj) {
    var icon = args[0];
    if (icon && icon != "none") {
        var iconHTML = "";
        if (icon.indexOf(".") == -1) {
            iconHTML = "<span class=\"yui-icon " + icon + "\" >&#160;</span>";
        } else {
            iconHTML = "<img src=\"" + this.imageRoot + icon + "\" class=\"yui-icon\" />";
        }
        this.body.innerHTML = iconHTML + this.body.innerHTML;
    }
};
YAHOO.widget.SimpleDialog.prototype.configText = function(type, args, obj) {
    var text = args[0];
    if (text) {
        this.setBody(text);
        this.cfg.refireEvent("icon");
    }
};
YAHOO.widget.SimpleDialog.prototype.toString = function() {
    return "SimpleDialog " + this.id;
};
YAHOO.widget.ContainerEffect = function(overlay, attrIn, attrOut, targetElement, animClass) {
    if (!animClass) {
        animClass = YAHOO.util.Anim;
    }
    this.overlay = overlay;
    this.attrIn = attrIn;
    this.attrOut = attrOut;
    this.targetElement = targetElement || overlay.element;
    this.animClass = animClass;
};
YAHOO.widget.ContainerEffect.prototype.init = function() {
    this.beforeAnimateInEvent = new YAHOO.util.CustomEvent("beforeAnimateIn", this);
    this.beforeAnimateOutEvent = new YAHOO.util.CustomEvent("beforeAnimateOut", this);
    this.animateInCompleteEvent = new YAHOO.util.CustomEvent("animateInComplete", this);
    this.animateOutCompleteEvent = new YAHOO.util.CustomEvent("animateOutComplete", this);
    this.animIn = new this.animClass(this.targetElement, this.attrIn.attributes, this.attrIn.duration, this.attrIn.method);
    this.animIn.onStart.subscribe(this.handleStartAnimateIn, this);
    this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this);
    this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, this);
    this.animOut = new this.animClass(this.targetElement, this.attrOut.attributes, this.attrOut.duration, this.attrOut.method);
    this.animOut.onStart.subscribe(this.handleStartAnimateOut, this);
    this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this);
    this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, this);
};
YAHOO.widget.ContainerEffect.prototype.animateIn = function() {
    this.beforeAnimateInEvent.fire();
    this.animIn.animate();
};
YAHOO.widget.ContainerEffect.prototype.animateOut = function() {
    this.beforeAnimateOutEvent.fire();
    this.animOut.animate();
};
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateIn = function(type, args, obj) {};
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateIn = function(type, args, obj) {};
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateIn = function(type, args, obj) {};
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateOut = function(type, args, obj) {};
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateOut = function(type, args, obj) {};
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateOut = function(type, args, obj) {};
YAHOO.widget.ContainerEffect.prototype.toString = function() {
    var output = "ContainerEffect";
    if (this.overlay) {
        output += " [" + this.overlay.toString() + "]";
    }
    return output;
};
YAHOO.widget.ContainerEffect.FADE = function(overlay, dur) {
    var fade = new YAHOO.widget.ContainerEffect(overlay, {
        attributes: {
            opacity: {
                from: 0,
                to: 1
            }
        },
        duration: dur,
        method: YAHOO.util.Easing.easeIn
    }, {
        attributes: {
            opacity: {
                to: 0
            }
        },
        duration: dur,
        method: YAHOO.util.Easing.easeOut
    }, overlay.element);
    fade.handleStartAnimateIn = function(type, args, obj) {
        YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");
        if (!obj.overlay.underlay) {
            obj.overlay.cfg.refireEvent("underlay");
        }
        if (obj.overlay.underlay) {
            obj.initialUnderlayOpacity = YAHOO.util.Dom.getStyle(obj.overlay.underlay, "opacity");
            obj.overlay.underlay.style.filter = null;
        }
        YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
        YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 0);
    };
    fade.handleCompleteAnimateIn = function(type, args, obj) {
        YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");
        if (obj.overlay.element.style.filter) {
            obj.overlay.element.style.filter = null;
        }
        if (obj.overlay.underlay) {
            YAHOO.util.Dom.setStyle(obj.overlay.underlay, "opacity", obj.initialUnderlayOpacity);
        }
        obj.overlay.cfg.refireEvent("iframe");
        obj.animateInCompleteEvent.fire();
    };
    fade.handleStartAnimateOut = function(type, args, obj) {
        YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");
        if (obj.overlay.underlay) {
            obj.overlay.underlay.style.filter = null;
        }
    };
    fade.handleCompleteAnimateOut = function(type, args, obj) {
        YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");
        if (obj.overlay.element.style.filter) {
            obj.overlay.element.style.filter = null;
        }
        YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
        YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 1);
        obj.overlay.cfg.refireEvent("iframe");
        obj.animateOutCompleteEvent.fire();
    };
    fade.init();
    return fade;
};
YAHOO.widget.ContainerEffect.SLIDE = function(overlay, dur) {
    var x = overlay.cfg.getProperty("x") || YAHOO.util.Dom.getX(overlay.element);
    var y = overlay.cfg.getProperty("y") || YAHOO.util.Dom.getY(overlay.element);
    var clientWidth = YAHOO.util.Dom.getClientWidth();
    var offsetWidth = overlay.element.offsetWidth;
    var slide = new YAHOO.widget.ContainerEffect(overlay, {
        attributes: {
            points: {
                to: [x, y]
            }
        },
        duration: dur,
        method: YAHOO.util.Easing.easeIn
    }, {
        attributes: {
            points: {
                to: [(clientWidth + 25), y]
            }
        },
        duration: dur,
        method: YAHOO.util.Easing.easeOut
    }, overlay.element, YAHOO.util.Motion);
    slide.handleStartAnimateIn = function(type, args, obj) {
        obj.overlay.element.style.left = (-25 - offsetWidth) + "px";
        obj.overlay.element.style.top = y + "px";
    };
    slide.handleTweenAnimateIn = function(type, args, obj) {
        var pos = YAHOO.util.Dom.getXY(obj.overlay.element);
        var currentX = pos[0];
        var currentY = pos[1];
        if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden" && currentX < x) {
            YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
        }
        obj.overlay.cfg.setProperty("xy", [currentX, currentY], true);
        obj.overlay.cfg.refireEvent("iframe");
    };
    slide.handleCompleteAnimateIn = function(type, args, obj) {
        obj.overlay.cfg.setProperty("xy", [x, y], true);
        obj.startX = x;
        obj.startY = y;
        obj.overlay.cfg.refireEvent("iframe");
        obj.animateInCompleteEvent.fire();
    };
    slide.handleStartAnimateOut = function(type, args, obj) {
        var vw = YAHOO.util.Dom.getViewportWidth();
        var pos = YAHOO.util.Dom.getXY(obj.overlay.element);
        var yso = pos[1];
        var currentTo = obj.animOut.attributes.points.to;
        obj.animOut.attributes.points.to = [(vw + 25), yso];
    };
    slide.handleTweenAnimateOut = function(type, args, obj) {
        var pos = YAHOO.util.Dom.getXY(obj.overlay.element);
        var xto = pos[0];
        var yto = pos[1];
        obj.overlay.cfg.setProperty("xy", [xto, yto], true);
        obj.overlay.cfg.refireEvent("iframe");
    };
    slide.handleCompleteAnimateOut = function(type, args, obj) {
        YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
        obj.overlay.cfg.setProperty("xy", [x, y]);
        obj.animateOutCompleteEvent.fire();
    };
    slide.init();
    return slide;
};
YAHOO.register("container", YAHOO.widget.Module, {
    version: "2.2.2",
    build: "204"
});
