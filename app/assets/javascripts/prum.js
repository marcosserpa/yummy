var PRUM_EPISODES = PRUM_EPISODES || {};
PRUM_EPISODES.q = PRUM_EPISODES.q || [];
PRUM_EPISODES.version = "0.2";
PRUM_EPISODES.targetOrigin = document.location.protocol + "//" + document.location.hostname;
PRUM_EPISODES.bPostMessage = false;
PRUM_EPISODES.beaconUrl = PRUM_EPISODES.beaconUrl || "/images/beacon.gif";
PRUM_EPISODES.autorun = false;
PRUM_EPISODES.init = function() {
    PRUM_EPISODES.bDone = false;
    PRUM_EPISODES.bUnloaded = false;
    PRUM_EPISODES.marks = {};
    PRUM_EPISODES.measures = {};
    PRUM_EPISODES.starts = {};
    PRUM_EPISODES.findStartTime();
    PRUM_EPISODES.addEventListener("beforeunload", PRUM_EPISODES.beforeUnload, false);
    PRUM_EPISODES.addEventListener("pagehide", PRUM_EPISODES.beforeUnload, false);
    PRUM_EPISODES.addEventListener("unload", PRUM_EPISODES.beforeUnload, false);
    PRUM_EPISODES.addOnLoadListener(PRUM_EPISODES.onload);
    PRUM_EPISODES.processQ()
};
PRUM_EPISODES.processQ = function() {
    var a = PRUM_EPISODES.q.length;
    for (var b = 0; b < a; b++) {
        var d = PRUM_EPISODES.q[b];
        var c = d[0];
        if ("mark" === c) {
            PRUM_EPISODES.mark(d[1], d[2])
        } else {
            if ("measure" === c) {
                PRUM_EPISODES.measure(d[1], d[2], d[3])
            } else {
                if ("done" === c) {
                    PRUM_EPISODES.done(d[1])
                }
            }
        }
    }
};
PRUM_EPISODES.mark = function(a, b) {
    PRUM_EPISODES.dprint("PRUM_EPISODES.mark: " + a + ", " + b);
    if (!a) {
        PRUM_EPISODES.dprint("Error: markName is undefined in PRUM_EPISODES.mark.");
        return
    }
    PRUM_EPISODES.marks[a] = parseInt(b || new Date().getTime());
    if (PRUM_EPISODES.bPostMessage) {
        window.postMessage("PRUM_EPISODES:mark:" + a + ":" + b, PRUM_EPISODES.targetOrigin)
    }
    if ("firstbyte" === a) {
        PRUM_EPISODES.measure("backend", "starttime", "firstbyte")
    } else {
        if ("onload" === a) {
            PRUM_EPISODES.measure("frontend", "firstbyte", "onload");
            PRUM_EPISODES.measure("page load time", "starttime", "onload")
        } else {
            if ("done" === a) {
                PRUM_EPISODES.measure("total load time", "starttime", "done")
            }
        }
    }
};
PRUM_EPISODES.measure = function(c, b, e) {
    PRUM_EPISODES.dprint("PRUM_EPISODES.measure: " + c + ", " + b + ", " + e);
    if (!c) {
        PRUM_EPISODES.dprint("Error: episodeName is undefined in PRUM_EPISODES.measure.");
        return
    }
    var a;
    if ("undefined" === typeof(b)) {
        if ("number" === typeof(PRUM_EPISODES.marks[c])) {
            a = PRUM_EPISODES.marks[c]
        } else {
            a = new Date().getTime()
        }
    } else {
        if ("number" === typeof(PRUM_EPISODES.marks[b])) {
            a = PRUM_EPISODES.marks[b]
        } else {
            if ("number" === typeof(b)) {
                a = b
            } else {
                PRUM_EPISODES.dprint("Error: unexpected startNameOrTime in PRUM_EPISODES.measure: " + b);
                return
            }
        }
    }
    var d;
    if ("undefined" === typeof(e)) {
        d = new Date().getTime()
    } else {
        if ("number" === typeof(PRUM_EPISODES.marks[e])) {
            d = PRUM_EPISODES.marks[e]
        } else {
            if ("number" === typeof(e)) {
                d = e
            } else {
                PRUM_EPISODES.dprint("Error: unexpected endNameOrTime in PRUM_EPISODES.measure: " + e);
                return
            }
        }
    }
    PRUM_EPISODES.starts[c] = parseInt(a);
    PRUM_EPISODES.measures[c] = parseInt(d - a);
    if (PRUM_EPISODES.bPostMessage) {
        window.postMessage("PRUM_EPISODES:measure:" + c + ":" + a + ":" + d, PRUM_EPISODES.targetOrigin)
    }
};
PRUM_EPISODES.done = function(a) {
    PRUM_EPISODES.bDone = true;
    PRUM_EPISODES.mark("done");
    if (PRUM_EPISODES.autorun) {
        PRUM_EPISODES.sendBeacon()
    }
    if (PRUM_EPISODES.bPostMessage) {
        window.postMessage("PRUM_EPISODES:done", PRUM_EPISODES.targetOrigin)
    }
    if ("function" === typeof(a)) {
        a()
    }
};
PRUM_EPISODES.getMarks = function() {
    return PRUM_EPISODES.marks
};
PRUM_EPISODES.getMeasures = function() {
    return PRUM_EPISODES.measures
};
PRUM_EPISODES.getStarts = function() {
    return PRUM_EPISODES.starts
};
PRUM_EPISODES.findStartTime = function() {
    var a = PRUM_EPISODES.findStartWebTiming() || PRUM_EPISODES.findStartGToolbar() || PRUM_EPISODES.findStartCookie();
    if (a) {
        PRUM_EPISODES.mark("starttime", a)
    }
};
PRUM_EPISODES.findStartWebTiming = function() {
    var a = undefined;
    var b = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
    if ("undefined" != typeof(b) && "undefined" != typeof(b.timing) && "undefined" != typeof(b.timing.navigationStart)) {
        a = b.timing.navigationStart;
        PRUM_EPISODES.dprint("PRUM_EPISODES.findStartWebTiming: startTime = " + a)
    }
    return a
};
PRUM_EPISODES.findStartGToolbar = function() {
    var a = undefined;
    if (window.external && window.external.pageT) {
        a = (new Date().getTime()) - window.external.pageT
    } else {
        if (window.gtbExternal && window.gtbExternal.pageT) {
            a = (new Date().getTime()) - window.gtbExternal.pageT()
        } else {
            if (window.chrome && window.chrome.csi) {
                a = (new Date().getTime()) - window.chrome.csi().pageT
            }
        }
    }
    if (a) {
        PRUM_EPISODES.dprint("PRUM_EPISODES.findStartGToolbar: startTime = " + a)
    }
    return a
};
PRUM_EPISODES.findStartCookie = function() {
    var g = document.cookie.split("; ");
    for (var d = 0; d < g.length; d++) {
        if (0 === g[d].indexOf("PRUM_EPISODES=")) {
            var a = g[d].substring("PRUM_EPISODES=".length).split("&");
            var e, f;
            for (var b = 0; b < a.length; b++) {
                if (0 === a[b].indexOf("s=")) {
                    e = a[b].substring(2)
                } else {
                    if (0 === a[b].indexOf("r=")) {
                        var c = a[b].substring(2);
                        f = (escape(document.referrer) == c)
                    }
                }
            }
            if (f && e) {
                PRUM_EPISODES.dprint("PRUM_EPISODES.findStartCookie: startTime = " + e);
                return e
            }
        }
    }
    return undefined
};
PRUM_EPISODES.beforeUnload = function(a) {
    if (PRUM_EPISODES.bUnloaded) {
        return
    }
    document.cookie = "PRUM_EPISODES=s=" + Number(new Date()) + "&r=" + escape(document.location) + "; path=/";
    PRUM_EPISODES.bUnloaded = true
};
PRUM_EPISODES.onload = function(a) {
    PRUM_EPISODES.mark("onload");
    PRUM_EPISODES.done()
};
PRUM_EPISODES.addEventListener = function(c, b, a) {
    if ("undefined" != typeof(window.attachEvent)) {
        return window.attachEvent("on" + c, b)
    } else {
        if (window.addEventListener) {
            return window.addEventListener(c, b, a)
        }
    }
};
PRUM_EPISODES.addOnLoadListener = function(d) {
    var a = document.readyState;
    if (a === "complete") {
        setTimeout(d, 0)
    } else {
        if (typeof a === "undefined") {
            var c = function() {
                var e = document.getElementsByTagName("*");
                return e[e.length - 1]
            };
            var b = c();
            setTimeout(function() {
                if (c() === b && typeof document.readyState === "undefined") {
                    d()
                }
            }, 500)
        } else {
            PRUM_EPISODES.addEventListener("load", d, false)
        }
    }
};
PRUM_EPISODES.dprint = function(a) {};
PRUM_EPISODES.init();
_prum || (_prum = []);
(function() {
    var a = "//rum-collector.pingdom.net/img/beacon.gif",
        h = null,
        i = "",
        l = [];
    var k = {
        navigationStart: "nS",
        unloadEventStart: "uES",
        unloadEventEnd: "uEE",
        redirectStart: "rS",
        redirectEnd: "rE",
        fetchStart: "fS",
        domainLookupStart: "dLS",
        domainLookupEnd: "dLE",
        connectStart: "cS",
        connectEnd: "cE",
        handshakeStart: "hS",
        requestStart: "reS",
        responseStart: "resS",
        responseEnd: "resE",
        domLoading: "dL",
        domInteractive: "dI",
        domContentLoadedEventStart: "dCLES",
        domContentLoadedEventEnd: "dCLEE",
        domComplete: "dC",
        loadEventStart: "lES",
        loadEventEnd: "lEE"
    };
    var c = {
        id: function(m) {
            i = m
        },
        tag: function(m) {
            l.push(m)
        },
        tags: function(m) {
            l = l.concat(m)
        },
        mark: function(m, n) {
            if (n instanceof Date) {
                n = n.getTime()
            }
            if (PRUM_EPISODES && PRUM_EPISODES.mark) {
                PRUM_EPISODES.mark(m, n)
            }
        }
    };

    function d(m) {
        return Object.prototype.toString.call(m) === "[object Array]"
    }

    function g(p) {
        if (typeof p === "string") {
            return p
        }
        var o = "";
        for (var m in p) {
            var n = d(p[m]) ? p[m].join(" ") : p[m];
            o += o.length ? "&" : "?";
            o += encodeURIComponent(m);
            o += "=";
            o += encodeURIComponent(n)
        }
        return o
    }

    function f(m, o) {
        var n = new Image();
        if (l.length) {
            o.tags = l
        }
        n.src = m + g(o)
    }

    function e() {
        var p = window.performance.timing;
        var q = window.performance.navigation;
        if (p.loadEventEnd === 0) {
            return false
        }
        clearInterval(h);
        h = null;
        var m = {
            path: window.location.protocol + "//" + window.location.host + window.location.pathname,
            title: document.title,
            id: i,
            s: "nt",
            rC: q.redirectCount
        };
        for (var o in k) {
            m[k[o]] = -1;
            if (!(o in p)) {
                continue
            }
            if (p[o] <= 0) {
                continue
            }
            m[k[o]] = (p[o] - p.navigationStart)
        }
        f(a, m)
    }

    function b() {
        if (!PRUM_EPISODES || !PRUM_EPISODES.bDone) {
            return false
        }
        clearInterval(h);
        h = false;
        var o = PRUM_EPISODES.getMeasures();
        if (o != null && o.backend != null && o.frontend != null && o["page load time"] != null && o["total load time"] != null) {
            var m = o.backend;
            var p = o.backend + o.frontend;
            var n = {
                path: window.location.href,
                id: i,
                s: "ep",
                uES: -1,
                uEE: -1,
                rS: -1,
                rE: -1,
                rC: 0,
                fS: 0,
                dLS: 0,
                dLE: 0,
                cS: 0,
                cE: 0,
                hS: 0,
                reS: 0,
                resS: m,
                resE: m,
                dL: m,
                dI: m,
                dCLES: m,
                dCLEE: p,
                dC: p,
                lES: o["page load time"],
                lEE: o["total load time"]
            };
            f(a, n)
        }
    }

    function j() {
        if (!d(_prum)) {
            var m = [
                ["id", _prum.id]
            ];
            if (_prum.tags) {
                m.push(["tags", _prum.tags])
            }
            _prum = m
        }
        _prum.push = function(n) {
            var o = n.shift();
            if (c[o]) {
                c[o].apply(this, n)
            }
        };
        while (_prum.length) {
            _prum.push(_prum.shift())
        }
    }
    if (window.performance != null && window.performance.timing != null && window.performance.navigation != null) {
        h = setInterval(e, 100)
    } else {
        h = setInterval(b, 100)
    }
    j()
})();
