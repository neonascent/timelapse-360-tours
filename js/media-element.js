var mejs = mejs || {};
mejs.version = "2.17.0", mejs.meIndex = 0, mejs.plugins = {
        silverlight: [{
            version: [3, 0],
            types: ["video/mp4", "video/m4v", "video/mov", "video/wmv", "audio/wma", "audio/m4a", "audio/mp3", "audio/wav", "audio/mpeg"]
        }],
        flash: [{
            version: [9, 0, 124],
            types: ["video/mp4", "video/m4v", "video/mov", "video/flv", "video/rtmp", "video/x-flv", "audio/flv", "audio/x-flv", "audio/mp3", "audio/m4a", "audio/mpeg", "video/youtube", "video/x-youtube", "video/dailymotion", "video/x-dailymotion", "application/x-mpegURL"]
        }],
        youtube: [{
            version: null,
            types: ["video/youtube", "video/x-youtube", "audio/youtube", "audio/x-youtube"]
        }],
        vimeo: [{
            version: null,
            types: ["video/vimeo", "video/x-vimeo"]
        }]
    }, mejs.Utility = {
        encodeUrl: function(e) {
            return encodeURIComponent(e)
        },
        escapeHTML: function(e) {
            return e.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")
        },
        absolutizeUrl: function(e) {
            var t = document.createElement("div");
            return t.innerHTML = '<a href="' + this.escapeHTML(e) + '">x</a>', t.firstChild.href
        },
        getScriptPath: function(e) {
            for (var t, n, i, o, r, s, a = 0, l = "", u = "", c = document.getElementsByTagName("script"), d = c.length, p = e.length; d > a; a++) {
                for (o = c[a].src, n = o.lastIndexOf("/"), n > -1 ? (s = o.substring(n + 1), r = o.substring(0, n + 1)) : (s = o, r = ""), t = 0; p > t; t++)
                    if (u = e[t], i = s.indexOf(u), i > -1) {
                        l = r;
                        break
                    }
                if ("" !== l) break
            }
            return l
        },
        secondsToTimeCode: function(e, t, n, i) {
            "undefined" == typeof n ? n = !1 : "undefined" == typeof i && (i = 25);
            var o = Math.floor(e / 3600) % 24,
                r = Math.floor(e / 60) % 60,
                s = Math.floor(e % 60),
                a = Math.floor((e % 1 * i).toFixed(3)),
                l = (t || o > 0 ? (10 > o ? "0" + o : o) + ":" : "") + (10 > r ? "0" + r : r) + ":" + (10 > s ? "0" + s : s) + (n ? ":" + (10 > a ? "0" + a : a) : "");
            return l
        },
        timeCodeToSeconds: function(e, t, n, i) {
            "undefined" == typeof n ? n = !1 : "undefined" == typeof i && (i = 25);
            var o = e.split(":"),
                r = parseInt(o[0], 10),
                s = parseInt(o[1], 10),
                a = parseInt(o[2], 10),
                l = 0,
                u = 0;
            return n && (l = parseInt(o[3]) / i), u = 3600 * r + 60 * s + a + l
        },
        convertSMPTEtoSeconds: function(e) {
            if ("string" != typeof e) return !1;
            e = e.replace(",", ".");
            var t = 0,
                n = -1 != e.indexOf(".") ? e.split(".")[1].length : 0,
                i = 1;
            e = e.split(":").reverse();
            for (var o = 0; o < e.length; o++) i = 1, o > 0 && (i = Math.pow(60, o)), t += Number(e[o]) * i;
            return Number(t.toFixed(n))
        },
        removeSwf: function(e) {
            var t = document.getElementById(e);
            t && /object|embed/i.test(t.nodeName) && (mejs.MediaFeatures.isIE ? (t.style.display = "none", function() {
                4 == t.readyState ? mejs.Utility.removeObjectInIE(e) : setTimeout(arguments.callee, 10)
            }()) : t.parentNode.removeChild(t))
        },
        removeObjectInIE: function(e) {
            var t = document.getElementById(e);
            if (t) {
                for (var n in t) "function" == typeof t[n] && (t[n] = null);
                t.parentNode.removeChild(t)
            }
        }
    }, mejs.PluginDetector = {
        hasPluginVersion: function(e, t) {
            var n = this.plugins[e];
            return t[1] = t[1] || 0, t[2] = t[2] || 0, n[0] > t[0] || n[0] == t[0] && n[1] > t[1] || n[0] == t[0] && n[1] == t[1] && n[2] >= t[2] ? !0 : !1
        },
        nav: window.navigator,
        ua: window.navigator.userAgent.toLowerCase(),
        plugins: [],
        addPlugin: function(e, t, n, i, o) {
            this.plugins[e] = this.detectPlugin(t, n, i, o)
        },
        detectPlugin: function(e, t, n, i) {
            var o, r, s, a = [0, 0, 0];
            if ("undefined" != typeof this.nav.plugins && "object" == typeof this.nav.plugins[e]) {
                if (o = this.nav.plugins[e].description, o && ("undefined" == typeof this.nav.mimeTypes || !this.nav.mimeTypes[t] || this.nav.mimeTypes[t].enabledPlugin))
                    for (a = o.replace(e, "").replace(/^\s+/, "").replace(/\sr/gi, ".").split("."), r = 0; r < a.length; r++) a[r] = parseInt(a[r].match(/\d+/), 10)
            } else if ("undefined" != typeof window.ActiveXObject) try {
                s = new ActiveXObject(n), s && (a = i(s))
            } catch (l) {}
            return a
        }
    }, mejs.PluginDetector.addPlugin("flash", "Shockwave Flash", "application/x-shockwave-flash", "ShockwaveFlash.ShockwaveFlash", function(e) {
        var t = [],
            n = e.GetVariable("$version");
        return n && (n = n.split(" ")[1].split(","), t = [parseInt(n[0], 10), parseInt(n[1], 10), parseInt(n[2], 10)]), t
    }), mejs.PluginDetector.addPlugin("silverlight", "Silverlight Plug-In", "application/x-silverlight-2", "AgControl.AgControl", function(e) {
        var t = [0, 0, 0, 0],
            n = function(e, t, n, i) {
                for (; e.isVersionSupported(t[0] + "." + t[1] + "." + t[2] + "." + t[3]);) t[n] += i;
                t[n] -= i
            };
        return n(e, t, 0, 1), n(e, t, 1, 1), n(e, t, 2, 1e4), n(e, t, 2, 1e3), n(e, t, 2, 100), n(e, t, 2, 10), n(e, t, 2, 1), n(e, t, 3, 1), t
    }), mejs.MediaFeatures = {
        init: function() {
            var e, t, n = this,
                i = document,
                o = mejs.PluginDetector.nav,
                r = mejs.PluginDetector.ua.toLowerCase(),
                s = ["source", "track", "audio", "video"];
            n.isiPad = null !== r.match(/ipad/i), n.isiPhone = null !== r.match(/iphone/i), n.isiOS = n.isiPhone || n.isiPad, n.isAndroid = null !== r.match(/android/i), n.isBustedAndroid = null !== r.match(/android 2\.[12]/), n.isBustedNativeHTTPS = "https:" === location.protocol && (null !== r.match(/android [12]\./) || null !== r.match(/macintosh.* version.* safari/)), n.isIE = -1 != o.appName.toLowerCase().indexOf("microsoft") || null !== o.appName.toLowerCase().match(/trident/gi), n.isChrome = null !== r.match(/chrome/gi), n.isChromium = null !== r.match(/chromium/gi), n.isFirefox = null !== r.match(/firefox/gi), n.isWebkit = null !== r.match(/webkit/gi), n.isGecko = null !== r.match(/gecko/gi) && !n.isWebkit && !n.isIE, n.isOpera = null !== r.match(/opera/gi), n.hasTouch = "ontouchstart" in window, n.svg = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
            for (e = 0; e < s.length; e++) t = document.createElement(s[e]);
            n.supportsMediaTag = "undefined" != typeof t.canPlayType || n.isBustedAndroid;
            try {
                t.canPlayType("video/mp4")
            } catch (a) {
                n.supportsMediaTag = !1
            }
            n.hasSemiNativeFullScreen = "undefined" != typeof t.webkitEnterFullscreen, n.hasNativeFullscreen = "undefined" != typeof t.requestFullscreen, n.hasWebkitNativeFullScreen = "undefined" != typeof t.webkitRequestFullScreen, n.hasMozNativeFullScreen = "undefined" != typeof t.mozRequestFullScreen, n.hasMsNativeFullScreen = "undefined" != typeof t.msRequestFullscreen, n.hasTrueNativeFullScreen = n.hasWebkitNativeFullScreen || n.hasMozNativeFullScreen || n.hasMsNativeFullScreen, n.nativeFullScreenEnabled = n.hasTrueNativeFullScreen, n.hasMozNativeFullScreen ? n.nativeFullScreenEnabled = document.mozFullScreenEnabled : n.hasMsNativeFullScreen && (n.nativeFullScreenEnabled = document.msFullscreenEnabled), n.isChrome && (n.hasSemiNativeFullScreen = !1), n.hasTrueNativeFullScreen && (n.fullScreenEventName = "", n.hasWebkitNativeFullScreen ? n.fullScreenEventName = "webkitfullscreenchange" : n.hasMozNativeFullScreen ? n.fullScreenEventName = "mozfullscreenchange" : n.hasMsNativeFullScreen && (n.fullScreenEventName = "MSFullscreenChange"), n.isFullScreen = function() {
                return n.hasMozNativeFullScreen ? i.mozFullScreen : n.hasWebkitNativeFullScreen ? i.webkitIsFullScreen : n.hasMsNativeFullScreen ? null !== i.msFullscreenElement : void 0
            }, n.requestFullScreen = function(e) {
                n.hasWebkitNativeFullScreen ? e.webkitRequestFullScreen() : n.hasMozNativeFullScreen ? e.mozRequestFullScreen() : n.hasMsNativeFullScreen && e.msRequestFullscreen()
            }, n.cancelFullScreen = function() {
                n.hasWebkitNativeFullScreen ? document.webkitCancelFullScreen() : n.hasMozNativeFullScreen ? document.mozCancelFullScreen() : n.hasMsNativeFullScreen && document.msExitFullscreen()
            }), n.hasSemiNativeFullScreen && r.match(/mac os x 10_5/i) && (n.hasNativeFullScreen = !1, n.hasSemiNativeFullScreen = !1)
        }
    }, mejs.MediaFeatures.init(), mejs.HtmlMediaElement = {
        pluginType: "native",
        isFullScreen: !1,
        setCurrentTime: function(e) {
            this.currentTime = e
        },
        setMuted: function(e) {
            this.muted = e
        },
        setVolume: function(e) {
            this.volume = e
        },
        stop: function() {
            this.pause()
        },
        setSrc: function(e) {
            for (var t = this.getElementsByTagName("source"); t.length > 0;) this.removeChild(t[0]);
            if ("string" == typeof e) this.src = e;
            else {
                var n, i;
                for (n = 0; n < e.length; n++)
                    if (i = e[n], this.canPlayType(i.type)) {
                        this.src = i.src;
                        break
                    }
            }
        },
        setVideoSize: function(e, t) {
            this.width = e, this.height = t
        }
    }, mejs.PluginMediaElement = function(e, t, n) {
        this.id = e, this.pluginType = t, this.src = n, this.events = {}, this.attributes = {}
    }, mejs.PluginMediaElement.prototype = {
        pluginElement: null,
        pluginType: "",
        isFullScreen: !1,
        playbackRate: -1,
        defaultPlaybackRate: -1,
        seekable: [],
        played: [],
        paused: !0,
        ended: !1,
        seeking: !1,
        duration: 0,
        error: null,
        tagName: "",
        muted: !1,
        volume: 1,
        currentTime: 0,
        play: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.playVideo() : this.pluginApi.playMedia(), this.paused = !1)
        },
        load: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType || this.pluginApi.loadMedia(), this.paused = !1)
        },
        pause: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.pauseVideo() : this.pluginApi.pauseMedia(), this.paused = !0)
        },
        stop: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.stopVideo() : this.pluginApi.stopMedia(), this.paused = !0)
        },
        canPlayType: function(e) {
            var t, n, i, o = mejs.plugins[this.pluginType];
            for (t = 0; t < o.length; t++)
                if (i = o[t], mejs.PluginDetector.hasPluginVersion(this.pluginType, i.version))
                    for (n = 0; n < i.types.length; n++)
                        if (e == i.types[n]) return "probably";
            return ""
        },
        positionFullscreenButton: function(e, t, n) {
            null != this.pluginApi && this.pluginApi.positionFullscreenButton && this.pluginApi.positionFullscreenButton(Math.floor(e), Math.floor(t), n)
        },
        hideFullscreenButton: function() {
            null != this.pluginApi && this.pluginApi.hideFullscreenButton && this.pluginApi.hideFullscreenButton()
        },
        setSrc: function(e) {
            if ("string" == typeof e) this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(e)), this.src = mejs.Utility.absolutizeUrl(e);
            else {
                var t, n;
                for (t = 0; t < e.length; t++)
                    if (n = e[t], this.canPlayType(n.type)) {
                        this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(n.src)), this.src = mejs.Utility.absolutizeUrl(e);
                        break
                    }
            }
        },
        setCurrentTime: function(e) {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.seekTo(e) : this.pluginApi.setCurrentTime(e), this.currentTime = e)
        },
        setVolume: function(e) {
            null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.setVolume(100 * e) : this.pluginApi.setVolume(e), this.volume = e)
        },
        setMuted: function(e) {
            null != this.pluginApi && ("youtube" == this.pluginType ? (e ? this.pluginApi.mute() : this.pluginApi.unMute(), this.muted = e, this.dispatchEvent("volumechange")) : this.pluginApi.setMuted(e), this.muted = e)
        },
        setVideoSize: function(e, t) {
            this.pluginElement && this.pluginElement.style && (this.pluginElement.style.width = e + "px", this.pluginElement.style.height = t + "px"), null != this.pluginApi && this.pluginApi.setVideoSize && this.pluginApi.setVideoSize(e, t)
        },
        setFullscreen: function(e) {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.pluginApi.setFullscreen(e)
        },
        enterFullScreen: function() {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!0)
        },
        exitFullScreen: function() {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!1)
        },
        addEventListener: function(e, t, n) {
            this.events[e] = this.events[e] || [], this.events[e].push(t)
        },
        removeEventListener: function(e, t) {
            if (!e) return this.events = {}, !0;
            var n = this.events[e];
            if (!n) return !0;
            if (!t) return this.events[e] = [], !0;
            for (var i = 0; i < n.length; i++)
                if (n[i] === t) return this.events[e].splice(i, 1), !0;
            return !1
        },
        dispatchEvent: function(e) {
            var t, n, i = this.events[e];
            if (i)
                for (n = Array.prototype.slice.call(arguments, 1), t = 0; t < i.length; t++) i[t].apply(this, n)
        },
        hasAttribute: function(e) {
            return e in this.attributes
        },
        removeAttribute: function(e) {
            delete this.attributes[e]
        },
        getAttribute: function(e) {
            return this.hasAttribute(e) ? this.attributes[e] : ""
        },
        setAttribute: function(e, t) {
            this.attributes[e] = t
        },
        remove: function() {
            mejs.Utility.removeSwf(this.pluginElement.id), mejs.MediaPluginBridge.unregisterPluginElement(this.pluginElement.id)
        }
    }, mejs.MediaPluginBridge = {
        pluginMediaElements: {},
        htmlMediaElements: {},
        registerPluginElement: function(e, t, n) {
            this.pluginMediaElements[e] = t, this.htmlMediaElements[e] = n
        },
        unregisterPluginElement: function(e) {
            delete this.pluginMediaElements[e], delete this.htmlMediaElements[e]
        },
        initPlugin: function(e) {
            var t = this.pluginMediaElements[e],
                n = this.htmlMediaElements[e];
            if (t) {
                switch (t.pluginType) {
                    case "flash":
                        t.pluginElement = t.pluginApi = document.getElementById(e);
                        break;
                    case "silverlight":
                        t.pluginElement = document.getElementById(t.id), t.pluginApi = t.pluginElement.Content.MediaElementJS
                }
                null != t.pluginApi && t.success && t.success(t, n)
            }
        },
        fireEvent: function(e, t, n) {
            var i, o, r, s = this.pluginMediaElements[e];
            if (s) {
                i = {
                    type: t,
                    target: s
                };
                for (o in n) s[o] = n[o], i[o] = n[o];
                r = n.bufferedTime || 0, i.target.buffered = i.buffered = {
                    start: function(e) {
                        return 0
                    },
                    end: function(e) {
                        return r
                    },
                    length: 1
                }, s.dispatchEvent(i.type, i)
            }
        }
    }, mejs.MediaElementDefaults = {
        mode: "auto",
        plugins: ["flash", "silverlight", "youtube", "vimeo"],
        enablePluginDebug: !1,
        httpsBasicAuthSite: !1,
        type: "",
        pluginPath: mejs.Utility.getScriptPath(["mediaelement.js", "mediaelement.min.html", "mediaelement-and-player.html", "mediaelement-and-player.min.js"]),
        flashName: "flashmediaelement.swf",
        flashStreamer: "",
        enablePluginSmoothing: !1,
        enablePseudoStreaming: !1,
        pseudoStreamingStartQueryParam: "start",
        silverlightName: "silverlightmediaelement.xap",
        defaultVideoWidth: 480,
        defaultVideoHeight: 270,
        pluginWidth: -1,
        pluginHeight: -1,
        pluginVars: [],
        timerRate: 250,
        startVolume: .8,
        success: function() {},
        error: function() {}
    }, mejs.MediaElement = function(e, t) {
        return mejs.HtmlMediaElementShim.create(e, t)
    }, mejs.HtmlMediaElementShim = {
        create: function(e, t) {
            var n, i, o = mejs.MediaElementDefaults,
                r = "string" == typeof e ? document.getElementById(e) : e,
                s = r.tagName.toLowerCase(),
                a = "audio" === s || "video" === s,
                l = a ? r.getAttribute("src") : r.getAttribute("href"),
                u = r.getAttribute("poster"),
                c = r.getAttribute("autoplay"),
                d = r.getAttribute("preload"),
                p = r.getAttribute("controls");
            for (i in t) o[i] = t[i];
            return l = "undefined" == typeof l || null === l || "" == l ? null : l, u = "undefined" == typeof u || null === u ? "" : u, d = "undefined" == typeof d || null === d || "false" === d ? "none" : d, c = !("undefined" == typeof c || null === c || "false" === c), p = !("undefined" == typeof p || null === p || "false" === p), n = this.determinePlayback(r, o, mejs.MediaFeatures.supportsMediaTag, a, l), n.url = null !== n.url ? mejs.Utility.absolutizeUrl(n.url) : "", "native" == n.method ? (mejs.MediaFeatures.isBustedAndroid && (r.src = n.url, r.addEventListener("click", function() {
                r.play()
            }, !1)), this.updateNative(n, o, c, d)) : "" !== n.method ? this.createPlugin(n, o, u, c, d, p) : (this.createErrorMessage(n, o, u), this)
        },
        determinePlayback: function(e, t, n, i, o) {
            var r, s, a, l, u, c, d, p, f, h, m, v = [],
                g = {
                    method: "",
                    url: "",
                    htmlMediaElement: e,
                    isVideo: "audio" != e.tagName.toLowerCase()
                };
            if ("undefined" != typeof t.type && "" !== t.type)
                if ("string" == typeof t.type) v.push({
                    type: t.type,
                    url: o
                });
                else
                    for (r = 0; r < t.type.length; r++) v.push({
                        type: t.type[r],
                        url: o
                    });
            else if (null !== o) c = this.formatType(o, e.getAttribute("type")), v.push({
                type: c,
                url: o
            });
            else
                for (r = 0; r < e.childNodes.length; r++) u = e.childNodes[r], 1 == u.nodeType && "source" == u.tagName.toLowerCase() && (o = u.getAttribute("src"), c = this.formatType(o, u.getAttribute("type")), m = u.getAttribute("media"), (!m || !window.matchMedia || window.matchMedia && window.matchMedia(m).matches) && v.push({
                    type: c,
                    url: o
                }));
            if (!i && v.length > 0 && null !== v[0].url && this.getTypeFromFile(v[0].url).indexOf("audio") > -1 && (g.isVideo = !1), mejs.MediaFeatures.isBustedAndroid && (e.canPlayType = function(e) {
                    return null !== e.match(/video\/(mp4|m4v)/gi) ? "maybe" : ""
                }), mejs.MediaFeatures.isChromium && (e.canPlayType = function(e) {
                    return null !== e.match(/video\/(webm|ogv|ogg)/gi) ? "maybe" : ""
                }), n && ("auto" === t.mode || "auto_plugin" === t.mode || "native" === t.mode) && (!mejs.MediaFeatures.isBustedNativeHTTPS || t.httpsBasicAuthSite !== !0)) {
                for (i || (h = document.createElement(g.isVideo ? "video" : "audio"), e.parentNode.insertBefore(h, e), e.style.display = "none", g.htmlMediaElement = e = h), r = 0; r < v.length; r++)
                    if ("video/m3u8" == v[r].type || "" !== e.canPlayType(v[r].type).replace(/no/, "") || "" !== e.canPlayType(v[r].type.replace(/mp3/, "mpeg")).replace(/no/, "") || "" !== e.canPlayType(v[r].type.replace(/m4a/, "mp4")).replace(/no/, "")) {
                        g.method = "native", g.url = v[r].url;
                        break
                    }
                if ("native" === g.method && (null !== g.url && (e.src = g.url), "auto_plugin" !== t.mode)) return g
            }
            if ("auto" === t.mode || "auto_plugin" === t.mode || "shim" === t.mode)
                for (r = 0; r < v.length; r++)
                    for (c = v[r].type, s = 0; s < t.plugins.length; s++)
                        for (d = t.plugins[s], p = mejs.plugins[d], a = 0; a < p.length; a++)
                            if (f = p[a], null == f.version || mejs.PluginDetector.hasPluginVersion(d, f.version))
                                for (l = 0; l < f.types.length; l++)
                                    if (c == f.types[l]) return g.method = d, g.url = v[r].url, g;
            return "auto_plugin" === t.mode && "native" === g.method ? g : ("" === g.method && v.length > 0 && (g.url = v[0].url), g)
        },
        formatType: function(e, t) {
            return e && !t ? this.getTypeFromFile(e) : t && ~t.indexOf(";") ? t.substr(0, t.indexOf(";")) : t
        },
        getTypeFromFile: function(e) {
            e = e.split("?")[0];
            var t = e.substring(e.lastIndexOf(".") + 1).toLowerCase();
            return (/(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(t) ? "video" : "audio") + "/" + this.getTypeFromExtension(t)
        },
        getTypeFromExtension: function(e) {
            switch (e) {
                case "mp4":
                case "m4v":
                case "m4a":
                    return "mp4";
                case "webm":
                case "webma":
                case "webmv":
                    return "webm";
                case "ogg":
                case "oga":
                case "ogv":
                    return "ogg";
                default:
                    return e
            }
        },
        createErrorMessage: function(e, t, n) {
            var i = e.htmlMediaElement,
                o = document.createElement("div");
            o.className = "me-cannotplay";
            try {
                o.style.width = i.width + "px", o.style.height = i.height + "px"
            } catch (r) {}
            t.customError ? o.innerHTML = t.customError : o.innerHTML = "" !== n ? '<a href="' + e.url + '"><img src="' + n + '" width="100%" height="100%" /></a>' : '<a href="' + e.url + '"><span>' + mejs.i18n.t("Download File") + "</span></a>", i.parentNode.insertBefore(o, i), i.style.display = "none", t.error(i)
        },
        createPlugin: function(e, t, n, i, o, r) {
            var s, a, l, u = e.htmlMediaElement,
                c = 1,
                d = 1,
                p = "me_" + e.method + "_" + mejs.meIndex++,
                f = new mejs.PluginMediaElement(p, e.method, e.url),
                h = document.createElement("div");
            f.tagName = u.tagName;
            for (var m = 0; m < u.attributes.length; m++) {
                var v = u.attributes[m];
                1 == v.specified && f.setAttribute(v.name, v.value)
            }
            for (a = u.parentNode; null !== a && null != a.tagName && "body" !== a.tagName.toLowerCase() && null != a.parentNode && null != a.parentNode.tagName && null != a.parentNode.constructor && "ShadowRoot" === a.parentNode.constructor.name;) {
                if ("p" === a.parentNode.tagName.toLowerCase()) {
                    a.parentNode.parentNode.insertBefore(a, a.parentNode);
                    break
                }
                a = a.parentNode
            }
            switch (e.isVideo ? (c = t.pluginWidth > 0 ? t.pluginWidth : t.videoWidth > 0 ? t.videoWidth : null !== u.getAttribute("width") ? u.getAttribute("width") : t.defaultVideoWidth, d = t.pluginHeight > 0 ? t.pluginHeight : t.videoHeight > 0 ? t.videoHeight : null !== u.getAttribute("height") ? u.getAttribute("height") : t.defaultVideoHeight, c = mejs.Utility.encodeUrl(c), d = mejs.Utility.encodeUrl(d)) : t.enablePluginDebug && (c = 320, d = 240), f.success = t.success, mejs.MediaPluginBridge.registerPluginElement(p, f, u), h.className = "me-plugin", h.id = p + "_container", e.isVideo ? u.parentNode.insertBefore(h, u) : document.body.insertBefore(h, document.body.childNodes[0]), l = ["id=" + p, "jsinitfunction=mejs.MediaPluginBridge.initPlugin", "jscallbackfunction=mejs.MediaPluginBridge.fireEvent", "isvideo=" + (e.isVideo ? "true" : "false"), "autoplay=" + (i ? "true" : "false"), "preload=" + o, "width=" + c, "startvolume=" + t.startVolume, "timerrate=" + t.timerRate, "flashstreamer=" + t.flashStreamer, "height=" + d, "pseudostreamstart=" + t.pseudoStreamingStartQueryParam], null !== e.url && ("flash" == e.method ? l.push("file=" + mejs.Utility.encodeUrl(e.url)) : l.push("file=" + e.url)), t.enablePluginDebug && l.push("debug=true"), t.enablePluginSmoothing && l.push("smoothing=true"), t.enablePseudoStreaming && l.push("pseudostreaming=true"), r && l.push("controls=true"), t.pluginVars && (l = l.concat(t.pluginVars)), e.method) {
                case "silverlight":
                    h.innerHTML = '<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + p + '" name="' + p + '" width="' + c + '" height="' + d + '" class="mejs-shim"><param name="initParams" value="' + l.join(",") + '" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="' + t.pluginPath + t.silverlightName + '" /></object>';
                    break;
                case "flash":
                    mejs.MediaFeatures.isIE ? (s = document.createElement("div"), h.appendChild(s), s.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + p + '" width="' + c + '" height="' + d + '" class="mejs-shim"><param name="movie" value="' + t.pluginPath + t.flashName + "?x=" + new Date + '" /><param name="flashvars" value="' + l.join("&amp;") + '" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /><param name="scale" value="default" /></object>') : h.innerHTML = '<embed id="' + p + '" name="' + p + '" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="' + t.pluginPath + t.flashName + '" flashvars="' + l.join("&") + '" width="' + c + '" height="' + d + '" scale="default"class="mejs-shim"></embed>';
                    break;
                case "youtube":
                    var g; - 1 != e.url.lastIndexOf("youtu.be") ? (g = e.url.substr(e.url.lastIndexOf("index.html") + 1), -1 != g.indexOf("?") && (g = g.substr(0, g.indexOf("?")))) : g = e.url.substr(e.url.lastIndexOf("=") + 1), youtubeSettings = {
                        container: h,
                        containerId: h.id,
                        pluginMediaElement: f,
                        pluginId: p,
                        videoId: g,
                        height: d,
                        width: c
                    }, mejs.PluginDetector.hasPluginVersion("flash", [10, 0, 0]) ? mejs.YouTubeApi.createFlash(youtubeSettings) : mejs.YouTubeApi.enqueueIframe(youtubeSettings);
                    break;
                case "vimeo":
                    var C = p + "_player";
                    if (f.vimeoid = e.url.substr(e.url.lastIndexOf("index.html") + 1), h.innerHTML = '<iframe src="//player.vimeo.com/video/' + f.vimeoid + "?api=1&portrait=0&byline=0&title=0&player_id=" + C + '" width="' + c + '" height="' + d + '" frameborder="0" class="mejs-shim" id="' + C + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', "function" == typeof $f) {
                        var b = $f(h.childNodes[0]);
                        b.addEvent("ready", function() {
                            function e(e, t, n, i) {
                                var o = {
                                    type: n,
                                    target: t
                                };
                                "timeupdate" == n && (t.currentTime = o.currentTime = i.seconds, t.duration = o.duration = i.duration), t.dispatchEvent(o.type, o)
                            }
                            b.playVideo = function() {
                                b.api("play")
                            }, b.stopVideo = function() {
                                b.api("unload")
                            }, b.pauseVideo = function() {
                                b.api("pause")
                            }, b.seekTo = function(e) {
                                b.api("seekTo", e)
                            }, b.setVolume = function(e) {
                                b.api("setVolume", e)
                            }, b.setMuted = function(e) {
                                e ? (b.lastVolume = b.api("getVolume"), b.api("setVolume", 0)) : (b.api("setVolume", b.lastVolume), delete b.lastVolume)
                            }, b.addEvent("play", function() {
                                e(b, f, "play"), e(b, f, "playing")
                            }), b.addEvent("pause", function() {
                                e(b, f, "pause")
                            }), b.addEvent("finish", function() {
                                e(b, f, "ended")
                            }), b.addEvent("playProgress", function(t) {
                                e(b, f, "timeupdate", t)
                            }), f.pluginElement = h, f.pluginApi = b, mejs.MediaPluginBridge.initPlugin(p)
                        })
                    } else console.warn("You need to include froogaloop for vimeo to work")
            }
            return u.style.display = "none", u.removeAttribute("autoplay"), f
        },
        updateNative: function(e, t, n, i) {
            var o, r = e.htmlMediaElement;
            for (o in mejs.HtmlMediaElement) r[o] = mejs.HtmlMediaElement[o];
            return t.success(r, r), r
        }
    }, mejs.YouTubeApi = {
        isIframeStarted: !1,
        isIframeLoaded: !1,
        loadIframeApi: function() {
            if (!this.isIframeStarted) {
                var e = document.createElement("script");
                e.src = "http://www.youtube.com/player_api";
                var t = document.getElementsByTagName("script")[0];
                t.parentNode.insertBefore(e, t), this.isIframeStarted = !0
            }
        },
        iframeQueue: [],
        enqueueIframe: function(e) {
            this.isLoaded ? this.createIframe(e) : (this.loadIframeApi(), this.iframeQueue.push(e))
        },
        createIframe: function(e) {
            var t = e.pluginMediaElement,
                n = new YT.Player(e.containerId, {
                    height: e.height,
                    width: e.width,
                    videoId: e.videoId,
                    playerVars: {
                        controls: 0
                    },
                    events: {
                        onReady: function() {
                            e.pluginMediaElement.pluginApi = n, mejs.MediaPluginBridge.initPlugin(e.pluginId), setInterval(function() {
                                mejs.YouTubeApi.createEvent(n, t, "timeupdate")
                            }, 250)
                        },
                        onStateChange: function(e) {
                            mejs.YouTubeApi.handleStateChange(e.data, n, t)
                        }
                    }
                })
        },
        createEvent: function(e, t, n) {
            var i = {
                type: n,
                target: t
            };
            if (e && e.getDuration) {
                t.currentTime = i.currentTime = e.getCurrentTime(), t.duration = i.duration = e.getDuration(), i.paused = t.paused, i.ended = t.ended, i.muted = e.isMuted(), i.volume = e.getVolume() / 100, i.bytesTotal = e.getVideoBytesTotal(), i.bufferedBytes = e.getVideoBytesLoaded();
                var o = i.bufferedBytes / i.bytesTotal * i.duration;
                i.target.buffered = i.buffered = {
                    start: function(e) {
                        return 0
                    },
                    end: function(e) {
                        return o
                    },
                    length: 1
                }
            }
            t.dispatchEvent(i.type, i)
        },
        iFrameReady: function() {
            for (this.isLoaded = !0, this.isIframeLoaded = !0; this.iframeQueue.length > 0;) {
                var e = this.iframeQueue.pop();
                this.createIframe(e)
            }
        },
        flashPlayers: {},
        createFlash: function(e) {
            this.flashPlayers[e.pluginId] = e;
            var t, n = "//www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=" + e.pluginId + "&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";
            mejs.MediaFeatures.isIE ? (t = document.createElement("div"), e.container.appendChild(t), t.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + e.pluginId + '" width="' + e.width + '" height="' + e.height + '" class="mejs-shim"><param name="movie" value="' + n + '" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /></object>') : e.container.innerHTML = '<object type="application/x-shockwave-flash" id="' + e.pluginId + '" data="' + n + '" width="' + e.width + '" height="' + e.height + '" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="always"><param name="wmode" value="transparent"></object>'
        },
        flashReady: function(e) {
            var t = this.flashPlayers[e],
                n = document.getElementById(e),
                i = t.pluginMediaElement;
            i.pluginApi = i.pluginElement = n, mejs.MediaPluginBridge.initPlugin(e), n.cueVideoById(t.videoId);
            var o = t.containerId + "_callback";
            window[o] = function(e) {
                mejs.YouTubeApi.handleStateChange(e, n, i)
            }, n.addEventListener("onStateChange", o), setInterval(function() {
                mejs.YouTubeApi.createEvent(n, i, "timeupdate")
            }, 250), mejs.YouTubeApi.createEvent(n, i, "canplay")
        },
        handleStateChange: function(e, t, n) {
            switch (e) {
                case -1:
                    n.paused = !0, n.ended = !0, mejs.YouTubeApi.createEvent(t, n, "loadedmetadata");
                    break;
                case 0:
                    n.paused = !1, n.ended = !0, mejs.YouTubeApi.createEvent(t, n, "ended");
                    break;
                case 1:
                    n.paused = !1, n.ended = !1, mejs.YouTubeApi.createEvent(t, n, "play"), mejs.YouTubeApi.createEvent(t, n, "playing");
                    break;
                case 2:
                    n.paused = !0, n.ended = !1, mejs.YouTubeApi.createEvent(t, n, "pause");
                    break;
                case 3:
                    mejs.YouTubeApi.createEvent(t, n, "progress");
                    break;
                case 5:
            }
        }
    }, window.mejs = mejs, window.MediaElement = mejs.MediaElement,
    function(e, t, n) {
        "use strict";
        var i = {
            locale: {
                language: t.i18n && t.i18n.locale.language || "",
                strings: t.i18n && t.i18n.locale.strings || {}
            },
            ietf_lang_regex: /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/,
            methods: {}
        };
        i.getLanguage = function() {
            var e = i.locale.language || window.navigator.userLanguage || window.navigator.language;
            return i.ietf_lang_regex.exec(e) ? e : null
        }, "undefined" != typeof mejsL10n && (i.locale.language = mejsL10n.language), i.methods.checkPlain = function(e) {
            var t, n, i = {
                "&": "&amp;",
                '"': "&quot;",
                "<": "&lt;",
                ">": "&gt;"
            };
            e = String(e);
            for (t in i) i.hasOwnProperty(t) && (n = new RegExp(t, "g"), e = e.replace(n, i[t]));
            return e
        }, i.methods.t = function(e, t) {
            return i.locale.strings && i.locale.strings[t.context] && i.locale.strings[t.context][e] && (e = i.locale.strings[t.context][e]), i.methods.checkPlain(e)
        }, i.t = function(e, t) {
            if ("string" == typeof e && e.length > 0) {
                var n = i.getLanguage();
                return t = t || {
                    context: n
                }, i.methods.t(e, t)
            }
            throw {
                name: "InvalidArgumentException",
                message: "First argument is either not a string or empty."
            }
        }, t.i18n = i
    }(document, mejs),
    function(e, t) {
        "use strict";
        "undefined" != typeof mejsL10n && (e[mejsL10n.language] = mejsL10n.strings)
    }(mejs.i18n.locale.strings), "undefined" != typeof jQuery ? mejs.$ = jQuery : "undefined" != typeof ender && (mejs.$ = ender),
    function(e) {
        mejs.MepDefaults = {
                poster: "",
                showPosterWhenEnded: !1,
                defaultVideoWidth: 480,
                defaultVideoHeight: 270,
                videoWidth: -1,
                videoHeight: -1,
                defaultAudioWidth: 400,
                defaultAudioHeight: 30,
                defaultSeekBackwardInterval: function(e) {
                    return .05 * e.duration
                },
                defaultSeekForwardInterval: function(e) {
                    return .05 * e.duration
                },
                setDimensions: !0,
                audioWidth: -1,
                audioHeight: -1,
                startVolume: .8,
                loop: !1,
                autoRewind: !0,
                enableAutosize: !0,
                alwaysShowHours: !1,
                showTimecodeFrameCount: !1,
                framesPerSecond: 25,
                autosizeProgress: !0,
                alwaysShowControls: !1,
                hideVideoControlsOnLoad: !1,
                clickToPlayPause: !0,
                iPadUseNativeControls: !1,
                iPhoneUseNativeControls: !1,
                AndroidUseNativeControls: !1,
                features: ["playpause", "current", "progress", "duration", "tracks", "volume", "fullscreen"],
                isVideo: !0,
                enableKeyboard: !0,
                pauseOtherPlayers: !0,
                keyActions: [{
                    keys: [32, 179],
                    action: function(e, t) {
                        t.paused || t.ended ? e.play() : e.pause()
                    }
                }, {
                    keys: [38],
                    action: function(e, t) {
                        e.container.find(".mejs-volume-slider").css("display", "block"), e.isVideo && (e.showControls(), e.startControlsTimer());
                        var n = Math.min(t.volume + .1, 1);
                        t.setVolume(n)
                    }
                }, {
                    keys: [40],
                    action: function(e, t) {
                        e.container.find(".mejs-volume-slider").css("display", "block"), e.isVideo && (e.showControls(), e.startControlsTimer());
                        var n = Math.max(t.volume - .1, 0);
                        t.setVolume(n)
                    }
                }, {
                    keys: [37, 227],
                    action: function(e, t) {
                        if (!isNaN(t.duration) && t.duration > 0) {
                            e.isVideo && (e.showControls(), e.startControlsTimer());
                            var n = Math.max(t.currentTime - e.options.defaultSeekBackwardInterval(t), 0);
                            t.setCurrentTime(n)
                        }
                    }
                }, {
                    keys: [39, 228],
                    action: function(e, t) {
                        if (!isNaN(t.duration) && t.duration > 0) {
                            e.isVideo && (e.showControls(), e.startControlsTimer());
                            var n = Math.min(t.currentTime + e.options.defaultSeekForwardInterval(t), t.duration);
                            t.setCurrentTime(n)
                        }
                    }
                }, {
                    keys: [70],
                    action: function(e, t) {
                        "undefined" != typeof e.enterFullScreen && (e.isFullScreen ? e.exitFullScreen() : e.enterFullScreen())
                    }
                }, {
                    keys: [77],
                    action: function(e, t) {
                        e.container.find(".mejs-volume-slider").css("display", "block"), e.isVideo && (e.showControls(), e.startControlsTimer()), e.media.muted ? e.setMuted(!1) : e.setMuted(!0)
                    }
                }]
            }, mejs.mepIndex = 0, mejs.players = {}, mejs.MediaElementPlayer = function(t, n) {
                if (!(this instanceof mejs.MediaElementPlayer)) return new mejs.MediaElementPlayer(t, n);
                var i = this;
                return i.$media = i.$node = e(t), i.node = i.media = i.$media[0], i.node ? "undefined" != typeof i.node.player ? i.node.player : (i.node.player = i, "undefined" == typeof n && (n = i.$node.data("mejsoptions")), i.options = e.extend({}, mejs.MepDefaults, n), i.id = "mep_" + mejs.mepIndex++, mejs.players[i.id] = i, i.init(), i) : void 0
            }, mejs.MediaElementPlayer.prototype = {
                hasFocus: !1,
                controlsAreVisible: !0,
                init: function() {
                    var t = this,
                        n = mejs.MediaFeatures,
                        i = e.extend(!0, {}, t.options, {
                            success: function(e, n) {
                                t.meReady(e, n)
                            },
                            error: function(e) {
                                t.handleError(e)
                            }
                        }),
                        o = t.media.tagName.toLowerCase();
                    if (t.isDynamic = "audio" !== o && "video" !== o, t.isDynamic ? t.isVideo = t.options.isVideo : t.isVideo = "audio" !== o && t.options.isVideo, n.isiPad && t.options.iPadUseNativeControls || n.isiPhone && t.options.iPhoneUseNativeControls) t.$media.attr("controls", "controls"), n.isiPad && null !== t.media.getAttribute("autoplay") && t.play();
                    else if (n.isAndroid && t.options.AndroidUseNativeControls);
                    else {
                        t.$media.removeAttr("controls");
                        var r = t.isVideo ? mejs.i18n.t("Video Player") : mejs.i18n.t("Audio Player");
                        if (e('<span class="mejs-offscreen">' + r + "</span>").insertBefore(t.$media), t.container = e('<div id="' + t.id + '" class="mejs-container ' + (mejs.MediaFeatures.svg ? "svg" : "no-svg") + '" tabindex="0" role="application" aria-label="' + r + '"><div class="mejs-inner"><div class="mejs-mediaelement"></div><div class="mejs-layers"></div><div class="mejs-controls"></div><div class="mejs-clear"></div></div></div>').addClass(t.$media[0].className).insertBefore(t.$media).focus(function(e) {
                                if (!t.controlsAreVisible) {
                                    t.showControls(!0);
                                    var n = t.container.find(".mejs-playpause-button > button");
                                    n.focus()
                                }
                            }), t.container.addClass((n.isAndroid ? "mejs-android " : "") + (n.isiOS ? "mejs-ios " : "") + (n.isiPad ? "mejs-ipad " : "") + (n.isiPhone ? "mejs-iphone " : "") + (t.isVideo ? "mejs-video " : "mejs-audio ")), n.isiOS) {
                            var s = t.$media.clone();
                            t.container.find(".mejs-mediaelement").append(s), t.$media.remove(), t.$node = t.$media = s, t.node = t.media = s[0]
                        } else t.container.find(".mejs-mediaelement").append(t.$media);
                        t.controls = t.container.find(".mejs-controls"), t.layers = t.container.find(".mejs-layers");
                        var a = t.isVideo ? "video" : "audio",
                            l = a.substring(0, 1).toUpperCase() + a.substring(1);
                        t.options[a + "Width"] > 0 || t.options[a + "Width"].toString().indexOf("%") > -1 ? t.width = t.options[a + "Width"] : "" !== t.media.style.width && null !== t.media.style.width ? t.width = t.media.style.width : null !== t.media.getAttribute("width") ? t.width = t.$media.attr("width") : t.width = t.options["default" + l + "Width"], t.options[a + "Height"] > 0 || t.options[a + "Height"].toString().indexOf("%") > -1 ? t.height = t.options[a + "Height"] : "" !== t.media.style.height && null !== t.media.style.height ? t.height = t.media.style.height : null !== t.$media[0].getAttribute("height") ? t.height = t.$media.attr("height") : t.height = t.options["default" + l + "Height"], t.setPlayerSize(t.width, t.height), i.pluginWidth = t.width, i.pluginHeight = t.height
                    }
                    mejs.MediaElement(t.$media[0], i), "undefined" != typeof t.container && t.controlsAreVisible && t.container.trigger("controlsshown")
                },
                showControls: function(e) {
                    var t = this;
                    e = "undefined" == typeof e || e, t.controlsAreVisible || (e ? (t.controls.css("visibility", "visible").stop(!0, !0).fadeIn(200, function() {
                        t.controlsAreVisible = !0, t.container.trigger("controlsshown")
                    }), t.container.find(".mejs-control").css("visibility", "visible").stop(!0, !0).fadeIn(200, function() {
                        t.controlsAreVisible = !0
                    })) : (t.controls.css("visibility", "visible").css("display", "block"), t.container.find(".mejs-control").css("visibility", "visible").css("display", "block"), t.controlsAreVisible = !0, t.container.trigger("controlsshown")), t.setControlsSize())
                },
                hideControls: function(t) {
                    var n = this;
                    t = "undefined" == typeof t || t, !n.controlsAreVisible || n.options.alwaysShowControls || n.keyboardAction || (t ? (n.controls.stop(!0, !0).fadeOut(200, function() {
                        e(this).css("visibility", "hidden").css("display", "block"), n.controlsAreVisible = !1, n.container.trigger("controlshidden")
                    }), n.container.find(".mejs-control").stop(!0, !0).fadeOut(200, function() {
                        e(this).css("visibility", "hidden").css("display", "block")
                    })) : (n.controls.css("visibility", "hidden").css("display", "block"), n.container.find(".mejs-control").css("visibility", "hidden").css("display", "block"), n.controlsAreVisible = !1, n.container.trigger("controlshidden")))
                },
                controlsTimer: null,
                startControlsTimer: function(e) {
                    var t = this;
                    e = "undefined" != typeof e ? e : 1500, t.killControlsTimer("start"), t.controlsTimer = setTimeout(function() {
                        t.hideControls(), t.killControlsTimer("hide")
                    }, e)
                },
                killControlsTimer: function(e) {
                    var t = this;
                    null !== t.controlsTimer && (clearTimeout(t.controlsTimer), delete t.controlsTimer, t.controlsTimer = null)
                },
                controlsEnabled: !0,
                disableControls: function() {
                    var e = this;
                    e.killControlsTimer(), e.hideControls(!1), this.controlsEnabled = !1
                },
                enableControls: function() {
                    var e = this;
                    e.showControls(!1), e.controlsEnabled = !0
                },
                meReady: function(t, n) {
                    var i, o, r = this,
                        s = mejs.MediaFeatures,
                        a = n.getAttribute("autoplay"),
                        l = !("undefined" == typeof a || null === a || "false" === a);
                    if (!r.created) {
                        if (r.created = !0, r.media = t, r.domNode = n, !(s.isAndroid && r.options.AndroidUseNativeControls || s.isiPad && r.options.iPadUseNativeControls || s.isiPhone && r.options.iPhoneUseNativeControls)) {
                            r.buildposter(r, r.controls, r.layers, r.media), r.buildkeyboard(r, r.controls, r.layers, r.media), r.buildoverlays(r, r.controls, r.layers, r.media), r.findTracks();
                            for (i in r.options.features)
                                if (o = r.options.features[i], r["build" + o]) try {
                                    r["build" + o](r, r.controls, r.layers, r.media)
                                } catch (u) {}
                                r.container.trigger("controlsready"), r.setPlayerSize(r.width, r.height), r.setControlsSize(), r.isVideo && (mejs.MediaFeatures.hasTouch ? r.$media.bind("touchstart", function() {
                                r.controlsAreVisible ? r.hideControls(!1) : r.controlsEnabled && r.showControls(!1)
                            }) : (r.clickToPlayPauseCallback = function() {
                                r.options.clickToPlayPause && (r.media.paused ? r.play() : r.pause())
                            }, r.media.addEventListener("click", r.clickToPlayPauseCallback, !1), r.container.bind("mouseenter mouseover", function() {
                                r.controlsEnabled && (r.options.alwaysShowControls || (r.killControlsTimer("enter"), r.showControls(), r.startControlsTimer(2500)))
                            }).bind("mousemove", function() {
                                r.controlsEnabled && (r.controlsAreVisible || r.showControls(), r.options.alwaysShowControls || r.startControlsTimer(2500))
                            }).bind("mouseleave", function() {
                                r.controlsEnabled && (r.media.paused || r.options.alwaysShowControls || r.startControlsTimer(1e3))
                            })), r.options.hideVideoControlsOnLoad && r.hideControls(!1), l && !r.options.alwaysShowControls && r.hideControls(), r.options.enableAutosize && r.media.addEventListener("loadedmetadata", function(e) {
                                r.options.videoHeight <= 0 && null === r.domNode.getAttribute("height") && !isNaN(e.target.videoHeight) && (r.setPlayerSize(e.target.videoWidth, e.target.videoHeight), r.setControlsSize(), r.media.setVideoSize(e.target.videoWidth, e.target.videoHeight))
                            }, !1)), t.addEventListener("play", function() {
                                var e;
                                for (e in mejs.players) {
                                    var t = mejs.players[e];
                                    t.id == r.id || !r.options.pauseOtherPlayers || t.paused || t.ended || t.pause(), t.hasFocus = !1
                                }
                                r.hasFocus = !0
                            }, !1), r.media.addEventListener("ended", function(t) {
                                if (r.options.autoRewind) try {
                                    r.media.setCurrentTime(0), window.setTimeout(function() {
                                        e(r.container).find(".mejs-overlay-loading").parent().hide()
                                    }, 20)
                                } catch (n) {}
                                r.media.pause(), r.setProgressRail && r.setProgressRail(), r.setCurrentRail && r.setCurrentRail(), r.options.loop ? r.play() : !r.options.alwaysShowControls && r.controlsEnabled && r.showControls()
                            }, !1), r.media.addEventListener("loadedmetadata", function(e) {
                                r.updateDuration && r.updateDuration(), r.updateCurrent && r.updateCurrent(), r.isFullScreen || (r.setPlayerSize(r.width, r.height), r.setControlsSize())
                            }, !1), r.container.focusout(function(t) {
                                if (t.relatedTarget) {
                                    var n = e(t.relatedTarget);
                                    r.keyboardAction && 0 === n.parents(".mejs-container").length && (r.keyboardAction = !1, r.hideControls(!0))
                                }
                            }), setTimeout(function() {
                                r.setPlayerSize(r.width, r.height), r.setControlsSize()
                            }, 50), r.globalBind("resize", function() {
                                r.isFullScreen || mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen || r.setPlayerSize(r.width, r.height), r.setControlsSize()
                            }), "youtube" == r.media.pluginType && (s.isiOS || s.isAndroid) && r.container.find(".mejs-overlay-play").hide()
                        }
                        l && "native" == t.pluginType && r.play(), r.options.success && ("string" == typeof r.options.success ? window[r.options.success](r.media, r.domNode, r) : r.options.success(r.media, r.domNode, r))
                    }
                },
                handleError: function(e) {
                    var t = this;
                    t.controls.hide(), t.options.error && t.options.error(e)
                },
                setPlayerSize: function(t, n) {
                    var i = this;
                    if (!i.options.setDimensions) return !1;
                    if ("undefined" != typeof t && (i.width = t), "undefined" != typeof n && (i.height = n), i.height.toString().indexOf("%") > 0 || "100%" === i.$node.css("max-width") || i.$node[0].currentStyle && "100%" === i.$node[0].currentStyle.maxWidth) {
                        var o = function() {
                                return i.isVideo ? i.media.videoWidth && i.media.videoWidth > 0 ? i.media.videoWidth : null !== i.media.getAttribute("width") ? i.media.getAttribute("width") : i.options.defaultVideoWidth : i.options.defaultAudioWidth
                            }(),
                            r = function() {
                                return i.isVideo ? i.media.videoHeight && i.media.videoHeight > 0 ? i.media.videoHeight : null !== i.media.getAttribute("height") ? i.media.getAttribute("height") : i.options.defaultVideoHeight : i.options.defaultAudioHeight
                            }(),
                            s = i.container.parent().closest(":visible").width(),
                            a = i.container.parent().closest(":visible").height(),
                            l = i.isVideo || !i.options.autosizeProgress ? parseInt(s * r / o, 10) : r;
                        isNaN(l) && (l = a), i.container.parent().length > 0 && "body" === i.container.parent()[0].tagName.toLowerCase() && (s = e(window).width(), l = e(window).height()), l && s && (i.container.width(s).height(l), i.$media.add(i.container.find(".mejs-shim")).width("100%").height("100%"), i.isVideo && i.media.setVideoSize && i.media.setVideoSize(s, l), i.layers.children(".mejs-layer").width("100%").height("100%"))
                    } else i.container.width(i.width).height(i.height), i.layers.children(".mejs-layer").width(i.width).height(i.height);
                    var u = i.layers.find(".mejs-overlay-play"),
                        c = u.find(".mejs-overlay-button");
                    u.height(i.container.height() - i.controls.height()), c.css("margin-top", "-" + (c.height() / 2 - i.controls.height() / 2).toString() + "px")
                },
                setControlsSize: function() {
                    var t = this,
                        n = 0,
                        i = 0,
                        o = t.controls.find(".mejs-time-rail"),
                        r = t.controls.find(".mejs-time-total"),
                        s = (t.controls.find(".mejs-time-current"), t.controls.find(".mejs-time-loaded"), o.siblings()),
                        a = s.last(),
                        l = null;
                    if (t.container.is(":visible") && o.length && o.is(":visible")) {
                        t.options && !t.options.autosizeProgress && (i = parseInt(o.css("width"), 10)), 0 !== i && i || (s.each(function() {
                            var t = e(this);
                            "absolute" != t.css("position") && t.is(":visible") && (n += e(this).outerWidth(!0))
                        }), i = t.controls.width() - n - (o.outerWidth(!0) - o.width()));
                        do o.width(i), r.width(i - (r.outerWidth(!0) - r.width())), "absolute" != a.css("position") && (l = a.length ? a.position() : null, i--); while (null !== l && l.top > 0 && i > 0);
                        t.setProgressRail && t.setProgressRail(), t.setCurrentRail && t.setCurrentRail()
                    }
                },
                buildposter: function(t, n, i, o) {
                    var r = this,
                        s = e('<div class="mejs-poster mejs-layer"></div>').appendTo(i),
                        a = t.$media.attr("poster");
                    "" !== t.options.poster && (a = t.options.poster), a ? r.setPoster(a) : s.hide(), o.addEventListener("play", function() {
                        s.hide()
                    }, !1), t.options.showPosterWhenEnded && t.options.autoRewind && o.addEventListener("ended", function() {
                        s.show()
                    }, !1)
                },
                setPoster: function(t) {
                    var n = this,
                        i = n.container.find(".mejs-poster"),
                        o = i.find("img");
                    0 === o.length && (o = e('<img width="100%" height="100%" />').appendTo(i)), o.attr("src", t), i.css({
                        "background-image": "url(" + t + ")"
                    })
                },
                buildoverlays: function(t, n, i, o) {
                    var r = this;
                    if (t.isVideo) {
                        var s = e('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-loading"><span></span></div></div>').hide().appendTo(i),
                            a = e('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-error"></div></div>').hide().appendTo(i),
                            l = e('<div class="mejs-overlay mejs-layer mejs-overlay-play"><div class="mejs-overlay-button"></div></div>').appendTo(i).bind("click", function() {
                                r.options.clickToPlayPause && o.paused && o.play()
                            });
                        o.addEventListener("play", function() {
                            l.hide(), s.hide(), n.find(".mejs-time-buffering").hide(), a.hide()
                        }, !1), o.addEventListener("playing", function() {
                            l.hide(), s.hide(), n.find(".mejs-time-buffering").hide(), a.hide()
                        }, !1), o.addEventListener("seeking", function() {
                            s.show(), n.find(".mejs-time-buffering").show()
                        }, !1), o.addEventListener("seeked", function() {
                            s.hide(), n.find(".mejs-time-buffering").hide()
                        }, !1), o.addEventListener("pause", function() {
                            mejs.MediaFeatures.isiPhone || l.show()
                        }, !1), o.addEventListener("waiting", function() {
                            s.show(), n.find(".mejs-time-buffering").show()
                        }, !1), o.addEventListener("loadeddata", function() {
                            s.show(), n.find(".mejs-time-buffering").show(), mejs.MediaFeatures.isAndroid && (o.canplayTimeout = window.setTimeout(function() {
                                if (document.createEvent) {
                                    var e = document.createEvent("HTMLEvents");
                                    return e.initEvent("canplay", !0, !0), o.dispatchEvent(e)
                                }
                            }, 300))
                        }, !1), o.addEventListener("canplay", function() {
                            s.hide(), n.find(".mejs-time-buffering").hide(), clearTimeout(o.canplayTimeout)
                        }, !1), o.addEventListener("error", function() {
                            s.hide(), n.find(".mejs-time-buffering").hide(), a.show(), a.find(".mejs-overlay-error").html("Error loading this resource")
                        }, !1), o.addEventListener("keydown", function(e) {
                            r.onkeydown(t, o, e)
                        }, !1)
                    }
                },
                buildkeyboard: function(t, n, i, o) {
                    var r = this;
                    r.container.keydown(function() {
                        r.keyboardAction = !0
                    }), r.globalBind("keydown", function(e) {
                        return r.onkeydown(t, o, e)
                    }), r.globalBind("click", function(n) {
                        t.hasFocus = 0 !== e(n.target).closest(".mejs-container").length
                    })
                },
                onkeydown: function(e, t, n) {
                    if (e.hasFocus && e.options.enableKeyboard)
                        for (var i = 0, o = e.options.keyActions.length; o > i; i++)
                            for (var r = e.options.keyActions[i], s = 0, a = r.keys.length; a > s; s++)
                                if (n.keyCode == r.keys[s]) return "function" == typeof n.preventDefault && n.preventDefault(), r.action(e, t, n.keyCode), !1;
                    return !0
                },
                findTracks: function() {
                    var t = this,
                        n = t.$media.find("track");
                    t.tracks = [], n.each(function(n, i) {
                        i = e(i), t.tracks.push({
                            srclang: i.attr("srclang") ? i.attr("srclang").toLowerCase() : "",
                            src: i.attr("src"),
                            kind: i.attr("kind"),
                            label: i.attr("label") || "",
                            entries: [],
                            isLoaded: !1
                        })
                    })
                },
                changeSkin: function(e) {
                    this.container[0].className = "mejs-container " + e, this.setPlayerSize(this.width, this.height), this.setControlsSize()
                },
                play: function() {
                    this.load(), this.media.play()
                },
                pause: function() {
                    try {
                        this.media.pause()
                    } catch (e) {}
                },
                load: function() {
                    this.isLoaded || this.media.load(), this.isLoaded = !0
                },
                setMuted: function(e) {
                    this.media.setMuted(e)
                },
                setCurrentTime: function(e) {
                    this.media.setCurrentTime(e)
                },
                getCurrentTime: function() {
                    return this.media.currentTime
                },
                setVolume: function(e) {
                    this.media.setVolume(e)
                },
                getVolume: function() {
                    return this.media.volume
                },
                setSrc: function(e) {
                    this.media.setSrc(e)
                },
                remove: function() {
                    var e, t, n = this;
                    for (e in n.options.features)
                        if (t = n.options.features[e], n["clean" + t]) try {
                            n["clean" + t](n)
                        } catch (i) {}
                        n.isDynamic ? n.$node.insertBefore(n.container) : (n.$media.prop("controls", !0), n.$node.clone().insertBefore(n.container).show(), n.$node.remove()), "native" !== n.media.pluginType && n.media.remove(), delete mejs.players[n.id], "object" == typeof n.container && n.container.remove(), n.globalUnbind(), delete n.node.player
                },
                rebuildtracks: function() {
                    var e = this;
                    e.findTracks(), e.buildtracks(e, e.controls, e.layers, e.media)
                },
                resetSize: function() {
                    var e = this;
                    setTimeout(function() {
                        e.setPlayerSize(e.width, e.height), e.setControlsSize()
                    }, 50)
                }
            },
            function() {
                function t(t, i) {
                    var o = {
                        d: [],
                        w: []
                    };
                    return e.each((t || "").split(" "), function(e, t) {
                        var r = t + "." + i;
                        0 === r.indexOf(".") ? (o.d.push(r), o.w.push(r)) : o[n.test(t) ? "w" : "d"].push(r)
                    }), o.d = o.d.join(" "), o.w = o.w.join(" "), o
                }
                var n = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
                mejs.MediaElementPlayer.prototype.globalBind = function(n, i, o) {
                    var r = this;
                    n = t(n, r.id), n.d && e(document).bind(n.d, i, o), n.w && e(window).bind(n.w, i, o)
                }, mejs.MediaElementPlayer.prototype.globalUnbind = function(n, i) {
                    var o = this;
                    n = t(n, o.id), n.d && e(document).unbind(n.d, i), n.w && e(window).unbind(n.w, i)
                }
            }(), "undefined" != typeof e && (e.fn.mediaelementplayer = function(t) {
                return t === !1 ? this.each(function() {
                    var t = e(this).data("mediaelementplayer");
                    t && t.remove(), e(this).removeData("mediaelementplayer")
                }) : this.each(function() {
                    e(this).data("mediaelementplayer", new mejs.MediaElementPlayer(this, t))
                }), this
            }, e(document).ready(function() {
                e(".mejs-player").mediaelementplayer()
            })), window.MediaElementPlayer = mejs.MediaElementPlayer
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            playText: mejs.i18n.t("Play"),
            pauseText: mejs.i18n.t("Pause")
        }), e.extend(MediaElementPlayer.prototype, {
            buildplaypause: function(t, n, i, o) {
                function r(e) {
                    "play" === e ? (l.removeClass("mejs-play").addClass("mejs-pause"), u.attr({
                        title: a.pauseText,
                        "aria-label": a.pauseText
                    })) : (l.removeClass("mejs-pause").addClass("mejs-play"), u.attr({
                        title: a.playText,
                        "aria-label": a.playText
                    }))
                }
                var s = this,
                    a = s.options,
                    l = e('<div class="mejs-button mejs-playpause-button mejs-play" ><button type="button" aria-controls="' + s.id + '" title="' + a.playText + '" aria-label="' + a.playText + '"></button></div>').appendTo(n).click(function(e) {
                        return e.preventDefault(), o.paused ? o.play() : o.pause(), !1
                    }),
                    u = l.find("button");
                r("pse"), o.addEventListener("play", function() {
                    r("play")
                }, !1), o.addEventListener("playing", function() {
                    r("play")
                }, !1), o.addEventListener("pause", function() {
                    r("pse")
                }, !1), o.addEventListener("paused", function() {
                    r("pse")
                }, !1)
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            stopText: "Stop"
        }), e.extend(MediaElementPlayer.prototype, {
            buildstop: function(t, n, i, o) {
                var r = this;
                e('<div class="mejs-button mejs-stop-button mejs-stop"><button type="button" aria-controls="' + r.id + '" title="' + r.options.stopText + '" aria-label="' + r.options.stopText + '"></button></div>').appendTo(n).click(function() {
                    o.paused || o.pause(), o.currentTime > 0 && (o.setCurrentTime(0), o.pause(), n.find(".mejs-time-current").width("0px"), n.find(".mejs-time-handle").css("left", "0px"), n.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0)), n.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0)), i.find(".mejs-poster").show())
                })
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            progessHelpText: mejs.i18n.t("Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.")
        }), e.extend(MediaElementPlayer.prototype, {
            buildprogress: function(t, n, i, o) {
                e('<div class="mejs-time-rail"><span  class="mejs-time-total mejs-time-slider"><span class="mejs-time-buffering"></span><span class="mejs-time-loaded"></span><span class="mejs-time-current"></span><span class="mejs-time-handle"></span><span class="mejs-time-float"><span class="mejs-time-float-current">00:00</span><span class="mejs-time-float-corner"></span></span></span></div>').appendTo(n), n.find(".mejs-time-buffering").hide();
                var r = this,
                    s = n.find(".mejs-time-total"),
                    a = n.find(".mejs-time-loaded"),
                    l = n.find(".mejs-time-current"),
                    u = n.find(".mejs-time-handle"),
                    c = n.find(".mejs-time-float"),
                    d = n.find(".mejs-time-float-current"),
                    p = n.find(".mejs-time-slider"),
                    f = function(e) {
                        var t, n = s.offset(),
                            i = s.outerWidth(!0),
                            r = 0,
                            a = 0,
                            l = 0;
                        t = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX, o.duration && (t < n.left ? t = n.left : t > i + n.left && (t = i + n.left), l = t - n.left, r = l / i, a = .02 >= r ? 0 : r * o.duration, h && a !== o.currentTime && o.setCurrentTime(a), mejs.MediaFeatures.hasTouch || (c.css("left", l), d.html(mejs.Utility.secondsToTimeCode(a)), c.show()))
                    },
                    h = !1,
                    m = !1,
                    v = 0,
                    g = !1,
                    C = t.options.autoRewind,
                    b = function(e) {
                        var t = o.currentTime,
                            n = mejs.i18n.t("Time Slider"),
                            i = mejs.Utility.secondsToTimeCode(t),
                            r = o.duration;
                        p.attr({
                            "aria-label": n,
                            "aria-valuemin": 0,
                            "aria-valuemax": r,
                            "aria-valuenow": t,
                            "aria-valuetext": i,
                            role: "slider",
                            tabindex: 0
                        })
                    },
                    w = function() {
                        var e = new Date;
                        e - v >= 1e3 && o.play()
                    };
                p.bind("focus", function(e) {
                    t.options.autoRewind = !1
                }), p.bind("blur", function(e) {
                    t.options.autoRewind = C
                }), p.bind("keydown", function(e) {
                    new Date - v >= 1e3 && (g = o.paused);
                    var t = e.keyCode,
                        n = o.duration,
                        i = o.currentTime;
                    switch (t) {
                        case 37:
                            i -= 1;
                            break;
                        case 39:
                            i += 1;
                            break;
                        case 38:
                            i += Math.floor(.1 * n);
                            break;
                        case 40:
                            i -= Math.floor(.1 * n);
                            break;
                        case 36:
                            i = 0;
                            break;
                        case 35:
                            i = n;
                            break;
                        case 10:
                            return void(o.paused ? o.play() : o.pause());
                        case 13:
                            return void(o.paused ? o.play() : o.pause());
                        default:
                            return
                    }
                    return i = 0 > i ? 0 : i >= n ? n : Math.floor(i), v = new Date, g || o.pause(), i < o.duration && !g && setTimeout(w, 1100), o.setCurrentTime(i), e.preventDefault(), e.stopPropagation(), !1
                }), s.bind("mousedown touchstart", function(e) {
                    (1 === e.which || 0 === e.which) && (h = !0, f(e), r.globalBind("mousemove.dur touchmove.dur", function(e) {
                        f(e)
                    }), r.globalBind("mouseup.dur touchend.dur", function(e) {
                        h = !1, c.hide(), r.globalUnbind(".dur")
                    }))
                }).bind("mouseenter", function(e) {
                    m = !0, r.globalBind("mousemove.dur", function(e) {
                        f(e)
                    }), mejs.MediaFeatures.hasTouch || c.show()
                }).bind("mouseleave", function(e) {
                    m = !1, h || (r.globalUnbind(".dur"), c.hide())
                }), o.addEventListener("progress", function(e) {
                    t.setProgressRail(e), t.setCurrentRail(e)
                }, !1), o.addEventListener("timeupdate", function(e) {
                    t.setProgressRail(e), t.setCurrentRail(e), b(e)
                }, !1), r.loaded = a, r.total = s, r.current = l, r.handle = u
            },
            setProgressRail: function(e) {
                var t = this,
                    n = void 0 !== e ? e.target : t.media,
                    i = null;
                n && n.buffered && n.buffered.length > 0 && n.buffered.end && n.duration ? i = n.buffered.end(0) / n.duration : n && void 0 !== n.bytesTotal && n.bytesTotal > 0 && void 0 !== n.bufferedBytes ? i = n.bufferedBytes / n.bytesTotal : e && e.lengthComputable && 0 !== e.total && (i = e.loaded / e.total), null !== i && (i = Math.min(1, Math.max(0, i)), t.loaded && t.total && t.loaded.width(t.total.width() * i))
            },
            setCurrentRail: function() {
                var e = this;
                if (void 0 !== e.media.currentTime && e.media.duration && e.total && e.handle) {
                    var t = Math.round(e.total.width() * e.media.currentTime / e.media.duration),
                        n = t - Math.round(e.handle.outerWidth(!0) / 2);
                    e.current.width(t), e.handle.css("left", n)
                }
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            duration: -1,
            timeAndDurationSeparator: "<span> | </span>"
        }), e.extend(MediaElementPlayer.prototype, {
            buildcurrent: function(t, n, i, o) {
                var r = this;
                e('<div class="mejs-time" role="timer" aria-live="off"><span class="mejs-currenttime">' + (t.options.alwaysShowHours ? "00:" : "") + (t.options.showTimecodeFrameCount ? "00:00:00" : "00:00") + "</span></div>").appendTo(n), r.currenttime = r.controls.find(".mejs-currenttime"), o.addEventListener("timeupdate", function() {
                    t.updateCurrent()
                }, !1)
            },
            buildduration: function(t, n, i, o) {
                var r = this;
                n.children().last().find(".mejs-currenttime").length > 0 ? e(r.options.timeAndDurationSeparator + '<span class="mejs-duration">' + (r.options.duration > 0 ? mejs.Utility.secondsToTimeCode(r.options.duration, r.options.alwaysShowHours || r.media.duration > 3600, r.options.showTimecodeFrameCount, r.options.framesPerSecond || 25) : (t.options.alwaysShowHours ? "00:" : "") + (t.options.showTimecodeFrameCount ? "00:00:00" : "00:00")) + "</span>").appendTo(n.find(".mejs-time")) : (n.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container"), e('<div class="mejs-time mejs-duration-container"><span class="mejs-duration">' + (r.options.duration > 0 ? mejs.Utility.secondsToTimeCode(r.options.duration, r.options.alwaysShowHours || r.media.duration > 3600, r.options.showTimecodeFrameCount, r.options.framesPerSecond || 25) : (t.options.alwaysShowHours ? "00:" : "") + (t.options.showTimecodeFrameCount ? "00:00:00" : "00:00")) + "</span></div>").appendTo(n)), r.durationD = r.controls.find(".mejs-duration"), o.addEventListener("timeupdate", function() {
                    t.updateDuration()
                }, !1)
            },
            updateCurrent: function() {
                var e = this;
                e.currenttime && e.currenttime.html(mejs.Utility.secondsToTimeCode(e.media.currentTime, e.options.alwaysShowHours || e.media.duration > 3600, e.options.showTimecodeFrameCount, e.options.framesPerSecond || 25))
            },
            updateDuration: function() {
                var e = this;
                e.container.toggleClass("mejs-long-video", e.media.duration > 3600), e.durationD && (e.options.duration > 0 || e.media.duration) && e.durationD.html(mejs.Utility.secondsToTimeCode(e.options.duration > 0 ? e.options.duration : e.media.duration, e.options.alwaysShowHours, e.options.showTimecodeFrameCount, e.options.framesPerSecond || 25))
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            muteText: mejs.i18n.t("Mute Toggle"),
            allyVolumeControlText: mejs.i18n.t("Use Up/Down Arrow keys to increase or decrease volume."),
            hideVolumeOnTouchDevices: !0,
            audioVolume: "horizontal",
            videoVolume: "vertical"
        }), e.extend(MediaElementPlayer.prototype, {
            buildvolume: function(t, n, i, o) {
                if (!mejs.MediaFeatures.isAndroid && !mejs.MediaFeatures.isiOS || !this.options.hideVolumeOnTouchDevices) {
                    var r = this,
                        s = r.isVideo ? r.options.videoVolume : r.options.audioVolume,
                        a = "horizontal" == s ? e('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + r.id + '" title="' + r.options.muteText + '" aria-label="' + r.options.muteText + '"></button></div><a href="javascript:void(0);" class="mejs-horizontal-volume-slider"><span class="mejs-offscreen">' + r.options.allyVolumeControlText + '</span><div class="mejs-horizontal-volume-total"></div><div class="mejs-horizontal-volume-current"></div><div class="mejs-horizontal-volume-handle"></div></a>').appendTo(n) : e('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + r.id + '" title="' + r.options.muteText + '" aria-label="' + r.options.muteText + '"></button><a href="javascript:void(0);" class="mejs-volume-slider"><span class="mejs-offscreen">' + r.options.allyVolumeControlText + '</span><div class="mejs-volume-total"></div><div class="mejs-volume-current"></div><div class="mejs-volume-handle"></div></a></div>').appendTo(n),
                        l = r.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider"),
                        u = r.container.find(".mejs-volume-total, .mejs-horizontal-volume-total"),
                        c = r.container.find(".mejs-volume-current, .mejs-horizontal-volume-current"),
                        d = r.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle"),
                        p = function(e, t) {
                            if (!l.is(":visible") && "undefined" == typeof t) return l.show(), p(e, !0), void l.hide();
                            e = Math.max(0, e), e = Math.min(e, 1), 0 === e ? (a.removeClass("mejs-mute").addClass("mejs-unmute"), a.children("button").attr("title", mejs.i18n.t("Unmute")).attr("aria-label", mejs.i18n.t("Unmute"))) : (a.removeClass("mejs-unmute").addClass("mejs-mute"), a.children("button").attr("title", mejs.i18n.t("Mute")).attr("aria-label", mejs.i18n.t("Mute")));
                            var n = u.position();
                            if ("vertical" == s) {
                                var i = u.height(),
                                    o = i - i * e;
                                d.css("top", Math.round(n.top + o - d.height() / 2)), c.height(i - o), c.css("top", n.top + o)
                            } else {
                                var r = u.width(),
                                    f = r * e;
                                d.css("left", Math.round(n.left + f - d.width() / 2)), c.width(Math.round(f))
                            }
                        },
                        f = function(e) {
                            var t = null,
                                n = u.offset();
                            if ("vertical" === s) {
                                var i = u.height(),
                                    r = (parseInt(u.css("top").replace(/px/, ""), 10), e.pageY - n.top);
                                if (t = (i - r) / i, 0 === n.top || 0 === n.left) return
                            } else {
                                var a = u.width(),
                                    l = e.pageX - n.left;
                                t = l / a
                            }
                            t = Math.max(0, t), t = Math.min(t, 1), p(t), 0 === t ? o.setMuted(!0) : o.setMuted(!1), o.setVolume(t)
                        },
                        h = !1,
                        m = !1;
                    a.hover(function() {
                        l.show(), m = !0
                    }, function() {
                        m = !1, h || "vertical" != s || l.hide()
                    });
                    var v = function(e) {
                        var t = Math.floor(100 * o.volume);
                        l.attr({
                            "aria-label": mejs.i18n.t("volumeSlider"),
                            "aria-valuemin": 0,
                            "aria-valuemax": 100,
                            "aria-valuenow": t,
                            "aria-valuetext": t + "%",
                            role: "slider",
                            tabindex: 0
                        })
                    };
                    l.bind("mouseover", function() {
                        m = !0
                    }).bind("mousedown", function(e) {
                        return f(e), r.globalBind("mousemove.vol", function(e) {
                            f(e)
                        }), r.globalBind("mouseup.vol", function() {
                            h = !1, r.globalUnbind(".vol"), m || "vertical" != s || l.hide()
                        }), h = !0, !1
                    }).bind("keydown", function(e) {
                        var t = e.keyCode,
                            n = o.volume;
                        switch (t) {
                            case 38:
                                n += .1;
                                break;
                            case 40:
                                n -= .1;
                                break;
                            default:
                                return !0
                        }
                        return h = !1, p(n), o.setVolume(n), !1
                    }).bind("blur", function() {
                        l.hide()
                    }), a.find("button").click(function() {
                        o.setMuted(!o.muted)
                    }), a.find("button").bind("focus", function() {
                        l.show()
                    }), o.addEventListener("volumechange", function(e) {
                        h || (o.muted ? (p(0), a.removeClass("mejs-mute").addClass("mejs-unmute")) : (p(o.volume), a.removeClass("mejs-unmute").addClass("mejs-mute"))), v(e)
                    }, !1), r.container.is(":visible") && (p(t.options.startVolume), 0 === t.options.startVolume && o.setMuted(!0), "native" === o.pluginType && o.setVolume(t.options.startVolume))
                }
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            usePluginFullScreen: !0,
            newWindowCallback: function() {
                return ""
            },
            fullscreenText: mejs.i18n.t("Fullscreen")
        }), e.extend(MediaElementPlayer.prototype, {
            isFullScreen: !1,
            isNativeFullScreen: !1,
            isInIframe: !1,
            buildfullscreen: function(t, n, i, o) {
                if (t.isVideo) {
                    if (t.isInIframe = window.location != window.parent.location, mejs.MediaFeatures.hasTrueNativeFullScreen) {
                        var r = function(e) {
                            t.isFullScreen && (mejs.MediaFeatures.isFullScreen() ? (t.isNativeFullScreen = !0, t.setControlsSize()) : (t.isNativeFullScreen = !1, t.exitFullScreen()))
                        };
                        t.globalBind(mejs.MediaFeatures.fullScreenEventName, r)
                    }
                    var s = this,
                        a = (t.container, e('<div class="mejs-button mejs-fullscreen-button"><button type="button" aria-controls="' + s.id + '" title="' + s.options.fullscreenText + '" aria-label="' + s.options.fullscreenText + '"></button></div>').appendTo(n));
                    if ("native" === s.media.pluginType || !s.options.usePluginFullScreen && !mejs.MediaFeatures.isFirefox) a.click(function() {
                        var e = mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || t.isFullScreen;
                        e ? t.exitFullScreen() : t.enterFullScreen()
                    });
                    else {
                        var l = null,
                            u = function() {
                                var e, t = document.createElement("x"),
                                    n = document.documentElement,
                                    i = window.getComputedStyle;
                                return "pointerEvents" in t.style ? (t.style.pointerEvents = "auto", t.style.pointerEvents = "x", n.appendChild(t), e = i && "auto" === i(t, "").pointerEvents, n.removeChild(t), !!e) : !1
                            }();
                        if (u && !mejs.MediaFeatures.isOpera) {
                            var c, d, p = !1,
                                f = function() {
                                    if (p) {
                                        for (var e in h) h[e].hide();
                                        a.css("pointer-events", ""), s.controls.css("pointer-events", ""), s.media.removeEventListener("click", s.clickToPlayPauseCallback), p = !1
                                    }
                                },
                                h = {},
                                m = ["top", "left", "right", "bottom"],
                                v = function() {
                                    var e = a.offset().left - s.container.offset().left,
                                        t = a.offset().top - s.container.offset().top,
                                        n = a.outerWidth(!0),
                                        i = a.outerHeight(!0),
                                        o = s.container.width(),
                                        r = s.container.height();
                                    for (c in h) h[c].css({
                                        position: "absolute",
                                        top: 0,
                                        left: 0
                                    });
                                    h.top.width(o).height(t), h.left.width(e).height(i).css({
                                        top: t
                                    }), h.right.width(o - e - n).height(i).css({
                                        top: t,
                                        left: e + n
                                    }), h.bottom.width(o).height(r - i - t).css({
                                        top: t + i
                                    })
                                };
                            for (s.globalBind("resize", function() {
                                    v()
                                }), c = 0, d = m.length; d > c; c++) h[m[c]] = e('<div class="mejs-fullscreen-hover" />').appendTo(s.container).mouseover(f).hide();
                            a.on("mouseover", function() {
                                if (!s.isFullScreen) {
                                    var e = a.offset(),
                                        n = t.container.offset();
                                    o.positionFullscreenButton(e.left - n.left, e.top - n.top, !1), a.css("pointer-events", "none"), s.controls.css("pointer-events", "none"), s.media.addEventListener("click", s.clickToPlayPauseCallback);
                                    for (c in h) h[c].show();
                                    v(), p = !0
                                }
                            }), o.addEventListener("fullscreenchange", function(e) {
                                s.isFullScreen = !s.isFullScreen, s.isFullScreen ? s.media.removeEventListener("click", s.clickToPlayPauseCallback) : s.media.addEventListener("click", s.clickToPlayPauseCallback), f()
                            }), s.globalBind("mousemove", function(e) {
                                if (p) {
                                    var t = a.offset();
                                    (e.pageY < t.top || e.pageY > t.top + a.outerHeight(!0) || e.pageX < t.left || e.pageX > t.left + a.outerWidth(!0)) && (a.css("pointer-events", ""), s.controls.css("pointer-events", ""), p = !1)
                                }
                            })
                        } else a.on("mouseover", function() {
                            null !== l && (clearTimeout(l), delete l);
                            var e = a.offset(),
                                n = t.container.offset();
                            o.positionFullscreenButton(e.left - n.left, e.top - n.top, !0)
                        }).on("mouseout", function() {
                            null !== l && (clearTimeout(l), delete l), l = setTimeout(function() {
                                o.hideFullscreenButton()
                            }, 1500)
                        })
                    }
                    t.fullscreenBtn = a, s.globalBind("keydown", function(e) {
                        (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || s.isFullScreen) && 27 == e.keyCode && t.exitFullScreen()
                    })
                }
            },
            cleanfullscreen: function(e) {
                e.exitFullScreen()
            },
            containerSizeTimeout: null,
            enterFullScreen: function() {
                var t = this;
                if ("native" === t.media.pluginType || !mejs.MediaFeatures.isFirefox && !t.options.usePluginFullScreen) {
                    if (e(document.documentElement).addClass("mejs-fullscreen"), normalHeight = t.container.height(), normalWidth = t.container.width(), "native" === t.media.pluginType)
                        if (mejs.MediaFeatures.hasTrueNativeFullScreen) mejs.MediaFeatures.requestFullScreen(t.container[0]), t.isInIframe && setTimeout(function i() {
                            if (t.isNativeFullScreen) {
                                var n = window.devicePixelRatio || 1,
                                    o = .002,
                                    r = n * e(window).width(),
                                    s = screen.width,
                                    a = Math.abs(s - r),
                                    l = s * o;
                                a > l ? t.exitFullScreen() : setTimeout(i, 500)
                            }
                        }, 500);
                        else if (mejs.MediaFeatures.hasSemiNativeFullScreen) return void t.media.webkitEnterFullscreen();
                    if (t.isInIframe) {
                        var n = t.options.newWindowCallback(this);
                        if ("" !== n) {
                            if (!mejs.MediaFeatures.hasTrueNativeFullScreen) return t.pause(), void window.open(n, t.id, "top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight + ",resizable=yes,scrollbars=no,status=no,toolbar=no");
                            setTimeout(function() {
                                t.isNativeFullScreen || (t.pause(), window.open(n, t.id, "top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight + ",resizable=yes,scrollbars=no,status=no,toolbar=no"))
                            }, 250)
                        }
                    }
                    t.container.addClass("mejs-container-fullscreen").width("100%").height("100%"), t.containerSizeTimeout = setTimeout(function() {
                        t.container.css({
                            width: "100%",
                            height: "100%"
                        }), t.setControlsSize()
                    }, 500), "native" === t.media.pluginType ? t.$media.width("100%").height("100%") : (t.container.find(".mejs-shim").width("100%").height("100%"), t.media.setVideoSize(e(window).width(), e(window).height())), t.layers.children("div").width("100%").height("100%"), t.fullscreenBtn && t.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen"), t.setControlsSize(), t.isFullScreen = !0, t.container.find(".mejs-captions-text").css("font-size", screen.width / t.width * 1 * 100 + "%"), t.container.find(".mejs-captions-position").css("bottom", "45px")
                }
            },
            exitFullScreen: function() {
                var t = this;
                return clearTimeout(t.containerSizeTimeout), "native" !== t.media.pluginType && mejs.MediaFeatures.isFirefox ? void t.media.setFullscreen(!1) : (mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || t.isFullScreen) && mejs.MediaFeatures.cancelFullScreen(), e(document.documentElement).removeClass("mejs-fullscreen"), t.container.removeClass("mejs-container-fullscreen").width(normalWidth).height(normalHeight), "native" === t.media.pluginType ? t.$media.width(normalWidth).height(normalHeight) : (t.container.find(".mejs-shim").width(normalWidth).height(normalHeight), t.media.setVideoSize(normalWidth, normalHeight)), t.layers.children("div").width(normalWidth).height(normalHeight), t.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen"), t.setControlsSize(), t.isFullScreen = !1,
                    t.container.find(".mejs-captions-text").css("font-size", ""), void t.container.find(".mejs-captions-position").css("bottom", ""))
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            speeds: ["2.00", "1.50", "1.25", "1.00", "0.75"],
            defaultSpeed: "1.00",
            speedChar: "x"
        }), e.extend(MediaElementPlayer.prototype, {
            buildspeed: function(t, n, i, o) {
                var r = this;
                if ("native" == r.media.pluginType) {
                    var s = null,
                        a = null,
                        l = null,
                        u = '<div class="mejs-button mejs-speed-button"><button type="button">' + r.options.defaultSpeed + r.options.speedChar + '</button><div class="mejs-speed-selector"><ul>'; - 1 === e.inArray(r.options.defaultSpeed, r.options.speeds) && r.options.speeds.push(r.options.defaultSpeed), r.options.speeds.sort(function(e, t) {
                        return parseFloat(t) - parseFloat(e)
                    });
                    for (var c = 0, d = r.options.speeds.length; d > c; c++) l = r.id + "-speed-" + r.options.speeds[c], u += '<li><input type="radio" name="speed" value="' + r.options.speeds[c] + '" id="' + l + '" ' + (r.options.speeds[c] == r.options.defaultSpeed ? " checked" : "") + ' /><label for="' + l + '" ' + (r.options.speeds[c] == r.options.defaultSpeed ? ' class="mejs-speed-selected"' : "") + ">" + r.options.speeds[c] + r.options.speedChar + "</label></li>";
                    u += "</ul></div></div>", s = e(u).appendTo(n), a = s.find(".mejs-speed-selector"), playbackspeed = r.options.defaultSpeed, a.on("click", 'input[type="radio"]', function() {
                        var t = e(this).attr("value");
                        playbackspeed = t, o.playbackRate = parseFloat(t), s.find("button").html(t + r.options.speedChar), s.find(".mejs-speed-selected").removeClass("mejs-speed-selected"), s.find('input[type="radio"]:checked').next().addClass("mejs-speed-selected")
                    }), a.height(s.find(".mejs-speed-selector ul").outerHeight(!0) + s.find(".mejs-speed-translations").outerHeight(!0)).css("top", -1 * a.height() + "px")
                }
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            startLanguage: "",
            tracksText: mejs.i18n.t("Captions/Subtitles"),
            tracksAriaLive: !1,
            hideCaptionsButtonWhenEmpty: !0,
            toggleCaptionsButtonWhenOnlyOne: !1,
            slidesSelector: ""
        }), e.extend(MediaElementPlayer.prototype, {
            hasChapters: !1,
            cleartracks: function(e, t, n, i) {
                e && (e.captions && e.captions.remove(), e.chapters && e.chapters.remove(), e.captionsText && e.captionsText.remove(), e.captionsButton && e.captionsButton.remove())
            },
            buildtracks: function(t, n, i, o) {
                if (0 !== t.tracks.length) {
                    var r, s = this,
                        a = s.options.tracksAriaLive ? 'role="log" aria-live="assertive" aria-atomic="false"' : "";
                    if (s.domNode.textTracks)
                        for (r = s.domNode.textTracks.length - 1; r >= 0; r--) s.domNode.textTracks[r].mode = "hidden";
                    s.cleartracks(t, n, i, o), t.chapters = e('<div class="mejs-chapters mejs-layer"></div>').prependTo(i).hide(), t.captions = e('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover" ' + a + '><span class="mejs-captions-text"></span></div></div>').prependTo(i).hide(), t.captionsText = t.captions.find(".mejs-captions-text"), t.captionsButton = e('<div class="mejs-button mejs-captions-button"><button type="button" aria-controls="' + s.id + '" title="' + s.options.tracksText + '" aria-label="' + s.options.tracksText + '"></button><div class="mejs-captions-selector"><ul><li><input type="radio" name="' + t.id + '_captions" id="' + t.id + '_captions_none" value="none" checked="checked" /><label for="' + t.id + '_captions_none">' + mejs.i18n.t("None") + "</label></li></ul></div></div>").appendTo(n);
                    var l = 0;
                    for (r = 0; r < t.tracks.length; r++) "subtitles" == t.tracks[r].kind && l++;
                    for (s.options.toggleCaptionsButtonWhenOnlyOne && 1 == l ? t.captionsButton.on("click", function() {
                            null === t.selectedTrack ? lang = t.tracks[0].srclang : lang = "none", t.setTrack(lang)
                        }) : (t.captionsButton.on("mouseenter focusin", function() {
                            e(this).find(".mejs-captions-selector").css("visibility", "visible")
                        }).on("click", "input[type=radio]", function() {
                            lang = this.value, t.setTrack(lang)
                        }), t.captionsButton.on("mouseleave focusout", function() {
                            e(this).find(".mejs-captions-selector").css("visibility", "hidden")
                        })), t.options.alwaysShowControls ? t.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover") : t.container.bind("controlsshown", function() {
                            t.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")
                        }).bind("controlshidden", function() {
                            o.paused || t.container.find(".mejs-captions-position").removeClass("mejs-captions-position-hover")
                        }), t.trackToLoad = -1, t.selectedTrack = null, t.isLoadingTrack = !1, r = 0; r < t.tracks.length; r++) "subtitles" == t.tracks[r].kind && t.addTrackButton(t.tracks[r].srclang, t.tracks[r].label);
                    t.loadNextTrack(), o.addEventListener("timeupdate", function(e) {
                        t.displayCaptions()
                    }, !1), "" !== t.options.slidesSelector && (t.slidesContainer = e(t.options.slidesSelector), o.addEventListener("timeupdate", function(e) {
                        t.displaySlides()
                    }, !1)), o.addEventListener("loadedmetadata", function(e) {
                        t.displayChapters()
                    }, !1), t.container.hover(function() {
                        t.hasChapters && (t.chapters.css("visibility", "visible"), t.chapters.fadeIn(200).height(t.chapters.find(".mejs-chapter").outerHeight()))
                    }, function() {
                        t.hasChapters && !o.paused && t.chapters.fadeOut(200, function() {
                            e(this).css("visibility", "hidden"), e(this).css("display", "block")
                        })
                    }), null !== t.node.getAttribute("autoplay") && t.chapters.css("visibility", "hidden")
                }
            },
            setTrack: function(e) {
                var t, n = this;
                if ("none" == e) n.selectedTrack = null, n.captionsButton.removeClass("mejs-captions-enabled");
                else
                    for (t = 0; t < n.tracks.length; t++)
                        if (n.tracks[t].srclang == e) {
                            null === n.selectedTrack && n.captionsButton.addClass("mejs-captions-enabled"), n.selectedTrack = n.tracks[t], n.captions.attr("lang", n.selectedTrack.srclang), n.displayCaptions();
                            break
                        }
            },
            loadNextTrack: function() {
                var e = this;
                e.trackToLoad++, e.trackToLoad < e.tracks.length ? (e.isLoadingTrack = !0, e.loadTrack(e.trackToLoad)) : (e.isLoadingTrack = !1, e.checkForTracks())
            },
            loadTrack: function(t) {
                var n = this,
                    i = n.tracks[t],
                    o = function() {
                        i.isLoaded = !0, n.enableTrackButton(i.srclang, i.label), n.loadNextTrack()
                    };
                e.ajax({
                    url: i.src,
                    dataType: "text",
                    success: function(e) {
                        "string" == typeof e && /<tt\s+xml/gi.exec(e) ? i.entries = mejs.TrackFormatParser.dfxp.parse(e) : i.entries = mejs.TrackFormatParser.webvtt.parse(e), o(), "chapters" == i.kind && n.media.addEventListener("play", function(e) {
                            n.media.duration > 0 && n.displayChapters(i)
                        }, !1), "slides" == i.kind && n.setupSlides(i)
                    },
                    error: function() {
                        n.loadNextTrack()
                    }
                })
            },
            enableTrackButton: function(t, n) {
                var i = this;
                "" === n && (n = mejs.language.codes[t] || t), i.captionsButton.find("input[value=" + t + "]").prop("disabled", !1).siblings("label").html(n), i.options.startLanguage == t && e("#" + i.id + "_captions_" + t).prop("checked", !0).trigger("click"), i.adjustLanguageBox()
            },
            addTrackButton: function(t, n) {
                var i = this;
                "" === n && (n = mejs.language.codes[t] || t), i.captionsButton.find("ul").append(e('<li><input type="radio" name="' + i.id + '_captions" id="' + i.id + "_captions_" + t + '" value="' + t + '" disabled="disabled" /><label for="' + i.id + "_captions_" + t + '">' + n + " (loading)</label></li>")), i.adjustLanguageBox(), i.container.find(".mejs-captions-translations option[value=" + t + "]").remove()
            },
            adjustLanguageBox: function() {
                var e = this;
                e.captionsButton.find(".mejs-captions-selector").height(e.captionsButton.find(".mejs-captions-selector ul").outerHeight(!0) + e.captionsButton.find(".mejs-captions-translations").outerHeight(!0))
            },
            checkForTracks: function() {
                var e = this,
                    t = !1;
                if (e.options.hideCaptionsButtonWhenEmpty) {
                    for (i = 0; i < e.tracks.length; i++)
                        if ("subtitles" == e.tracks[i].kind) {
                            t = !0;
                            break
                        }
                    t || (e.captionsButton.hide(), e.setControlsSize())
                }
            },
            displayCaptions: function() {
                if ("undefined" != typeof this.tracks) {
                    var e, t = this,
                        n = t.selectedTrack;
                    if (null !== n && n.isLoaded) {
                        for (e = 0; e < n.entries.times.length; e++)
                            if (t.media.currentTime >= n.entries.times[e].start && t.media.currentTime <= n.entries.times[e].stop) return t.captionsText.html(n.entries.text[e]).attr("class", "mejs-captions-text " + (n.entries.times[e].identifier || "")), void t.captions.show().height(0);
                        t.captions.hide()
                    } else t.captions.hide()
                }
            },
            setupSlides: function(e) {
                var t = this;
                t.slides = e, t.slides.entries.imgs = [t.slides.entries.text.length], t.showSlide(0)
            },
            showSlide: function(t) {
                if ("undefined" != typeof this.tracks && "undefined" != typeof this.slidesContainer) {
                    var n = this,
                        i = n.slides.entries.text[t],
                        o = n.slides.entries.imgs[t];
                    "undefined" == typeof o || "undefined" == typeof o.fadeIn ? n.slides.entries.imgs[t] = o = e('<img src="' + i + '">').on("load", function() {
                        o.appendTo(n.slidesContainer).hide().fadeIn().siblings(":visible").fadeOut()
                    }) : o.is(":visible") || o.is(":animated") || o.fadeIn().siblings(":visible").fadeOut()
                }
            },
            displaySlides: function() {
                if ("undefined" != typeof this.slides) {
                    var e, t = this,
                        n = t.slides;
                    for (e = 0; e < n.entries.times.length; e++)
                        if (t.media.currentTime >= n.entries.times[e].start && t.media.currentTime <= n.entries.times[e].stop) return void t.showSlide(e)
                }
            },
            displayChapters: function() {
                var e, t = this;
                for (e = 0; e < t.tracks.length; e++)
                    if ("chapters" == t.tracks[e].kind && t.tracks[e].isLoaded) {
                        t.drawChapters(t.tracks[e]), t.hasChapters = !0;
                        break
                    }
            },
            drawChapters: function(t) {
                var n, i, o = this,
                    r = 0,
                    s = 0;
                for (o.chapters.empty(), n = 0; n < t.entries.times.length; n++) i = t.entries.times[n].stop - t.entries.times[n].start, r = Math.floor(i / o.media.duration * 100), (r + s > 100 || n == t.entries.times.length - 1 && 100 > r + s) && (r = 100 - s), o.chapters.append(e('<div class="mejs-chapter" rel="' + t.entries.times[n].start + '" style="left: ' + s.toString() + "%;width: " + r.toString() + '%;"><div class="mejs-chapter-block' + (n == t.entries.times.length - 1 ? " mejs-chapter-block-last" : "") + '"><span class="ch-title">' + t.entries.text[n] + '</span><span class="ch-time">' + mejs.Utility.secondsToTimeCode(t.entries.times[n].start) + "&ndash;" + mejs.Utility.secondsToTimeCode(t.entries.times[n].stop) + "</span></div></div>")), s += r;
                o.chapters.find("div.mejs-chapter").click(function() {
                    o.media.setCurrentTime(parseFloat(e(this).attr("rel"))), o.media.paused && o.media.play()
                }), o.chapters.show()
            }
        }), mejs.language = {
            codes: {
                af: "Afrikaans",
                sq: "Albanian",
                ar: "Arabic",
                be: "Belarusian",
                bg: "Bulgarian",
                ca: "Catalan",
                zh: "Chinese",
                "zh-cn": "Chinese Simplified",
                "zh-tw": "Chinese Traditional",
                hr: "Croatian",
                cs: "Czech",
                da: "Danish",
                nl: "Dutch",
                en: "English",
                et: "Estonian",
                fl: "Filipino",
                fi: "Finnish",
                fr: "French",
                gl: "Galician",
                de: "German",
                el: "Greek",
                ht: "Haitian Creole",
                iw: "Hebrew",
                hi: "Hindi",
                hu: "Hungarian",
                is: "Icelandic",
                id: "Indonesian",
                ga: "Irish",
                it: "Italian",
                ja: "Japanese",
                ko: "Korean",
                lv: "Latvian",
                lt: "Lithuanian",
                mk: "Macedonian",
                ms: "Malay",
                mt: "Maltese",
                no: "Norwegian",
                fa: "Persian",
                pl: "Polish",
                pt: "Portuguese",
                ro: "Romanian",
                ru: "Russian",
                sr: "Serbian",
                sk: "Slovak",
                sl: "Slovenian",
                es: "Spanish",
                sw: "Swahili",
                sv: "Swedish",
                tl: "Tagalog",
                th: "Thai",
                tr: "Turkish",
                uk: "Ukrainian",
                vi: "Vietnamese",
                cy: "Welsh",
                yi: "Yiddish"
            }
        }, mejs.TrackFormatParser = {
            webvtt: {
                pattern_timecode: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,
                parse: function(t) {
                    for (var n, i, o, r = 0, s = mejs.TrackFormatParser.split2(t, /\r?\n/), a = {
                            text: [],
                            times: []
                        }; r < s.length; r++) {
                        if (n = this.pattern_timecode.exec(s[r]), n && r < s.length) {
                            for (r - 1 >= 0 && "" !== s[r - 1] && (o = s[r - 1]), r++, i = s[r], r++;
                                "" !== s[r] && r < s.length;) i = i + "\n" + s[r], r++;
                            i = e.trim(i).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), a.text.push(i), a.times.push({
                                identifier: o,
                                start: 0 === mejs.Utility.convertSMPTEtoSeconds(n[1]) ? .2 : mejs.Utility.convertSMPTEtoSeconds(n[1]),
                                stop: mejs.Utility.convertSMPTEtoSeconds(n[3]),
                                settings: n[5]
                            })
                        }
                        o = ""
                    }
                    return a
                }
            },
            dfxp: {
                parse: function(t) {
                    t = e(t).filter("tt");
                    var n, i, o = 0,
                        r = t.children("div").eq(0),
                        s = r.find("p"),
                        a = t.find("#" + r.attr("style")),
                        l = {
                            text: [],
                            times: []
                        };
                    if (a.length) {
                        var u = a.removeAttr("id").get(0).attributes;
                        if (u.length)
                            for (n = {}, o = 0; o < u.length; o++) n[u[o].name.split(":")[1]] = u[o].value
                    }
                    for (o = 0; o < s.length; o++) {
                        var c, d = {
                            start: null,
                            stop: null,
                            style: null
                        };
                        if (s.eq(o).attr("begin") && (d.start = mejs.Utility.convertSMPTEtoSeconds(s.eq(o).attr("begin"))), !d.start && s.eq(o - 1).attr("end") && (d.start = mejs.Utility.convertSMPTEtoSeconds(s.eq(o - 1).attr("end"))), s.eq(o).attr("end") && (d.stop = mejs.Utility.convertSMPTEtoSeconds(s.eq(o).attr("end"))), !d.stop && s.eq(o + 1).attr("begin") && (d.stop = mejs.Utility.convertSMPTEtoSeconds(s.eq(o + 1).attr("begin"))), n) {
                            c = "";
                            for (var p in n) c += p + ":" + n[p] + ";"
                        }
                        c && (d.style = c), 0 === d.start && (d.start = .2), l.times.push(d), i = e.trim(s.eq(o).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), l.text.push(i), 0 === l.times.start && (l.times.start = 2)
                    }
                    return l
                }
            },
            split2: function(e, t) {
                return e.split(t)
            }
        }, 3 != "x\n\ny".split(/\n/gi).length && (mejs.TrackFormatParser.split2 = function(e, t) {
            var n, i = [],
                o = "";
            for (n = 0; n < e.length; n++) o += e.substring(n, n + 1), t.test(o) && (i.push(o.replace(t, "")), o = "");
            return i.push(o), i
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            contextMenuItems: [{
                render: function(e) {
                    return "undefined" == typeof e.enterFullScreen ? null : e.isFullScreen ? mejs.i18n.t("Turn off Fullscreen") : mejs.i18n.t("Go Fullscreen")
                },
                click: function(e) {
                    e.isFullScreen ? e.exitFullScreen() : e.enterFullScreen()
                }
            }, {
                render: function(e) {
                    return e.media.muted ? mejs.i18n.t("Unmute") : mejs.i18n.t("Mute")
                },
                click: function(e) {
                    e.media.muted ? e.setMuted(!1) : e.setMuted(!0)
                }
            }, {
                isSeparator: !0
            }, {
                render: function(e) {
                    return mejs.i18n.t("Download Video")
                },
                click: function(e) {
                    window.location.href = e.media.currentSrc
                }
            }]
        }), e.extend(MediaElementPlayer.prototype, {
            buildcontextmenu: function(t, n, i, o) {
                t.contextMenu = e('<div class="mejs-contextmenu"></div>').appendTo(e("body")).hide(), t.container.bind("contextmenu", function(e) {
                    return t.isContextMenuEnabled ? (e.preventDefault(), t.renderContextMenu(e.clientX - 1, e.clientY - 1), !1) : void 0
                }), t.container.bind("click", function() {
                    t.contextMenu.hide()
                }), t.contextMenu.bind("mouseleave", function() {
                    t.startContextMenuTimer()
                })
            },
            cleancontextmenu: function(e) {
                e.contextMenu.remove()
            },
            isContextMenuEnabled: !0,
            enableContextMenu: function() {
                this.isContextMenuEnabled = !0
            },
            disableContextMenu: function() {
                this.isContextMenuEnabled = !1
            },
            contextMenuTimeout: null,
            startContextMenuTimer: function() {
                var e = this;
                e.killContextMenuTimer(), e.contextMenuTimer = setTimeout(function() {
                    e.hideContextMenu(), e.killContextMenuTimer()
                }, 750)
            },
            killContextMenuTimer: function() {
                var e = this.contextMenuTimer;
                null != e && (clearTimeout(e), delete e, e = null)
            },
            hideContextMenu: function() {
                this.contextMenu.hide()
            },
            renderContextMenu: function(t, n) {
                for (var i = this, o = "", r = i.options.contextMenuItems, s = 0, a = r.length; a > s; s++)
                    if (r[s].isSeparator) o += '<div class="mejs-contextmenu-separator"></div>';
                    else {
                        var l = r[s].render(i);
                        null != l && (o += '<div class="mejs-contextmenu-item" data-itemindex="' + s + '" id="element-' + 1e6 * Math.random() + '">' + l + "</div>")
                    }
                i.contextMenu.empty().append(e(o)).css({
                    top: n,
                    left: t
                }).show(), i.contextMenu.find(".mejs-contextmenu-item").each(function() {
                    var t = e(this),
                        n = parseInt(t.data("itemindex"), 10),
                        o = i.options.contextMenuItems[n];
                    "undefined" != typeof o.show && o.show(t, i), t.click(function() {
                        "undefined" != typeof o.click && o.click(i), i.contextMenu.hide()
                    })
                }), setTimeout(function() {
                    i.killControlsTimer("rev3")
                }, 100)
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            postrollCloseText: mejs.i18n.t("Close")
        }), e.extend(MediaElementPlayer.prototype, {
            buildpostroll: function(t, n, i, o) {
                var r = this,
                    s = r.container.find('link[rel="postroll"]').attr("href");
                "undefined" != typeof s && (t.postroll = e('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">' + r.options.postrollCloseText + '</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(i).hide(), r.media.addEventListener("ended", function(n) {
                    e.ajax({
                        dataType: "html",
                        url: s,
                        success: function(e, t) {
                            i.find(".mejs-postroll-layer-content").html(e)
                        }
                    }), t.postroll.show()
                }, !1))
            }
        })
    }(mejs.$), define("mediaelement", ["jquery"], function() {}), define("app/VideoPlayer", ["jquery", "mediaelement"], function(e) {
        "use strict";
        var t = {
            init: function(t) {
                e(t).mediaelementplayer({
                    features: ["playpause", "progress", "current", "duration"],
                    pluginPath: "/img/"
                })
            }
        };
        return t
    }),
    function(e) {
        "use strict";
        "function" == typeof define && define.amd ? define("slick", ["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
    }(function(e) {
        "use strict";
        var t = window.Slick || {};
        t = function() {
            function t(t, i) {
                var o, r = this;
                r.defaults = {
                    accessibility: !0,
                    adaptiveHeight: !1,
                    appendArrows: e(t),
                    appendDots: e(t),
                    arrows: !0,
                    asNavFor: null,
                    prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                    nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                    autoplay: !1,
                    autoplaySpeed: 3e3,
                    centerMode: !1,
                    centerPadding: "50px",
                    cssEase: "ease",
                    customPaging: function(e, t) {
                        return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (t + 1) + "</button>"
                    },
                    dots: !1,
                    dotsClass: "slick-dots",
                    draggable: !0,
                    easing: "linear",
                    edgeFriction: .35,
                    fade: !1,
                    focusOnSelect: !1,
                    infinite: !0,
                    initialSlide: 0,
                    lazyLoad: "ondemand",
                    mobileFirst: !1,
                    pauseOnHover: !0,
                    pauseOnDotsHover: !1,
                    respondTo: "window",
                    responsive: null,
                    rows: 1,
                    rtl: !1,
                    slide: "",
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 500,
                    swipe: !0,
                    swipeToSlide: !1,
                    touchMove: !0,
                    touchThreshold: 5,
                    useCSS: !0,
                    variableWidth: !1,
                    vertical: !1,
                    verticalSwiping: !1,
                    waitForAnimate: !0,
                    zIndex: 1e3
                }, r.initials = {
                    animating: !1,
                    dragging: !1,
                    autoPlayTimer: null,
                    currentDirection: 0,
                    currentLeft: null,
                    currentSlide: 0,
                    direction: 1,
                    $dots: null,
                    listWidth: null,
                    listHeight: null,
                    loadIndex: 0,
                    $nextArrow: null,
                    $prevArrow: null,
                    slideCount: null,
                    slideWidth: null,
                    $slideTrack: null,
                    $slides: null,
                    sliding: !1,
                    slideOffset: 0,
                    swipeLeft: null,
                    $list: null,
                    touchObject: {},
                    transformsEnabled: !1,
                    unslicked: !1
                }, e.extend(r, r.initials), r.activeBreakpoint = null, r.animType = null, r.animProp = null, r.breakpoints = [], r.breakpointSettings = [], r.cssTransitions = !1, r.hidden = "hidden", r.paused = !1, r.positionProp = null, r.respondTo = null, r.rowCount = 1, r.shouldClick = !0, r.$slider = e(t), r.$slidesCache = null, r.transformType = null, r.transitionType = null, r.visibilityChange = "visibilitychange", r.windowWidth = 0, r.windowTimer = null, o = e(t).data("slick") || {}, r.options = e.extend({}, r.defaults, o, i), r.currentSlide = r.options.initialSlide, r.originalSettings = r.options, "undefined" != typeof document.mozHidden ? (r.hidden = "mozHidden", r.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (r.hidden = "webkitHidden", r.visibilityChange = "webkitvisibilitychange"), r.autoPlay = e.proxy(r.autoPlay, r), r.autoPlayClear = e.proxy(r.autoPlayClear, r), r.changeSlide = e.proxy(r.changeSlide, r), r.clickHandler = e.proxy(r.clickHandler, r), r.selectHandler = e.proxy(r.selectHandler, r), r.setPosition = e.proxy(r.setPosition, r), r.swipeHandler = e.proxy(r.swipeHandler, r), r.dragHandler = e.proxy(r.dragHandler, r), r.keyHandler = e.proxy(r.keyHandler, r), r.autoPlayIterator = e.proxy(r.autoPlayIterator, r), r.instanceUid = n++, r.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, r.registerBreakpoints(), r.init(!0), r.checkResponsive(!0)
            }
            var n = 0;
            return t
        }(), t.prototype.addSlide = t.prototype.slickAdd = function(t, n, i) {
            var o = this;
            if ("boolean" == typeof n) i = n, n = null;
            else if (0 > n || n >= o.slideCount) return !1;
            o.unload(), "number" == typeof n ? 0 === n && 0 === o.$slides.length ? e(t).appendTo(o.$slideTrack) : i ? e(t).insertBefore(o.$slides.eq(n)) : e(t).insertAfter(o.$slides.eq(n)) : i === !0 ? e(t).prependTo(o.$slideTrack) : e(t).appendTo(o.$slideTrack), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slides.each(function(t, n) {
                e(n).attr("data-slick-index", t)
            }), o.$slidesCache = o.$slides, o.reinit()
        }, t.prototype.animateHeight = function() {
            var e = this;
            if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
                var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                e.$list.animate({
                    height: t
                }, e.options.speed)
            }
        }, t.prototype.animateSlide = function(t, n) {
            var i = {},
                o = this;
            o.animateHeight(), o.options.rtl === !0 && o.options.vertical === !1 && (t = -t), o.transformsEnabled === !1 ? o.options.vertical === !1 ? o.$slideTrack.animate({
                left: t
            }, o.options.speed, o.options.easing, n) : o.$slideTrack.animate({
                top: t
            }, o.options.speed, o.options.easing, n) : o.cssTransitions === !1 ? (o.options.rtl === !0 && (o.currentLeft = -o.currentLeft), e({
                animStart: o.currentLeft
            }).animate({
                animStart: t
            }, {
                duration: o.options.speed,
                easing: o.options.easing,
                step: function(e) {
                    e = Math.ceil(e), o.options.vertical === !1 ? (i[o.animType] = "translate(" + e + "px, 0px)", o.$slideTrack.css(i)) : (i[o.animType] = "translate(0px," + e + "px)", o.$slideTrack.css(i))
                },
                complete: function() {
                    n && n.call()
                }
            })) : (o.applyTransition(), t = Math.ceil(t), o.options.vertical === !1 ? i[o.animType] = "translate3d(" + t + "px, 0px, 0px)" : i[o.animType] = "translate3d(0px," + t + "px, 0px)", o.$slideTrack.css(i), n && setTimeout(function() {
                o.disableTransition(), n.call()
            }, o.options.speed))
        }, t.prototype.asNavFor = function(t) {
            var n = this,
                i = n.options.asNavFor;
            i && null !== i && (i = e(i).not(n.$slider)), null !== i && "object" == typeof i && i.each(function() {
                var n = e(this).slick("getSlick");
                n.unslicked || n.slideHandler(t, !0)
            })
        }, t.prototype.applyTransition = function(e) {
            var t = this,
                n = {};
            t.options.fade === !1 ? n[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : n[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, t.options.fade === !1 ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
        }, t.prototype.autoPlay = function() {
            var e = this;
            e.autoPlayTimer && clearInterval(e.autoPlayTimer), e.slideCount > e.options.slidesToShow && e.paused !== !0 && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
        }, t.prototype.autoPlayClear = function() {
            var e = this;
            e.autoPlayTimer && clearInterval(e.autoPlayTimer)
        }, t.prototype.autoPlayIterator = function() {
            var e = this;
            e.options.infinite === !1 ? 1 === e.direction ? (e.currentSlide + 1 === e.slideCount - 1 && (e.direction = 0), e.slideHandler(e.currentSlide + e.options.slidesToScroll)) : (e.currentSlide - 1 === 0 && (e.direction = 1), e.slideHandler(e.currentSlide - e.options.slidesToScroll)) : e.slideHandler(e.currentSlide + e.options.slidesToScroll)
        }, t.prototype.buildArrows = function() {
            var t = this;
            t.options.arrows === !0 && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"), t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"), t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows), t.options.infinite !== !0 && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
                "aria-disabled": "true",
                tabindex: "-1"
            }))
        }, t.prototype.buildDots = function() {
            var t, n, i = this;
            if (i.options.dots === !0 && i.slideCount > i.options.slidesToShow) {
                for (n = '<ul class="' + i.options.dotsClass + '">', t = 0; t <= i.getDotCount(); t += 1) n += "<li>" + i.options.customPaging.call(this, i, t) + "</li>";
                n += "</ul>", i.$dots = e(n).appendTo(i.options.appendDots), i.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
            }
        }, t.prototype.buildOut = function() {
            var t = this;
            t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), t.slideCount = t.$slides.length, t.$slides.each(function(t, n) {
                e(n).attr("data-slick-index", t).data("originalStyling", e(n).attr("style") || "")
            }), t.$slidesCache = t.$slides, t.$slider.addClass("slick-slider"), t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(), t.$list = t.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), t.$slideTrack.css("opacity", 0), (t.options.centerMode === !0 || t.options.swipeToSlide === !0) && (t.options.slidesToScroll = 1), e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"), t.setupInfinite(), t.buildArrows(), t.buildDots(), t.updateDots(), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), t.options.draggable === !0 && t.$list.addClass("draggable")
        }, t.prototype.buildRows = function() {
            var e, t, n, i, o, r, s, a = this;
            if (i = document.createDocumentFragment(), r = a.$slider.children(), a.options.rows > 1) {
                for (s = a.options.slidesPerRow * a.options.rows, o = Math.ceil(r.length / s), e = 0; o > e; e++) {
                    var l = document.createElement("div");
                    for (t = 0; t < a.options.rows; t++) {
                        var u = document.createElement("div");
                        for (n = 0; n < a.options.slidesPerRow; n++) {
                            var c = e * s + (t * a.options.slidesPerRow + n);
                            r.get(c) && u.appendChild(r.get(c))
                        }
                        l.appendChild(u)
                    }
                    i.appendChild(l)
                }
                a.$slider.html(i), a.$slider.children().children().children().css({
                    width: 100 / a.options.slidesPerRow + "%",
                    display: "inline-block"
                })
            }
        }, t.prototype.checkResponsive = function(t, n) {
            var i, o, r, s = this,
                a = !1,
                l = s.$slider.width(),
                u = window.innerWidth || e(window).width();
            if ("window" === s.respondTo ? r = u : "slider" === s.respondTo ? r = l : "min" === s.respondTo && (r = Math.min(u, l)), s.options.responsive && s.options.responsive.length && null !== s.options.responsive) {
                o = null;
                for (i in s.breakpoints) s.breakpoints.hasOwnProperty(i) && (s.originalSettings.mobileFirst === !1 ? r < s.breakpoints[i] && (o = s.breakpoints[i]) : r > s.breakpoints[i] && (o = s.breakpoints[i]));
                null !== o ? null !== s.activeBreakpoint ? (o !== s.activeBreakpoint || n) && (s.activeBreakpoint = o, "unslick" === s.breakpointSettings[o] ? s.unslick(o) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[o]), t === !0 && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = o) : (s.activeBreakpoint = o, "unslick" === s.breakpointSettings[o] ? s.unslick(o) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[o]), t === !0 && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = o) : null !== s.activeBreakpoint && (s.activeBreakpoint = null, s.options = s.originalSettings, t === !0 && (s.currentSlide = s.options.initialSlide), s.refresh(t), a = o), t || a === !1 || s.$slider.trigger("breakpoint", [s, a])
            }
        }, t.prototype.changeSlide = function(t, n) {
            var i, o, r, s = this,
                a = e(t.target);
            switch (a.is("a") && t.preventDefault(), a.is("li") || (a = a.closest("li")), r = s.slideCount % s.options.slidesToScroll !== 0, i = r ? 0 : (s.slideCount - s.currentSlide) % s.options.slidesToScroll, t.data.message) {
                case "previous":
                    o = 0 === i ? s.options.slidesToScroll : s.options.slidesToShow - i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide - o, !1, n);
                    break;
                case "next":
                    o = 0 === i ? s.options.slidesToScroll : i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide + o, !1, n);
                    break;
                case "index":
                    var l = 0 === t.data.index ? 0 : t.data.index || a.index() * s.options.slidesToScroll;
                    s.slideHandler(s.checkNavigable(l), !1, n), a.children().trigger("focus");
                    break;
                default:
                    return
            }
        }, t.prototype.checkNavigable = function(e) {
            var t, n, i = this;
            if (t = i.getNavigableIndexes(), n = 0, e > t[t.length - 1]) e = t[t.length - 1];
            else
                for (var o in t) {
                    if (e < t[o]) {
                        e = n;
                        break
                    }
                    n = t[o]
                }
            return e
        }, t.prototype.cleanUpEvents = function() {
            var t = this;
            t.options.dots && null !== t.$dots && (e("li", t.$dots).off("click.slick", t.changeSlide), t.options.pauseOnDotsHover === !0 && t.options.autoplay === !0 && e("li", t.$dots).off("mouseenter.slick", e.proxy(t.setPaused, t, !0)).off("mouseleave.slick", e.proxy(t.setPaused, t, !1))), t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide), t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide)), t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler), t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler), t.$list.off("touchend.slick mouseup.slick", t.swipeHandler), t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler), t.$list.off("click.slick", t.clickHandler), e(document).off(t.visibilityChange, t.visibility), t.$list.off("mouseenter.slick", e.proxy(t.setPaused, t, !0)), t.$list.off("mouseleave.slick", e.proxy(t.setPaused, t, !1)), t.options.accessibility === !0 && t.$list.off("keydown.slick", t.keyHandler), t.options.focusOnSelect === !0 && e(t.$slideTrack).children().off("click.slick", t.selectHandler), e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange), e(window).off("resize.slick.slick-" + t.instanceUid, t.resize), e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault), e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition), e(document).off("ready.slick.slick-" + t.instanceUid, t.setPosition)
        }, t.prototype.cleanUpRows = function() {
            var e, t = this;
            t.options.rows > 1 && (e = t.$slides.children().children(), e.removeAttr("style"), t.$slider.html(e))
        }, t.prototype.clickHandler = function(e) {
            var t = this;
            t.shouldClick === !1 && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
        }, t.prototype.destroy = function(t) {
            var n = this;
            n.autoPlayClear(), n.touchObject = {}, n.cleanUpEvents(), e(".slick-cloned", n.$slider).detach(), n.$dots && n.$dots.remove(), n.$prevArrow.length && (n.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.prevArrow) && n.$prevArrow.remove()), n.$nextArrow.length && (n.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.nextArrow) && n.$nextArrow.remove()), n.$slides && (n.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
                e(this).attr("style", e(this).data("originalStyling"))
            }), n.$slideTrack.children(this.options.slide).detach(), n.$slideTrack.detach(), n.$list.detach(), n.$slider.append(n.$slides)), n.cleanUpRows(), n.$slider.removeClass("slick-slider"), n.$slider.removeClass("slick-initialized"), n.unslicked = !0, t || n.$slider.trigger("destroy", [n])
        }, t.prototype.disableTransition = function(e) {
            var t = this,
                n = {};
            n[t.transitionType] = "", t.options.fade === !1 ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
        }, t.prototype.fadeSlide = function(e, t) {
            var n = this;
            n.cssTransitions === !1 ? (n.$slides.eq(e).css({
                zIndex: n.options.zIndex
            }), n.$slides.eq(e).animate({
                opacity: 1
            }, n.options.speed, n.options.easing, t)) : (n.applyTransition(e), n.$slides.eq(e).css({
                opacity: 1,
                zIndex: n.options.zIndex
            }), t && setTimeout(function() {
                n.disableTransition(e), t.call()
            }, n.options.speed))
        }, t.prototype.fadeSlideOut = function(e) {
            var t = this;
            t.cssTransitions === !1 ? t.$slides.eq(e).animate({
                opacity: 0,
                zIndex: t.options.zIndex - 2
            }, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e).css({
                opacity: 0,
                zIndex: t.options.zIndex - 2
            }))
        }, t.prototype.filterSlides = t.prototype.slickFilter = function(e) {
            var t = this;
            null !== e && (t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.filter(e).appendTo(t.$slideTrack), t.reinit())
        }, t.prototype.getCurrent = t.prototype.slickCurrentSlide = function() {
            var e = this;
            return e.currentSlide
        }, t.prototype.getDotCount = function() {
            var e = this,
                t = 0,
                n = 0,
                i = 0;
            if (e.options.infinite === !0)
                for (; t < e.slideCount;) ++i, t = n + e.options.slidesToShow, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            else if (e.options.centerMode === !0) i = e.slideCount;
            else
                for (; t < e.slideCount;) ++i, t = n + e.options.slidesToShow, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            return i - 1
        }, t.prototype.getLeft = function(e) {
            var t, n, i, o = this,
                r = 0;
            return o.slideOffset = 0, n = o.$slides.first().outerHeight(!0), o.options.infinite === !0 ? (o.slideCount > o.options.slidesToShow && (o.slideOffset = o.slideWidth * o.options.slidesToShow * -1, r = n * o.options.slidesToShow * -1), o.slideCount % o.options.slidesToScroll !== 0 && e + o.options.slidesToScroll > o.slideCount && o.slideCount > o.options.slidesToShow && (e > o.slideCount ? (o.slideOffset = (o.options.slidesToShow - (e - o.slideCount)) * o.slideWidth * -1, r = (o.options.slidesToShow - (e - o.slideCount)) * n * -1) : (o.slideOffset = o.slideCount % o.options.slidesToScroll * o.slideWidth * -1, r = o.slideCount % o.options.slidesToScroll * n * -1))) : e + o.options.slidesToShow > o.slideCount && (o.slideOffset = (e + o.options.slidesToShow - o.slideCount) * o.slideWidth, r = (e + o.options.slidesToShow - o.slideCount) * n), o.slideCount <= o.options.slidesToShow && (o.slideOffset = 0, r = 0), o.options.centerMode === !0 && o.options.infinite === !0 ? o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2) - o.slideWidth : o.options.centerMode === !0 && (o.slideOffset = 0, o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2)), t = o.options.vertical === !1 ? e * o.slideWidth * -1 + o.slideOffset : e * n * -1 + r, o.options.variableWidth === !0 && (i = o.slideCount <= o.options.slidesToShow || o.options.infinite === !1 ? o.$slideTrack.children(".slick-slide").eq(e) : o.$slideTrack.children(".slick-slide").eq(e + o.options.slidesToShow), t = i[0] ? -1 * i[0].offsetLeft : 0, o.options.centerMode === !0 && (i = o.options.infinite === !1 ? o.$slideTrack.children(".slick-slide").eq(e) : o.$slideTrack.children(".slick-slide").eq(e + o.options.slidesToShow + 1),
                t = i[0] ? -1 * i[0].offsetLeft : 0, t += (o.$list.width() - i.outerWidth()) / 2)), t
        }, t.prototype.getOption = t.prototype.slickGetOption = function(e) {
            var t = this;
            return t.options[e]
        }, t.prototype.getNavigableIndexes = function() {
            var e, t = this,
                n = 0,
                i = 0,
                o = [];
            for (t.options.infinite === !1 ? e = t.slideCount : (n = -1 * t.options.slidesToScroll, i = -1 * t.options.slidesToScroll, e = 2 * t.slideCount); e > n;) o.push(n), n = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
            return o
        }, t.prototype.getSlick = function() {
            return this
        }, t.prototype.getSlideCount = function() {
            var t, n, i, o = this;
            return i = o.options.centerMode === !0 ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, o.options.swipeToSlide === !0 ? (o.$slideTrack.find(".slick-slide").each(function(t, r) {
                return r.offsetLeft - i + e(r).outerWidth() / 2 > -1 * o.swipeLeft ? (n = r, !1) : void 0
            }), t = Math.abs(e(n).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
        }, t.prototype.goTo = t.prototype.slickGoTo = function(e, t) {
            var n = this;
            n.changeSlide({
                data: {
                    message: "index",
                    index: parseInt(e)
                }
            }, t)
        }, t.prototype.init = function(t) {
            var n = this;
            e(n.$slider).hasClass("slick-initialized") || (e(n.$slider).addClass("slick-initialized"), n.buildRows(), n.buildOut(), n.setProps(), n.startLoad(), n.loadSlider(), n.initializeEvents(), n.updateArrows(), n.updateDots()), t && n.$slider.trigger("init", [n]), n.options.accessibility === !0 && n.initADA()
        }, t.prototype.initArrowEvents = function() {
            var e = this;
            e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.on("click.slick", {
                message: "previous"
            }, e.changeSlide), e.$nextArrow.on("click.slick", {
                message: "next"
            }, e.changeSlide))
        }, t.prototype.initDotEvents = function() {
            var t = this;
            t.options.dots === !0 && t.slideCount > t.options.slidesToShow && e("li", t.$dots).on("click.slick", {
                message: "index"
            }, t.changeSlide), t.options.dots === !0 && t.options.pauseOnDotsHover === !0 && t.options.autoplay === !0 && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.setPaused, t, !0)).on("mouseleave.slick", e.proxy(t.setPaused, t, !1))
        }, t.prototype.initializeEvents = function() {
            var t = this;
            t.initArrowEvents(), t.initDotEvents(), t.$list.on("touchstart.slick mousedown.slick", {
                action: "start"
            }, t.swipeHandler), t.$list.on("touchmove.slick mousemove.slick", {
                action: "move"
            }, t.swipeHandler), t.$list.on("touchend.slick mouseup.slick", {
                action: "end"
            }, t.swipeHandler), t.$list.on("touchcancel.slick mouseleave.slick", {
                action: "end"
            }, t.swipeHandler), t.$list.on("click.slick", t.clickHandler), e(document).on(t.visibilityChange, e.proxy(t.visibility, t)), t.$list.on("mouseenter.slick", e.proxy(t.setPaused, t, !0)), t.$list.on("mouseleave.slick", e.proxy(t.setPaused, t, !1)), t.options.accessibility === !0 && t.$list.on("keydown.slick", t.keyHandler), t.options.focusOnSelect === !0 && e(t.$slideTrack).children().on("click.slick", t.selectHandler), e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)), e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)), e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault), e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition), e(document).on("ready.slick.slick-" + t.instanceUid, t.setPosition)
        }, t.prototype.initUI = function() {
            var e = this;
            e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.show(), e.options.autoplay === !0 && e.autoPlay()
        }, t.prototype.keyHandler = function(e) {
            var t = this;
            e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && t.options.accessibility === !0 ? t.changeSlide({
                data: {
                    message: "previous"
                }
            }) : 39 === e.keyCode && t.options.accessibility === !0 && t.changeSlide({
                data: {
                    message: "next"
                }
            }))
        }, t.prototype.lazyLoad = function() {
            function t(t) {
                e("img[data-lazy]", t).each(function() {
                    var t = e(this),
                        n = e(this).attr("data-lazy"),
                        i = document.createElement("img");
                    i.onload = function() {
                        t.animate({
                            opacity: 0
                        }, 100, function() {
                            t.attr("src", n).animate({
                                opacity: 1
                            }, 200, function() {
                                t.removeAttr("data-lazy").removeClass("slick-loading")
                            })
                        })
                    }, i.src = n
                })
            }
            var n, i, o, r, s = this;
            s.options.centerMode === !0 ? s.options.infinite === !0 ? (o = s.currentSlide + (s.options.slidesToShow / 2 + 1), r = o + s.options.slidesToShow + 2) : (o = Math.max(0, s.currentSlide - (s.options.slidesToShow / 2 + 1)), r = 2 + (s.options.slidesToShow / 2 + 1) + s.currentSlide) : (o = s.options.infinite ? s.options.slidesToShow + s.currentSlide : s.currentSlide, r = o + s.options.slidesToShow, s.options.fade === !0 && (o > 0 && o--, r <= s.slideCount && r++)), n = s.$slider.find(".slick-slide").slice(o, r), t(n), s.slideCount <= s.options.slidesToShow ? (i = s.$slider.find(".slick-slide"), t(i)) : s.currentSlide >= s.slideCount - s.options.slidesToShow ? (i = s.$slider.find(".slick-cloned").slice(0, s.options.slidesToShow), t(i)) : 0 === s.currentSlide && (i = s.$slider.find(".slick-cloned").slice(-1 * s.options.slidesToShow), t(i))
        }, t.prototype.loadSlider = function() {
            var e = this;
            e.setPosition(), e.$slideTrack.css({
                opacity: 1
            }), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
        }, t.prototype.next = t.prototype.slickNext = function() {
            var e = this;
            e.changeSlide({
                data: {
                    message: "next"
                }
            })
        }, t.prototype.orientationChange = function() {
            var e = this;
            e.checkResponsive(), e.setPosition()
        }, t.prototype.pause = t.prototype.slickPause = function() {
            var e = this;
            e.autoPlayClear(), e.paused = !0
        }, t.prototype.play = t.prototype.slickPlay = function() {
            var e = this;
            e.paused = !1, e.autoPlay()
        }, t.prototype.postSlide = function(e) {
            var t = this;
            t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.setPosition(), t.swipeLeft = null, t.options.autoplay === !0 && t.paused === !1 && t.autoPlay(), t.options.accessibility === !0 && t.initADA()
        }, t.prototype.prev = t.prototype.slickPrev = function() {
            var e = this;
            e.changeSlide({
                data: {
                    message: "previous"
                }
            })
        }, t.prototype.preventDefault = function(e) {
            e.preventDefault()
        }, t.prototype.progressiveLazyLoad = function() {
            var t, n, i = this;
            t = e("img[data-lazy]", i.$slider).length, t > 0 && (n = e("img[data-lazy]", i.$slider).first(), n.attr("src", n.attr("data-lazy")).removeClass("slick-loading").load(function() {
                n.removeAttr("data-lazy"), i.progressiveLazyLoad(), i.options.adaptiveHeight === !0 && i.setPosition()
            }).error(function() {
                n.removeAttr("data-lazy"), i.progressiveLazyLoad()
            }))
        }, t.prototype.refresh = function(t) {
            var n = this,
                i = n.currentSlide;
            n.destroy(!0), e.extend(n, n.initials, {
                currentSlide: i
            }), n.init(), t || n.changeSlide({
                data: {
                    message: "index",
                    index: i
                }
            }, !1)
        }, t.prototype.registerBreakpoints = function() {
            var t, n, i, o = this,
                r = o.options.responsive || null;
            if ("array" === e.type(r) && r.length) {
                o.respondTo = o.options.respondTo || "window";
                for (t in r)
                    if (i = o.breakpoints.length - 1, n = r[t].breakpoint, r.hasOwnProperty(t)) {
                        for (; i >= 0;) o.breakpoints[i] && o.breakpoints[i] === n && o.breakpoints.splice(i, 1), i--;
                        o.breakpoints.push(n), o.breakpointSettings[n] = r[t].settings
                    }
                o.breakpoints.sort(function(e, t) {
                    return o.options.mobileFirst ? e - t : t - e
                })
            }
        }, t.prototype.reinit = function() {
            var t = this;
            t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"), t.slideCount = t.$slides.length, t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll), t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0), t.registerBreakpoints(), t.setProps(), t.setupInfinite(), t.buildArrows(), t.updateArrows(), t.initArrowEvents(), t.buildDots(), t.updateDots(), t.initDotEvents(), t.checkResponsive(!1, !0), t.options.focusOnSelect === !0 && e(t.$slideTrack).children().on("click.slick", t.selectHandler), t.setSlideClasses(0), t.setPosition(), t.$slider.trigger("reInit", [t]), t.options.autoplay === !0 && t.focusHandler()
        }, t.prototype.resize = function() {
            var t = this;
            e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay), t.windowDelay = window.setTimeout(function() {
                t.windowWidth = e(window).width(), t.checkResponsive(), t.unslicked || t.setPosition()
            }, 50))
        }, t.prototype.removeSlide = t.prototype.slickRemove = function(e, t, n) {
            var i = this;
            return "boolean" == typeof e ? (t = e, e = t === !0 ? 0 : i.slideCount - 1) : e = t === !0 ? --e : e, i.slideCount < 1 || 0 > e || e > i.slideCount - 1 ? !1 : (i.unload(), n === !0 ? i.$slideTrack.children().remove() : i.$slideTrack.children(this.options.slide).eq(e).remove(), i.$slides = i.$slideTrack.children(this.options.slide), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.append(i.$slides), i.$slidesCache = i.$slides, void i.reinit())
        }, t.prototype.setCSS = function(e) {
            var t, n, i = this,
                o = {};
            i.options.rtl === !0 && (e = -e), t = "left" == i.positionProp ? Math.ceil(e) + "px" : "0px", n = "top" == i.positionProp ? Math.ceil(e) + "px" : "0px", o[i.positionProp] = e, i.transformsEnabled === !1 ? i.$slideTrack.css(o) : (o = {}, i.cssTransitions === !1 ? (o[i.animType] = "translate(" + t + ", " + n + ")", i.$slideTrack.css(o)) : (o[i.animType] = "translate3d(" + t + ", " + n + ", 0px)", i.$slideTrack.css(o)))
        }, t.prototype.setDimensions = function() {
            var e = this;
            e.options.vertical === !1 ? e.options.centerMode === !0 && e.$list.css({
                padding: "0px " + e.options.centerPadding
            }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), e.options.centerMode === !0 && e.$list.css({
                padding: e.options.centerPadding + " 0px"
            })), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), e.options.vertical === !1 && e.options.variableWidth === !1 ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : e.options.variableWidth === !0 ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
            var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
            e.options.variableWidth === !1 && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
        }, t.prototype.setFade = function() {
            var t, n = this;
            n.$slides.each(function(i, o) {
                t = n.slideWidth * i * -1, n.options.rtl === !0 ? e(o).css({
                    position: "relative",
                    right: t,
                    top: 0,
                    zIndex: n.options.zIndex - 2,
                    opacity: 0
                }) : e(o).css({
                    position: "relative",
                    left: t,
                    top: 0,
                    zIndex: n.options.zIndex - 2,
                    opacity: 0
                })
            }), n.$slides.eq(n.currentSlide).css({
                zIndex: n.options.zIndex - 1,
                opacity: 1
            })
        }, t.prototype.setHeight = function() {
            var e = this;
            if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
                var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
                e.$list.css("height", t)
            }
        }, t.prototype.setOption = t.prototype.slickSetOption = function(t, n, i) {
            var o, r, s = this;
            if ("responsive" === t && "array" === e.type(n))
                for (r in n)
                    if ("array" !== e.type(s.options.responsive)) s.options.responsive = [n[r]];
                    else {
                        for (o = s.options.responsive.length - 1; o >= 0;) s.options.responsive[o].breakpoint === n[r].breakpoint && s.options.responsive.splice(o, 1), o--;
                        s.options.responsive.push(n[r])
                    }
            else s.options[t] = n;
            i === !0 && (s.unload(), s.reinit())
        }, t.prototype.setPosition = function() {
            var e = this;
            e.setDimensions(), e.setHeight(), e.options.fade === !1 ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
        }, t.prototype.setProps = function() {
            var e = this,
                t = document.body.style;
            e.positionProp = e.options.vertical === !0 ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), (void 0 !== t.WebkitTransition || void 0 !== t.MozTransition || void 0 !== t.msTransition) && e.options.useCSS === !0 && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), void 0 !== t.OTransform && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.MozTransform && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)), void 0 !== t.webkitTransform && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.msTransform && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", void 0 === t.msTransform && (e.animType = !1)), void 0 !== t.transform && e.animType !== !1 && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = null !== e.animType && e.animType !== !1
        }, t.prototype.setSlideClasses = function(e) {
            var t, n, i, o, r = this;
            n = r.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), r.$slides.eq(e).addClass("slick-current"), r.options.centerMode === !0 ? (t = Math.floor(r.options.slidesToShow / 2), r.options.infinite === !0 && (e >= t && e <= r.slideCount - 1 - t ? r.$slides.slice(e - t, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (i = r.options.slidesToShow + e, n.slice(i - t + 1, i + t + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === e ? n.eq(n.length - 1 - r.options.slidesToShow).addClass("slick-center") : e === r.slideCount - 1 && n.eq(r.options.slidesToShow).addClass("slick-center")), r.$slides.eq(e).addClass("slick-center")) : e >= 0 && e <= r.slideCount - r.options.slidesToShow ? r.$slides.slice(e, e + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : n.length <= r.options.slidesToShow ? n.addClass("slick-active").attr("aria-hidden", "false") : (o = r.slideCount % r.options.slidesToShow, i = r.options.infinite === !0 ? r.options.slidesToShow + e : e, r.options.slidesToShow == r.options.slidesToScroll && r.slideCount - e < r.options.slidesToShow ? n.slice(i - (r.options.slidesToShow - o), i + o).addClass("slick-active").attr("aria-hidden", "false") : n.slice(i, i + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === r.options.lazyLoad && r.lazyLoad()
        }, t.prototype.setupInfinite = function() {
            var t, n, i, o = this;
            if (o.options.fade === !0 && (o.options.centerMode = !1), o.options.infinite === !0 && o.options.fade === !1 && (n = null, o.slideCount > o.options.slidesToShow)) {
                for (i = o.options.centerMode === !0 ? o.options.slidesToShow + 1 : o.options.slidesToShow, t = o.slideCount; t > o.slideCount - i; t -= 1) n = t - 1, e(o.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n - o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");
                for (t = 0; i > t; t += 1) n = t, e(o.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n + o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");
                o.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                    e(this).attr("id", "")
                })
            }
        }, t.prototype.setPaused = function(e) {
            var t = this;
            t.options.autoplay === !0 && t.options.pauseOnHover === !0 && (t.paused = e, e ? t.autoPlayClear() : t.autoPlay())
        }, t.prototype.selectHandler = function(t) {
            var n = this,
                i = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide"),
                o = parseInt(i.attr("data-slick-index"));
            return o || (o = 0), n.slideCount <= n.options.slidesToShow ? (n.setSlideClasses(o), void n.asNavFor(o)) : void n.slideHandler(o)
        }, t.prototype.slideHandler = function(e, t, n) {
            var i, o, r, s, a = null,
                l = this;
            return t = t || !1, l.animating === !0 && l.options.waitForAnimate === !0 || l.options.fade === !0 && l.currentSlide === e || l.slideCount <= l.options.slidesToShow ? void 0 : (t === !1 && l.asNavFor(e), i = e, a = l.getLeft(i), s = l.getLeft(l.currentSlide), l.currentLeft = null === l.swipeLeft ? s : l.swipeLeft, l.options.infinite === !1 && l.options.centerMode === !1 && (0 > e || e > l.getDotCount() * l.options.slidesToScroll) ? void(l.options.fade === !1 && (i = l.currentSlide, n !== !0 ? l.animateSlide(s, function() {
                l.postSlide(i)
            }) : l.postSlide(i))) : l.options.infinite === !1 && l.options.centerMode === !0 && (0 > e || e > l.slideCount - l.options.slidesToScroll) ? void(l.options.fade === !1 && (i = l.currentSlide, n !== !0 ? l.animateSlide(s, function() {
                l.postSlide(i)
            }) : l.postSlide(i))) : (l.options.autoplay === !0 && clearInterval(l.autoPlayTimer), o = 0 > i ? l.slideCount % l.options.slidesToScroll !== 0 ? l.slideCount - l.slideCount % l.options.slidesToScroll : l.slideCount + i : i >= l.slideCount ? l.slideCount % l.options.slidesToScroll !== 0 ? 0 : i - l.slideCount : i, l.animating = !0, l.$slider.trigger("beforeChange", [l, l.currentSlide, o]), r = l.currentSlide, l.currentSlide = o, l.setSlideClasses(l.currentSlide), l.updateDots(), l.updateArrows(), l.options.fade === !0 ? (n !== !0 ? (l.fadeSlideOut(r), l.fadeSlide(o, function() {
                l.postSlide(o)
            })) : l.postSlide(o), void l.animateHeight()) : void(n !== !0 ? l.animateSlide(a, function() {
                l.postSlide(o)
            }) : l.postSlide(o))))
        }, t.prototype.startLoad = function() {
            var e = this;
            e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
        }, t.prototype.swipeDirection = function() {
            var e, t, n, i, o = this;
            return e = o.touchObject.startX - o.touchObject.curX, t = o.touchObject.startY - o.touchObject.curY, n = Math.atan2(t, e), i = Math.round(180 * n / Math.PI), 0 > i && (i = 360 - Math.abs(i)), 45 >= i && i >= 0 ? o.options.rtl === !1 ? "left" : "right" : 360 >= i && i >= 315 ? o.options.rtl === !1 ? "left" : "right" : i >= 135 && 225 >= i ? o.options.rtl === !1 ? "right" : "left" : o.options.verticalSwiping === !0 ? i >= 35 && 135 >= i ? "left" : "right" : "vertical"
        }, t.prototype.swipeEnd = function(e) {
            var t, n = this;
            if (n.dragging = !1, n.shouldClick = n.touchObject.swipeLength > 10 ? !1 : !0, void 0 === n.touchObject.curX) return !1;
            if (n.touchObject.edgeHit === !0 && n.$slider.trigger("edge", [n, n.swipeDirection()]), n.touchObject.swipeLength >= n.touchObject.minSwipe) switch (n.swipeDirection()) {
                case "left":
                    t = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide + n.getSlideCount()) : n.currentSlide + n.getSlideCount(), n.slideHandler(t), n.currentDirection = 0, n.touchObject = {}, n.$slider.trigger("swipe", [n, "left"]);
                    break;
                case "right":
                    t = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide - n.getSlideCount()) : n.currentSlide - n.getSlideCount(), n.slideHandler(t), n.currentDirection = 1, n.touchObject = {}, n.$slider.trigger("swipe", [n, "right"])
            } else n.touchObject.startX !== n.touchObject.curX && (n.slideHandler(n.currentSlide), n.touchObject = {})
        }, t.prototype.swipeHandler = function(e) {
            var t = this;
            if (!(t.options.swipe === !1 || "ontouchend" in document && t.options.swipe === !1 || t.options.draggable === !1 && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, t.options.verticalSwiping === !0 && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
                case "start":
                    t.swipeStart(e);
                    break;
                case "move":
                    t.swipeMove(e);
                    break;
                case "end":
                    t.swipeEnd(e)
            }
        }, t.prototype.swipeMove = function(e) {
            var t, n, i, o, r, s = this;
            return r = void 0 !== e.originalEvent ? e.originalEvent.touches : null, !s.dragging || r && 1 !== r.length ? !1 : (t = s.getLeft(s.currentSlide), s.touchObject.curX = void 0 !== r ? r[0].pageX : e.clientX, s.touchObject.curY = void 0 !== r ? r[0].pageY : e.clientY, s.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(s.touchObject.curX - s.touchObject.startX, 2))), s.options.verticalSwiping === !0 && (s.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(s.touchObject.curY - s.touchObject.startY, 2)))), n = s.swipeDirection(), "vertical" !== n ? (void 0 !== e.originalEvent && s.touchObject.swipeLength > 4 && e.preventDefault(), o = (s.options.rtl === !1 ? 1 : -1) * (s.touchObject.curX > s.touchObject.startX ? 1 : -1), s.options.verticalSwiping === !0 && (o = s.touchObject.curY > s.touchObject.startY ? 1 : -1), i = s.touchObject.swipeLength, s.touchObject.edgeHit = !1, s.options.infinite === !1 && (0 === s.currentSlide && "right" === n || s.currentSlide >= s.getDotCount() && "left" === n) && (i = s.touchObject.swipeLength * s.options.edgeFriction, s.touchObject.edgeHit = !0), s.options.vertical === !1 ? s.swipeLeft = t + i * o : s.swipeLeft = t + i * (s.$list.height() / s.listWidth) * o, s.options.verticalSwiping === !0 && (s.swipeLeft = t + i * o), s.options.fade === !0 || s.options.touchMove === !1 ? !1 : s.animating === !0 ? (s.swipeLeft = null, !1) : void s.setCSS(s.swipeLeft)) : void 0)
        }, t.prototype.swipeStart = function(e) {
            var t, n = this;
            return 1 !== n.touchObject.fingerCount || n.slideCount <= n.options.slidesToShow ? (n.touchObject = {}, !1) : (void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]), n.touchObject.startX = n.touchObject.curX = void 0 !== t ? t.pageX : e.clientX, n.touchObject.startY = n.touchObject.curY = void 0 !== t ? t.pageY : e.clientY, void(n.dragging = !0))
        }, t.prototype.unfilterSlides = t.prototype.slickUnfilter = function() {
            var e = this;
            null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
        }, t.prototype.unload = function() {
            var t = this;
            e(".slick-cloned", t.$slider).remove(), t.$dots && t.$dots.remove(), t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(), t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(), t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
        }, t.prototype.unslick = function(e) {
            var t = this;
            t.$slider.trigger("unslick", [t, e]), t.destroy()
        }, t.prototype.updateArrows = function() {
            var e, t = this;
            e = Math.floor(t.options.slidesToShow / 2), t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && !t.options.infinite && (t.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), t.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === t.currentSlide ? (t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), t.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : t.currentSlide >= t.slideCount - t.options.slidesToShow && t.options.centerMode === !1 ? (t.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), t.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : t.currentSlide >= t.slideCount - 1 && t.options.centerMode === !0 && (t.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), t.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
        }, t.prototype.updateDots = function() {
            var e = this;
            null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
        }, t.prototype.visibility = function() {
            var e = this;
            document[e.hidden] ? (e.paused = !0, e.autoPlayClear()) : e.options.autoplay === !0 && (e.paused = !1, e.autoPlay())
        }, t.prototype.initADA = function() {
            var t = this;
            t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
                "aria-hidden": "true",
                tabindex: "-1"
            }).find("a, input, button, select").attr({
                tabindex: "-1"
            }), t.$slideTrack.attr("role", "listbox"), t.$slides.not(t.$slideTrack.find(".slick-cloned")).each(function(n) {
                e(this).attr({
                    role: "option",
                    "aria-describedby": "slick-slide" + t.instanceUid + n
                })
            }), null !== t.$dots && t.$dots.attr("role", "tablist").find("li").each(function(n) {
                e(this).attr({
                    role: "presentation",
                    "aria-selected": "false",
                    "aria-controls": "navigation" + t.instanceUid + n,
                    id: "slick-slide" + t.instanceUid + n
                })
            }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), t.activateADA()
        }, t.prototype.activateADA = function() {
            var e = this,
                t = e.$slider.find("*").is(":focus");
            e.$slideTrack.find(".slick-active").attr({
                "aria-hidden": "false",
                tabindex: "0"
            }).find("a, input, button, select").attr({
                tabindex: "0"
            }), t && e.$slideTrack.find(".slick-active").focus()
        }, t.prototype.focusHandler = function() {
            var t = this;
            t.$slider.on("focus.slick blur.slick", "*", function(n) {
                n.stopImmediatePropagation();
                var i = e(this);
                setTimeout(function() {
                    t.isPlay && (i.is(":focus") ? (t.autoPlayClear(), t.paused = !0) : (t.paused = !1, t.autoPlay()))
                }, 0)
            })
        }, e.fn.slick = function() {
            var e, n = this,
                i = arguments[0],
                o = Array.prototype.slice.call(arguments, 1),
                r = n.length,
                s = 0;
            for (s; r > s; s++)
                if ("object" == typeof i || "undefined" == typeof i ? n[s].slick = new t(n[s], i) : e = n[s].slick[i].apply(n[s].slick, o), "undefined" != typeof e) return e;
            return n
        }
    }),
    function() {
        "use strict";
        require.config({
            shim: {
                lodash: {
                    exports: "_"
                },
                modernizr: {
                    exports: "Modernizr"
                },
                mediaelement: {
                    deps: ["jquery"]
                },
                slick: {
                    deps: ["jquery"]
                }
            },
            paths: {
                // jquery: "../bower_components/jquery/dist/jquery",
                // krpano: "vendor/krpano",
                // lodash: "../bower_components/lodash/lodash",
                // mediaelement: "../bower_components/mediaelement/build/mediaelement-and-player",
                // modernizr: "vendor/modernizr",
                // slick: "../bower_components/slick-carousel/slick/slick"
                jquery: "../bower_components/jquery/dist/jquery",
                krpano: "../viewer/krpano",
                lodash: "../bower_components/lodash/lodash",
                mediaelement: "../bower_components/mediaelement/build/mediaelement-and-player",
                modernizr: "../bower_components/modernizr/lib/modernizr",
                slick: "../bower_components/slick-carousel/slick/slick"
            }
        }), require(["jquery", "lodash", "krpano", "modernizr", "app/Player", "app/MobileCheck", "app/Nav", "app/Map", "app/USYTour", "app/Hotspots", "app/SpeedCheck", "app/Analytics"], function(e, t, n, i, o, r, s, a, l, u, c, d) {
            window.myUSYTour = l, window.myHotspots = u, window.myMap = a, window.myAnalytics = d, window.myPlayer = o, c.measureConnectionSpeed(), l.init(i), s.init(), o.init(), u.init(), a.init(), d.init()
        })
    }(), define("main", function() {});