var krpanoJS = {
    version: "1.19-pr5",
    build: "2016-06-08"
};

define("krpano", function() {}), ! function(e, t, n) {
    function i(e, t) {
        return typeof e === t
    }

    function o() {
        var e, t, n, o, r, s, a;
        for (var l in b) {
            if (e = [], t = b[l], t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
                for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase());
            for (o = i(t.fn, "function") ? t.fn() : t.fn, r = 0; r < e.length; r++) s = e[r], a = s.split("."), 1 === a.length ? $[a[0]] = o : (!$[a[0]] || $[a[0]] instanceof Boolean || ($[a[0]] = new Boolean($[a[0]])), $[a[0]][a[1]] = o), C.push((o ? "" : "no-") + a.join("-"))
        }
    }

    function r(e) {
        var t = T.className,
            n = $._config.classPrefix || "";
        if ($._config.enableJSClass) {
            var i = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
            t = t.replace(i, "$1" + n + "js$2")
        }
        $._config.enableClasses && (t += " " + n + e.join(" " + n), T.className = t)
    }

    function s(e, t) {
        if ("object" == typeof e)
            for (var n in e) k(e, n) && s(n, e[n]);
        else {
            e = e.toLowerCase();
            var i = e.split("."),
                o = $[i[0]];
            if (2 == i.length && (o = o[i[1]]), "undefined" != typeof o) return $;
            t = "function" == typeof t ? t() : t, 1 == i.length ? $[i[0]] = t : (!$[i[0]] || $[i[0]] instanceof Boolean || ($[i[0]] = new Boolean($[i[0]])), $[i[0]][i[1]] = t), r([(t && 0 != t ? "" : "no-") + i.join("-")]), $._trigger(e, t)
        }
        return $
    }

    function a(e) {
        return e.replace(/([A-Z])/g, function(e, t) {
            return "-" + t.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }

    function l(e) {
        return e.replace(/([a-z])-([a-z])/g, function(e, t, n) {
            return t + n.toUpperCase()
        }).replace(/^-/, "")
    }

    function u() {
        var e = t.body;
        return e || (e = x("body"), e.fake = !0), e
    }

    function c(e, t, n, i) {
        var o, r, s, a, l = "modernizr",
            c = x("div"),
            d = u();
        if (parseInt(n, 10))
            for (; n--;) s = x("div"), s.id = i ? i[n] : l + (n + 1), c.appendChild(s);
        return o = ["&#173;", '<style id="s', l, '">', e, "</style>"].join(""), c.id = l, (d.fake ? d : c).innerHTML += o, d.appendChild(c), d.fake && (d.style.background = "", d.style.overflow = "hidden", a = T.style.overflow, T.style.overflow = "hidden", T.appendChild(d)), r = t(c, e), d.fake ? (d.parentNode.removeChild(d), T.style.overflow = a, T.offsetHeight) : c.parentNode.removeChild(c), !!r
    }

    function d(e, t) {
        return !!~("" + e).indexOf(t)
    }

    function p(t, i) {
        var o = t.length;
        if ("CSS" in e && "supports" in e.CSS) {
            for (; o--;)
                if (e.CSS.supports(a(t[o]), i)) return !0;
            return !1
        }
        if ("CSSSupportsRule" in e) {
            for (var r = []; o--;) r.push("(" + a(t[o]) + ":" + i + ")");
            return r = r.join(" or "), c("@supports (" + r + ") { #modernizr { position: absolute; } }", function(e) {
                return "absolute" == getComputedStyle(e, null).position
            })
        }
        return n
    }

    function f(e, t, o, r) {
        function s() {
            u && (delete M.style, delete M.modElem)
        }
        if (r = i(r, "undefined") ? !1 : r, !i(o, "undefined")) {
            var a = p(e, o);
            if (!i(a, "undefined")) return a
        }
        var u, c, f, h, m;
        for (M.style || (u = !0, M.modElem = x("modernizr"), M.style = M.modElem.style), f = e.length, c = 0; f > c; c++)
            if (h = e[c], m = M.style[h], d(h, "-") && (h = l(h)), M.style[h] !== n) {
                if (r || i(o, "undefined")) return s(), "pfx" == t ? h : !0;
                try {
                    M.style[h] = o
                } catch (v) {}
                if (M.style[h] != m) return s(), "pfx" == t ? h : !0
            }
        return s(), !1
    }

    function h(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }

    function m(e, t, n) {
        var o;
        for (var r in e)
            if (e[r] in t) return n === !1 ? e[r] : (o = t[e[r]], i(o, "function") ? h(o, n || t) : o);
        return !1
    }

    function v(e, t, n, o, r) {
        var s = e.charAt(0).toUpperCase() + e.slice(1),
            a = (e + " " + j.join(s + " ") + s).split(" ");
        return i(t, "string") || i(t, "undefined") ? f(a, t, o, r) : (a = (e + " " + S.join(s + " ") + s).split(" "), m(a, t, n))
    }

    function g(e, t, i) {
        return v(e, n, n, t, i)
    }
    var C = [],
        b = [],
        w = {
            _version: "3.0.0-alpha.3",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function(e, t) {
                var n = this;
                setTimeout(function() {
                    t(n[e])
                }, 0)
            },
            addTest: function(e, t, n) {
                b.push({
                    name: e,
                    fn: t,
                    options: n
                })
            },
            addAsyncTest: function(e) {
                b.push({
                    name: null,
                    fn: e
                })
            }
        },
        $ = function() {};
    $.prototype = w, $ = new $;
    var y = w._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
    w._prefixes = y;
    var k;
    ! function() {
        var e = {}.hasOwnProperty;
        k = i(e, "undefined") || i(e.call, "undefined") ? function(e, t) {
            return t in e && i(e.constructor.prototype[t], "undefined")
        } : function(t, n) {
            return e.call(t, n)
        }
    }();
    var T = t.documentElement;
    w._l = {}, w.on = function(e, t) {
        this._l[e] || (this._l[e] = []), this._l[e].push(t), $.hasOwnProperty(e) && setTimeout(function() {
            $._trigger(e, $[e])
        }, 0)
    }, w._trigger = function(e, t) {
        if (this._l[e]) {
            var n = this._l[e];
            setTimeout(function() {
                var e, i;
                for (e = 0; e < n.length; e++)(i = n[e])(t)
            }, 0), delete this._l[e]
        }
    }, $._q.push(function() {
        w.addTest = s
    });
    var B = "Moz O ms Webkit",
        S = w._config.usePrefixes ? B.toLowerCase().split(" ") : [];
    w._domPrefixes = S;
    var x = function() {
        return "function" != typeof t.createElement ? t.createElement(arguments[0]) : t.createElement.apply(t, arguments)
    };
    $.addTest("webgl", function() {
        var t = x("canvas"),
            n = "probablySupportsContext" in t ? "probablySupportsContext" : "supportsContext";
        return n in t ? t[n]("webgl") || t[n]("experimental-webgl") : "WebGLRenderingContext" in e
    }), $.addAsyncTest(function() {
        if ($.webglextensions = new Boolean(!1), $.webgl) {
            var e, t, i;
            try {
                e = x("canvas"), t = e.getContext("webgl") || e.getContext("experimental-webgl"), i = t.getSupportedExtensions()
            } catch (o) {
                return
            }
            t !== n && ($.webglextensions = new Boolean(!0));
            for (var r = -1, s = i.length; ++r < s;) $.webglextensions[i[r]] = !0;
            e = n
        }
    });
    var E = function(e) {
        function n(t, n) {
            var o;
            return t ? (n && "string" != typeof n || (n = x(n || "div")), t = "on" + t, o = t in n, !o && i && (n.setAttribute || (n = x("div")), n.setAttribute(t, ""), o = "function" == typeof n[t], n[t] !== e && (n[t] = e), n.removeAttribute(t)), o) : !1
        }
        var i = !("onblur" in t.documentElement);
        return n
    }();
    w.hasEvent = E, $.addAsyncTest(function() {
        var n, i, o = function(e) {
                e.fake && e.parentNode && e.parentNode.removeChild(e)
            },
            r = function(e, t) {
                var n = !!e;
                n && (n = new Boolean(n), n.blocked = "blocked" === e), s("flash", function() {
                    return n
                }), t && p.contains(t) && p.removeChild(t)
            };
        try {
            i = "ActiveXObject" in e && "Pan" in new e.ActiveXObject("ShockwaveFlash.ShockwaveFlash")
        } catch (a) {}
        if (n = !("plugins" in navigator && "Shockwave Flash" in navigator.plugins || i)) r(!1);
        else {
            var l, c, d = x("embed"),
                p = u();
            if (d.type = "application/x-shockwave-flash", p.appendChild(d), T.appendChild(p), !("Pan" in d || i)) return r("blocked", d), void o(p);
            l = function() {
                return T.contains(p) ? (T.contains(d) ? (c = d.style.cssText, "" !== c ? r("blocked", d) : r(!0, d)) : r("blocked"), void o(p)) : (p = t.body || p, d = t.createElement("embed"), d.type = "application/x-shockwave-flash", p.appendChild(d), setTimeout(l, 1e3))
            }, setTimeout(l, 10)
        }
    });
    var F = (w.testStyles = c, function() {
            var t = e.matchMedia || e.msMatchMedia;
            return t ? function(e) {
                var n = t(e);
                return n && n.matches || !1
            } : function(t) {
                var n = !1;
                return c("@media " + t + " { #modernizr { position: absolute; } }", function(t) {
                    n = "absolute" == (e.getComputedStyle ? e.getComputedStyle(t, null) : t.currentStyle).position
                }), n
            }
        }()),
        j = (w.mq = F, w._config.usePrefixes ? B.split(" ") : []);
    w._cssomPrefixes = j;
    var D = function(t) {
            var i, o = y.length,
                r = e.CSSRule;
            if ("undefined" == typeof r) return n;
            if (!t) return !1;
            if (t = t.replace(/^@/, ""), i = t.replace(/-/g, "_").toUpperCase() + "_RULE", i in r) return "@" + t;
            for (var s = 0; o > s; s++) {
                var a = y[s],
                    l = a.toUpperCase() + "_" + i;
                if (l in r) return "@-" + a.toLowerCase() + "-" + t
            }
            return !1
        },
        A = {
            elem: x("modernizr")
        };
    $._q.push(function() {
        delete A.elem
    });
    var M = {
        style: A.elem.style
    };
    $._q.unshift(function() {
        delete M.style
    }), w.testProp = function(e, t, i) {
        return f([e], n, t, i)
    }, w.testAllProps = v, w.testAllProps = g;
    var _ = w.prefixed = function(e, t, n) {
        return 0 === e.indexOf("@") ? D(e) : (-1 != e.indexOf("-") && (e = l(e)), t ? v(e, t, n) : v(e, "pfx"))
    };
    w.prefixedCSS = function(e) {
        var t = _(e);
        return t && a(t)
    }, o(), r(C), delete w.addTest, delete w.addAsyncTest;
    for (var P = 0; P < $._q.length; P++) $._q[P]();
    e.Modernizr = $
}(window, document); 