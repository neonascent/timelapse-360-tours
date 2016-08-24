define("app/Player", ["jquery", "lodash"], function(e, t) {
    "use strict";
    var n = {
            ctrlVolume: e(".control-sound"),
            ctrlPlayPause: e(".control-play-pause"),
            //audioPads: e("#audio-pads").get(0),
            //audioPiano: e("#audio-piano").get(0),
            //audioIntro: e("#audio-intro").get(0)
        },
        i = {
            viewer: !1,
            audioTimeout: null
        },
        o = {
            init: function() {},
            initAudio: function() {
                clearTimeout(i.audioTimeout), this.setVolume(0, 0, ["audioPiano", "audioPads"]), this.playPiano(!0), this.playPads(!0), i.audioTimeout = setTimeout(t.bind(function() {
                    this.playPiano(!1), this.playPads(!1), this.setVolume(1, 0, ["audioPiano", "audioPads"])
                }, this), 50)
            },
            callPano: function(e) {
                this.setupViewer(), i.viewer.call(e)
            },
            setupViewer: function() {
                i.viewer || (i.viewer = document.getElementById("krpanoSWFObject"))
            },
            pauseVideo: function(e) {
                this.callPano("plugin[video].pause()"), e || n.ctrlPlayPause.addClass("ui-paused")
            },
            resumeVideo: function(e) {
                this.callPano("plugin[video].play()"), e || n.ctrlPlayPause.removeClass("ui-paused")
            },
            soundOff: function() {
                n.ctrlVolume.removeClass("playing"), i.viewer.call("muteVideo"), this.playPiano(!1), this.playPads(!1), this.playIntroMusic(!1)
            },
            soundOn: function(e) {
                n.ctrlVolume.addClass("playing"), "film" === e ? this.playFilmAudioMusic() : this.playExploreAudioMusic()
            },
            setVolume: function(i, o, r) {
                var s = [];
                t.each(r, function(e) {
                    s.push(n[e])
                }), e(s).animate({
                    volume: i
                }, o)
            },
            playFilmAudioMusic: function(e) {
               // this.playPiano(!0, e), this.playPads(!0, e), this.callPano("unMuteVideo")
            },
            playExploreAudioMusic: function(e) {
                //this.playPiano(!1, e), this.playPads(!0, e), this.callPano("unMuteVideo")
            },
            playIntroMusic: function(e, t) {
                //e ? n.audioIntro.play() : t ? n.audioIntro.pause() : this.setVolume(0, 1e3, ["audioIntro"])
            },
            playPiano: function(e, t) {
               // e ? (t ? n.audioPiano.currentTime = 0 : n.audioPiano.currentTime = n.audioPads.currentTime, n.audioPiano.play()) : n.audioPiano.pause()
            },
            playPads: function(e, t) {
               // e ? (t && (n.audioPads.currentTime = 0), n.audioPads.play()) : n.audioPads.pause()
            }
        };
    return o
}), 
define("app/MobileCheck", ["jquery"], function(e) {
    "use strict";
    var t = {
        init: function() {},
        checkMobile: function() {
            var e = !1;
            return function(t) {
                (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
            }(navigator.userAgent || navigator.vendor || window.opera), e
        },
        checkiPad: function() {
            var e = null != navigator.userAgent.match(/iPad/i);
            return e
        },
        checkAndroid: function() {
            var e = navigator.userAgent.toLowerCase(),
                t = e.indexOf("android") > -1;
            return t
        },
        checkIOS: function() {},
        checkMobileBreakpoint: function() {
            return e(window).width() < 790
        },
        checkTabletBreakpoint: function() {
            return e(window).width() < 1026
        },
        getChromeVersion: function() {
            var e = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            return e ? parseInt(e[2], 10) : !1
        }
    };
    return t
}), define("app/Nav", ["jquery", "app/MobileCheck", "app/Player"], function(e, t, n) {
    "use strict";
    var i = {
            navBtn: e("#nav-btn"),
            nav: e("#nav"),
            cta: e(".nav-content"),
            tempBlack: e(".bgNav"),
            mapBtn: e("#map-btn"),
            tutorial: e(".tutorial")
        },
        o = {
            navOpen: !1,
            isMobile: !1,
            navPause: !1
        },
        r = {
            init: function() {
                o.isMobile = t.checkMobile();
                var n = this;
                e(window).on("resize orientationchange", function() {
                    o.isMobile && n.checkForTutorialAndHideOrShowNav(), i.nav.css({
                        right: t.checkTabletBreakpoint() ? -1 * parseInt(i.nav.css("width")) : "inherit"
                    }), o.navOpen && t.checkTabletBreakpoint() && n.closeNav()
                }), e(window).trigger("resize"), i.cta.hover(function() {
                    e(this).addClass("active")
                }, function() {
                    e(this).removeClass("active")
                })
            },
            checkForTutorialAndHideOrShowNav: function() {
                console.log("CFT"), e(".tutorial-ready").length > 0 ? i.nav.css("visibility", "hidden") : i.nav.css("visibility", "visible")
            },
            getIsNavOpen: function() {
                return o.navOpen
            },
            toggleNav: function() {
                o.navOpen ? (this.closeNav(), n.resumeVideo(!0)) : (this.openNav(), n.pauseVideo(!0))
            },
            openNav: function() {
                i.nav.show(), o.navOpen = !0, t.checkTabletBreakpoint() ? (i.mapBtn.css("display", "none"), i.tempBlack.fadeIn(100), i.nav.stop().animate({
                    right: "0"
                }, 500), i.navBtn.addClass("close")) : i.nav.stop().animate({
                    bottom: "0"
                }, 325)
            },
            closeNav: function() {
                o.navOpen = !1, t.checkTabletBreakpoint() ? (e("body").hasClass("scenes") && i.mapBtn.css("display", "block"), i.tempBlack.fadeOut(100), i.navBtn.removeClass("close"), i.nav.stop().animate({
                    right: -1 * parseInt(i.nav.width())
                }, 500)) : i.nav.stop().animate({
                    bottom: -1 * parseInt(i.nav.height())
                }, 450)
            }
        };
    return r
}), define("app/Analytics", [], function() {
    "use strict";
    var e = {
        init: function() {},
        trackPageView: function(e) {
            window.ga("send", "pageview", {
                page: e,
                title: e
            })
        },
        trackEvent: function(e, t, n) {
            console.debug("dummy track " + e + " " + t + " " + n);
			//window.ga("send", "event", e, t, n)
        }
    };
    return e
}), define("app/Map", ["jquery", "app/Nav", "app/MobileCheck", "app/Analytics", "app/Player"], function(e, t, n, i, o) {
    "use strict";
    var r = {
            mapBtn: e("#map-btn"),
            listView: e("#list-view"),
            listViewThumb: e(".list-view-inner li"),
            tempBlack: e(".bgList"),
            navBtn: e("#nav-btn"),
            locationTitle: e("#location-title"),
            pano: e("#pano"),
            totalVisited: e("#total-visited")
        },
        s = {
            mapOpen: !1,
            totalVisited: [],
            currentMapType: "map",
            lastVisited: ""
        },
        a = {
            init: function() {
                var t = this;
                r.mapBtn.on("click", {}, e.proxy(this.onMapBtnClick, this)), r.listViewThumb.each(function(n) {
                    e(this).on("click", function() {
                        t.goToLocation(n)
                    })
                }), r.listViewThumb.hover(function() {
                    e(this).hasClass("active-visited") || e(this).find("p").stop().fadeOut(250)
                }, function() {
                    e(this).hasClass("active-scene") || e(this).find("p").stop().fadeIn(250)
                }), e(window).on("resize orientationchange", function() {
                    s.mapOpen || r.listView.css({
                        right: -1 * parseInt(r.listView.width()) + "px"
                    }), n.checkTabletBreakpoint() || r.tempBlack.hide(), r.listViewThumb.css({
                        width: r.listView.width() + "px",
                        height: parseInt(r.listView.width() / 1.33333333) + "px"
                    })
                }), e(window).trigger("resize")
            },
            showMapBtn: function() {
                r.mapBtn.show()
            },
            hideMapBtn: function() {
                r.mapBtn.hide()
            },
            goToLocation: function(t) {
                e("#audio-vo").get(0).pause();
                var n = parseInt(t) + 1,
                    i = "scene" + n;
                o.callPano("playScene(" + i + ")"), this.closeListViewMap()
            },
            setVisited: function(t) {
                if (t !== s.lastVisited) {
                    s.lastVisited = t;
                    var n = e("li." + t).find("span").text();
                    i.trackPageView(n), e("." + t).addClass("scene-visited"), r.pano.data("current-scene", t), -1 === e.inArray(t, s.totalVisited) && s.totalVisited.push(t);
                    var o = e("." + t).find("span").html();
                    r.locationTitle.html(o), r.listViewThumb.removeClass("active-scene").find("p").show(), e("." + t).addClass("active-scene").find("p").hide()
                }
            },
            updateVisitedCount: function() {
                r.totalVisited.html(s.totalVisited.length)
            },
            resetVisitedCount: function() {
                s.totalVisited = []
            },
            onMapBtnClick: function(e) {
                e.preventDefault(), t.getIsNavOpen && t.closeNav(), s.mapOpen ? (this.closeListViewMap(), o.resumeVideo(!0)) : (this.openListViewMap(), o.pauseVideo(!0))
            },
            openListViewMap: function() {
                s.mapOpen = !0, r.mapBtn.addClass("map-open"), r.listView.css("z-index", 100), r.listView.animate({
                    right: "0"
                }, 350, function() {}), n.checkTabletBreakpoint() && r.tempBlack.fadeIn(), r.navBtn.css("display", "none")
            },
            closeListViewMap: function(e) {
                s.mapOpen = !1, r.mapBtn.removeClass("map-open"), r.listView.animate({
                    right: -1 * r.listView.width()
                }, 350, e), n.checkTabletBreakpoint() && r.tempBlack.fadeOut(), r.navBtn.css("display", "")
            }
        };
    return a
}), define("app/Hotspots", ["jquery", "lodash", "app/Map", "app/Analytics", "app/VideoPlayer", "app/Player", "slick"], function(e, t, n, i, o, r) {
    "use strict";
    var s = {
            hotspot: e("#modal"),
            hotspotContainer: "#overlay-div", //hotspot-container",
            hotspotContent: "#hotspot-content",
            hotspotClose: e(".hotspot-close"),//.hotspot-close"),
            body: e("body"),
            pano: e("#pano"),
            audio: e("#audio-vo").get(0),
            audioId: "#audio-vo",
            sideLocationName: e("#sideLocationName"),
            sideFact: e("#sideFact"),
            sideNum: e("#sideNum"),
            galleryContainer: "#slides",
            galleryItem: ".gallery-item",
            videoItem: "#hotspot-video",
            listViewItems: e(".list-view-inner li")
        },
        a = {
            infinite: !1,
            speed: 500,
            appendArrows: ".hotspot-media"
        },
        l = {
            videoStoppedSound: !1
        },
        u = {
            init: function() {
                var t = this;
                s.hotspot.on("click", {}, function(n) {
                    var i = !0;
                    (e(n.target).is(s.hotspotContent) || e("#hotspot-content").has(e(n.target)).length > 0) && (i = !1), i && t.closeOverlay()
                }), s.hotspotClose.on("click", {}, e.proxy(this.closeOverlay, this)), e(document).keyup(function(e) {
                    (27 === e.keyCode || 27 === e.which) && t.closeOverlay()
                }), this.setupVideo()
            },
            clicked: function(e, t, o) {
                //var r = parseInt(t) - 1;
                //isNaN(r) ? "true" === o ? this.playAudio(e) : this.openOverlay(e) : n.goToLocation(r);
				this.openOverlay(e);
                //var a = e.split("_"),
                //    l = a[0].split("scene");
                //l = l[1];
                //var u = a[1].split("hotspot");
                //u = u[1], s.sideLocationName.html(this.getLocationName(l) + "_"), s.sideFact.html(this.getFact(l)), s.sideNum.html(this.getNum(l, u)), i.trackPageView(this.getLocationName(l) + " - " + e)
            },
            openOverlay: function(e) {
				//$(".actionButton").addClass(action);
				hideMap();
				$("#blocker").show();
				$( "#blocker .top-line" ).animate({
					width: '100%'
				  }, 500, function() {
					$( "#blocker .right-line" ).animate({
						height: '100%'
					  }, 500, function() {
						// Animation complete.
					  });
				  });
				$("#overlay").fadeIn(2000);
				$("#overlay > div").animate({top: 0},1000);
				r.callPano("disableHotspots");
				//s.hotspot.fadeIn(150);
				s.body.addClass("hotspot-open");
				this.getContent(e);
				r.pauseVideo(!0);
            },
            closeOverlay: function() {
                var t = s.pano.data("current-scene");
				//$(".actionButton").removeClass(currentAction);
				$("#overlay").hide();
				$("#blocker").hide();
				$( "#blocker .top-line" ).css('width', '0%');
				$( "#blocker .right-line" ).css('height', '0%');
				$("#overlay > div").css("top",200);
				//currentAction = "";
				// stop all videos
                r.callPano("enableHotSpots(" + t + ")"), s.body.removeClass("hotspot-open"), s.hotspot.fadeOut(150), e(s.hotspotContainer).empty(), r.resumeVideo(!0), l.videoStoppedSound && (r.soundOn(), l.videoStoppedSound = !1)
            },
            checkOrientation: function() {
                return -90 === window.orientation || 90 === window.orientation ? "landscape" : "portrait"
            },
            setupVideo: function(t) {
                var n = this;
                e(s.videoItem).length > 0 && (o.init(s.videoItem), e(s.videoItem).on("play", function() {
                    i.trackEvent("Hotspot Video", "Watched", t), l.videoStoppedSound = !0, r.soundOff(), n.stopAudio()
                }))
            },
            setupGallery: function() {
                //e(s.galleryItem).length > 1 && (e(s.galleryContainer).slick(a), e(".gallery-item-caption").each(function() {
                //    "" === e(this).text() && e(this).hide()
                //}))
				$(s.galleryContainer).slidesjs({
					width: 500,
					height: 250,
					navigation: false
				});
				
            },
            removeGallery: function() {
                "object" == typeof s.galleryContainer.getSlick() && s.galleryContainer.unslick()
            },
            getContent: function(t) {
                var n = "content/" + t + ".html",
                    i = this;
                e(s.hotspotContainer).empty().load(n, function(n, o) {
                    "error" === o ? e(s.hotspotContainer).html("<h1>&nbsp;</h1><br><br><h2>PLACEHOLDER:<Br>Content not approved.</h2>") : (i.setupVideo(t), i.setupGallery())
                })
            },
            playAudio: function(t) {
                var n = "sounds/vo/" + t + ".mp3";
                s.audio.src = n, e(s.audioId).get(0).load(), e(s.audioId).get(0).play(), e(s.audioId).on("ended", function() {
                    r.callPano("setSoundIconOff(" + t + "_playing)")
                })
            },
            stopAudio: function() {
                e(s.audioId).get(0).pause(), e(s.audioId).off("ended")
            },
            getLocationName: function(e) {
                var t = parseInt(e) - 1,
                    n = s.listViewItems.eq(t).find("span").html();
                return n
            },
            getFact: function(e) {
                var t = ["Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder", "Placeholder"],
                n = parseInt(e) - 1;
                return t[n]
            },
            getNum: function(e, t) {
                var n = ["0", "6", "11", "18", "21", "25", "29", "34", "41", "44", "47", "50", "51", "53", "57", "60", "63", "67", "70"],
                    i = parseInt(e) - 1;
                return parseInt(n[i]) + parseInt(t)
            }
        };
    return u
}), define("app/USYTour", ["jquery", "app/Player", "app/MobileCheck", "app/Nav", "app/Map", "app/Hotspots", "app/Analytics", "lodash"], function(e, t, n, i, o, r, s) {
    "use strict";
    var a = {
            body: e("body"),
            homepageOuter: e("#homepage"),
            homepage: e(".homepage-inner"),
            homepageBg: e(".homepage-bg"),
            introVid: e("#introVid"),
            intro: e("#intro"),
            ctrlFsIntro: e("#fs-intro"),
            introFallback: e("#intro-fallback"),
            introPoster: e("#intro-poster"),
            btnStart: e("#btnStart"),
            btnExplore: e("#btnExplore"),
            introBtn: e("#homepage .link"),
            navBtn: e("#nav-btn"),
            nav: e("#nav"),
            loading: e("#loading"),
            pano: e("#pano"),
            hint: e("#location-hint"),
            locationTitle: e("#location-title"),
            finalFrame: e("#final-frame"),
            replayBtn: e(".btn-replay"),
            videoControls: e("#video-controls"),
            footerTrigger: e(".footer-trigger"),
            ctrlPlayPause: e(".control-play-pause"),
            ctrlReset: e(".control-reset"),
            ctrlGyro: e(".control-gyroscope"),
            ctrlVolume: e(".control-sound"),
            ctrlFullscreen: e(".control-fullscreen"),
            audioDrums: e("#audio-drums").get(0),
            playHint: e(".play-hint"),
            tutorial: e(".tutorial"),
            btnSkipTutrial: e(".btn-skip-tutorial"),
            cursorHint: e("#cursor-hint"),
            btnMobile: e(".btn-mobile"),
            btnMobileStart: e("#btn-mobile-start"),
            loadingStatus: e("#status"),
            loadingProgress: e("#progress"),
            loadingContent: e("#loading-content"),
            degrees: e(".degrees"),
            degreesStatusH: e("#degrees-horiz-left, #degrees-horiz-right"),
            degreesStatusV: e("#degrees-status-vert"),
            socialLinks: e(".fb, .tw")
        },
        l = {
            xmlFile: "tour.xml",
            hidden: "hidden",
            visibilityChange: "visibilitychange",
            debug: null,
            capability: null,
            viewer: null,
			
			hlookat: null,
			vlookat: null,
			video: null,
			time: null,
			
            currentOrientation: null,
            initiated: !1,
            fullscreen: !1,
            currentType: null,
            loadingDone: !1,
            currentFilmTime: 0,
            lastLoadedPercentage: 0,
            loadingTicks: 0,
            vidCanPlayThrough: !1,
            introCompleted: !1,
            filmComplete: !1,
            tutorialComplete: !1,
            gyro: !0,
            isMobile: !1,
            isiPad: !1,
            isAndroid: !1,
            hasFlash: !1,
            hasWebGL: !1,
            mapOpen: !1,
            muted: !1,
            userMuted: !1,
            paused: !1,
            timeoutPlayHint: null,
            videoSeekToggled: !1,
            mouseTimeout: null,
            notSupportedDesktopMsg: "Your browser does not support <b>WebGL</b>. <br>Please load up this experience in the latest version of Chrome or Firefox. Alternitavely, <a href='https://get.adobe.com/flashplayer/'>download and install Adobe's Flash Player</a>.",
            notSupportedMobileMsg: "Your device does not support <b>WebGL</b>.<br>This experiecne requires iOS 8.0 and above or Android Chrome 40 and above."
        },
        u = {
            // filmHD: "videos/video_720.mp4",
            // filmSD: "videos/video_480.mp4",
            // filmLD: "videos/video_360.mp4",
            // filmLLD: "videos/video_360.mp4",
            // intro: "videos/intro.mp4",
            // filmMP3: "videos/video_sound.mp3"

            // filmHD: "../videos/innovation-foyer-4096x2048.mp4",
            // filmSD: "../videos/innovation-foyer-4096x2048.mp4",
            // filmLD: "../videos/innovation-foyer-4096x2048.mp4",
            // filmLLD: "../videos/innovation-foyer-4096x2048.mp4",
            // intro: "../videos/unsw-demo-4096x2048.mp4",            
            // filmMP3: "../sounds/introloop.mp3"            

            filmHD: "../videos/video_720.mp4",
            filmSD: "../videos/video_480.mp4",
            filmLD: "../videos/video_360.mp4",
            filmLLD: "../videos/video_360.mp4",
            intro: "../videos/intro.mp4",
            filmMP3: "../videos/video_sound.mp3"
        },
        c = {
            speedCheckComplete: function(t) {
                var n;
                if (t) {
                    var i = Math.ceil(parseInt(t));
                    n = i >= 30 ? u.filmHD : i > 7 && 30 > i ? u.filmSD : u.filmLD
                } else n = u.filmLD;
                this.loadPano(n, u.intro);
                var o = n.split("videos/index.html");
                l.debug && e("#debug").show().append("<i>Speed:</i> " + t + "Mbps <br><i>File:</i> " + o[1])
            },
            init: function(t) {
                l.hlookat = this.getParameterByName("hlookat") ? this.getParameterByName("hlookat") : 0;	
				l.vlookat = this.getParameterByName("vlookat") ? this.getParameterByName("vlookat") : 0;
				l.video = this.getParameterByName("video") ? this.getParameterByName("video") : null;
				l.time = this.getParameterByName("time") ? this.getParameterByName("time") : null;
 
				l.isMobile = n.checkMobile(), l.isiPad = n.checkiPad(), l.hasFlash = t.flash, l.hasWebGL = t.webgl, l.isAndroid = n.checkAndroid(), e("html").addClass(l.isMobile ? "touch" : ""), l.debug = this.getParameterByName("debug") ? !0 : !1, l.forceFail = this.getParameterByName("fail") ? !0 : !1, l.debug && (l.allInstrunctionsSeen = !0), "undefined" != typeof document.hidden ? (l.hidden = "hidden", l.visibilityChange = "visibilitychange") : "undefined" != typeof document.mozHidden ? (l.hidden = "mozHidden", l.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.msHidden ? (l.hidden = "msHidden", l.visibilityChange = "msvisibilitychange") : "undefined" != typeof document.webkitHidden && (l.hidden = "webkitHidden", l.visibilityChange = "webkitvisibilitychange"), l.debug && e("#debug").show().html("Chrome: " + n.getChromeVersion() + "<hr>")
            },
            addCustomCursor: function(e) {
                var t = "custom-cursor";
                l.isMobile || ("true" === e.toString() ? a.pano.addClass(t) : a.pano.removeClass(t))
            },
            loadPano: function(e, t) {
                var n = this,
                    i = l.xmlFile;
                if (this.detectKrpanoCapabilities()) l.capability = this.detectKrpanoCapabilities(), window.embedpano({
                    swf: "./viewer/krpano.swf",
                    xml: i,
                    target: "pano",
                    html5: n.detectKrpanoCapabilities(),
                    passQueryParameters: !0,
                    initvars: {
                        filmvideo: e,
                        introvideo: t,
                        filmvideo_mobile: "",
                        introvideo_mobile: u.introLD
                    },
                    onready: function(e) {                        
                        n.focusPano(), n.loadExperience(e)
                    }
                });
                else {
                    s.trackPageView("Fallback");
                    var o = "Oops, please update your operating system",
                        r = 'It looks like you\'re using an old operating system. To get the most out of this 360&deg; experience, you need to update your device.';
                    l.isMobile && (l.isAndroid && (o = "Oops, please update Google Chrome.", r = "It looks like there’s a problem with this version of Google Chrome. To get the most out of this 360º experience, you need to update your browser. You'll need Chrome Beta. Please download from the Chrome Store to continue."), a.introFallback.find("#fallback-heading").html(o), a.introFallback.find("#fallback-copy").html(r)), a.intro.addClass("fallback-open").find(".intro-loading").hide(), a.introFallback.show(), a.ctrlFsIntro.hide()
                }
            },
            focusPano: function() {
                window.activekrpanowindow = "krpanoSWFObject", document.getElementById("krpanoSWFObject").focus()
            },
            detectKrpanoCapabilities: function() {
                var e;
                return e = l.hasWebGL ? l.isAndroid && n.getChromeVersion() < 44 ? !1 : "prefer" : l.isMobile ? !1 : l.hasFlash ? "never" : !1, l.forceFail && (e = !1), e
            },
            loadExperience: function(t) {
                var n = this,
                    o = l.debug ? 100 : 2e3;
                t && (l.viewer = t, setTimeout(function() {
                    n.startExperience()
                }, o)), e(window).on("orientationchange", {}, e.proxy(this.getAndSetOrientation, this)), e(document).keyup(function(e) {
                    (32 === e.keyCode || 32 === e.which) && (e.preventDefault(), n.focusPano(), l.tutorialComplete && (n.saveFilmSpot(), i.closeNav(), n.flipMode()))
                }), a.introBtn.on("click", {}, e.proxy(this.onIntroBtnClick, this)), a.navBtn.on("click", {}, e.proxy(this.onNavBtnClick, this)), a.replayBtn.on("click", {}, e.proxy(this.onReplayClick, this)), a.ctrlReset.on("click", {}, e.proxy(this.resetCameraPOV, this)), a.ctrlPlayPause.on("click", {}, e.proxy(this.togglePauseVideo, this)), a.ctrlGyro.on("click", {}, e.proxy(this.toggleGyro, this)), a.ctrlVolume.on("click", {}, e.proxy(this.toggleSound, this)), a.ctrlFullscreen.on("click", {}, e.proxy(this.toggleFullscreen, this)), a.ctrlFsIntro.on("click", {}, e.proxy(this.toggleFullscreen, this)), a.btnSkipTutrial.on("click", {}, e.proxy(this.skipTutorialAndStartFilm, this)), a.socialLinks.on("click", function(t) {
                    t.preventDefault();
                    var n = e(this).attr("href"),
                        i = 800,
                        o = 600,
                        r = screen.width / 2 - i / 2,
                        s = screen.height / 2 - o / 2;
                    window.open(n, "social", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + i + ", height=" + o + ", top=" + s + ", left=" + r)
                }), a.footerTrigger.on("mouseenter", {}, e.proxy(this.onVideoControlsMouseIn, this)), a.nav.on("mouseenter", {}, e.proxy(this.onVideoControlsMouseIn, this)), a.footerTrigger.on("mouseleave", {}, e.proxy(this.onVideoControlsMouseOut, this)), a.nav.on("mouseleave", {}, e.proxy(this.onVideoControlsMouseOut, this)), e(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", {}, e.proxy(this.fullScreenHandler, this)), !l.isMobile, e(document).on(l.visibilityChange, {}, e.proxy(this.handleVisibilityChange, this)), window.addEventListener("idleViewStart", function() {
                    a.hint.find(".hint").parent().addClass("reveal")
                }), window.addEventListener("idleViewEnd", function() {
                    a.hint.find(".hint").parent().removeClass("reveal")
                }), this.getAndSetOrientation()
            },
            onSocialLinkClick: function() {},
            flipMode: function() {
                var e = a.body.hasClass("hotspot-open") ? !0 : !1;
                !l.initiated || l.filmComplete || e || ("film" === l.currentType ? this.doExplore() : this.doFilm())
            },
            startExperience: function() {
                l.debug && this.showHomepage(), 
				a.intro.find("h2").fadeOut(100), 
				t.playIntroMusic(!0), 
				l.isMobile ? 
					(a.intro.addClass("intro-mobile-load"), 
					this.showHomepage(), 
					a.introPoster.show()) 
					: 
					(a.introPoster.fadeOut(), 
					t.callPano("loadscene(intro, null, IGNOREKEEP)"), 
					t.callPano("moveCameraTo("+l.hlookat+", "+l.vlookat+")"),
					a.intro.fadeOut(1500, function() {
						a.homepageOuter.fadeIn()
					}))
            },
            playIntroVideo: function() {
                a.introVid.get(0).play()
            },
            showHomepage: function() {
                a.homepage.fadeIn(), l.introCompleted = !0
            },
            showHint: function(e) {
                var t = l.isMobile ? "" : "<p>Press",
                    n = t + " pause to explore this scene</p>",
                    i = t + " play to resume film</p>";
                a.hint.find(".hint").html("film" === e ? n : i), "explore" === e ? a.hint.addClass("explore") : a.hint.removeClass("explore")
            },
            onHintClick: function(t) {
                this.focusPano(), this.saveFilmSpot(), i.closeNav(), e(t.target).hasClass("explore") ? this.doFilm() : this.doExplore()
            },
            getAndSetOrientation: function() {
                switch (window.orientation) {
                    case -90:
                    case 90:
                        l.currentOrientation = "landscape";
                        break;
                    default:
                        l.currentOrientation = "portrait"
                }
                var e = a.body.hasClass("hotspot-open") ? !0 : !1;
                l.isMobile && s.trackEvent("Events", "Triggered", "User Turned Device " + l.currentOrientation), !l.initiated || l.filmComplete || e || (l.tutorialComplete ? this.triggerOrientation(l.currentOrientation) : (this.showPlayPauseBtn(!1), 90 === window.orientation || -90 === window.orientation ? (t.callPano("disableHotspots"), this.enableLocationControls(!1)) : t.callPano("enableHotSpots(scene1)")))
            },
            triggerOrientation: function(e) {
                this.saveFilmSpot();
                var n, i, o = this;
                t.pauseVideo(), "landscape" === e ? (clearTimeout(n), n = setTimeout(function() {
                    o.doFilm()
                }, 850)) : (clearTimeout(i), i = setTimeout(function() {
                    o.doExplore()
                }, 850))
            },
            doFilm: function(n, i) {
                l.currentType = "film", t.callPano("playFilm"), s.trackPageView("Film"), a.ctrlPlayPause.removeClass("ui-paused"), this.enableLocationControls(!1), n || t.callPano("plugin[video].seek(" + l.currentFilmTime + ")"), i && t.callPano("startautopan"), e("#audio-vo").get(0).pause(), l.muted || t.playFilmAudioMusic(n), l.filmComplete && this.filmEnded(), this.toggleBodyClass(l.currentType)
            },
            doExplore: function(e) {
                t.resumeVideo(), l.currentType = "scenes", t.callPano("checkAndPlayRightScene"), a.ctrlPlayPause.addClass("ui-paused"), this.enableLocationControls(e === !1 ? !1 : !0), e !== !1 && (clearTimeout(l.timeoutPlayHint), a.playHint.hide()), l.muted || t.playExploreAudioMusic(), l.filmComplete && this.filmEnded(), this.toggleBodyClass(l.currentType)
            },
            enableLocationControls: function(e) {
                this.slideUpScrubberControls("down"), this.showPlayPauseBtn(!0), a.body.hasClass("hotspot-open") && r.closeOverlay(), e ? (o.closeListViewMap(), o.showMapBtn(), this.showHint("explore"), this.doDegrees(!0), a.locationTitle.fadeIn(150)) : (o.closeListViewMap(), o.hideMapBtn(), this.showHint("film"), this.doDegrees(!1), a.locationTitle.fadeOut(150))
            },
            onVideoControlsMouseIn: function() {
                n.checkTabletBreakpoint() || (clearTimeout(l.mouseTimeout), this.slideUpScrubberControls("up"))
            },
            onVideoControlsMouseOut: function() {
                var e = this;
                n.checkTabletBreakpoint() || (clearTimeout(l.mouseTimeout), l.mouseTimeout = setTimeout(function() {
                    e.slideUpScrubberControls("down")
                }, 3e3))
            },
            slideUpScrubberControls: function(e) {
                var n, o;
                "up" === e ? (i.openNav(), a.videoControls.addClass("nav-open"), "film" === l.currentType ? (t.callPano("videointerface_lift_interface_up"), n = "58px") : (t.callPano("videointerface_hide_interface"), n = "50px"), o = 300) : (i.closeNav(), n = "0", a.videoControls.removeClass("nav-open"), "film" === l.currentType ? t.callPano("videointerface_show_interface") : t.callPano("videointerface_hide_interface"), o = 500), a.videoControls.stop().animate({
                    bottom: n
                }, o)
            },
            toggleBodyClass: function(e) {
                a.body.removeClass(), a.body.addClass(e)
            },
            saveFilmSpot: function() {
                "film" === l.currentType && (l.currentFilmTime = l.viewer.get("plugin[video].time"))
            },
            showLoadingProgress: function(t, n) {
                var i = Math.floor(parseInt(t) / parseInt(n) * 100),
                    o = l.isAndroid ? "<span>Start</span>" : "<span>Loading&hellip;</span>";
                if (l.isAndroid && isNaN(i) ? e("#btn-mobile-start-android").show() : e("#btn-mobile-start-android").hide(), a.loadingStatus.html(isNaN(i) ? o : i + "%"), a.loadingProgress.css({
                        width: i + "%"
                    }), l.debug && "never" !== l.capability) {
                    var r = l.viewer.get("plugin[video]").videoDOM;
                    console.log(t + " / " + n), console.dir(r), e("#status2").show(), e("#statready").html("Ready state: " + r.readyState + "<br>Network state: " + r.networkState), e("#statpause").html("<b>seeking: " + r.seeking + "</b>"), e("#statseek").html("<b>paused: " + r.paused + "</b>"), e("#statix").html("<b>ticks: " + l.loadingTicks + "</b>")
                }
            },
            loadingDone: function() {
                l.loadingDone = !0, l.isMobile ? l.isiPad || l.isAndroid ? this.loadingDoneBegin360() : this.loadingDoneShowMobileTrigger() : this.loadingDoneBegin360()
            },
            loadingDoneBegin360: function() {
                var e = this;
                a.loadingProgress.css({
                    position: "fixed",
                    top: a.loadingProgress.offset().top + "px",
                    width: "100%"
                }), a.loadingProgress.animate({
                    top: "0",
                    height: "100%"
                }, 300, function() {
                    l.initiated = !0, e.doLoading(!1), e.focusPano(), e.showTutorialScreens(), l.isMobile ? t.playIntroMusic(!1, !0) : (t.playIntroMusic(!1), e.addCustomCursor(!0))
                })
            },
            showTutorialScreens: function() {
                a.tutorial.addClass("tutorial-ready"), t.callPano("startautopan_tut"), this.doExplore(!1)
            },
            skipTutorialAndStartFilm: function() {
                var t = this;
                a.tutorial.addClass("tutorial-complete"), s.trackEvent("Buttons", "Click", "Skip Tutorial & Start"), !l.isMobile, setTimeout(function() {
                    l.tutorialComplete = !0, t.doFilm(!0, !0), o.resetVisitedCount(), l.isMobile || a.videoControls.show(), a.navBtn.addClass("show-nav-btn"), a.hint.show(), a.playHint.show(), setTimeout(function() {
                        a.tutorial.fadeOut(200, function() {
                            e(this).remove()
                        })
                    }, 500)
                }, 1e3), l.timeoutPlayHint = setTimeout(function() {
                    a.playHint.fadeOut()
                }, 1e4)
            },
            loadingDoneShowMobileTrigger: function() {
                a.loadingStatus.html("Ready"), a.loadingProgress.animate({
                    width: "100%"
                }, 150, function() {
                    setTimeout(function() {
                        a.loadingContent.addClass("done")
                    }, 500)
                }), a.btnMobileStart.on("click", {}, e.proxy(this.onBtnMobileStartClick, this))
            },
            beginLoadingExperience: function() {
                a.introBtn.remove(), t.callPano("loadscene(experience, null, IGNOREKEEP)"), l.debug && console.log("load scene"), a.homepage.fadeOut(500), a.introPoster.fadeOut(500), a.intro.remove(), a.introVid.remove(), a.homepageOuter.remove(), this.doLoading(!0);
                var e, n, i, o = this,
                    r = setInterval(function() {
                        e = l.viewer.get("plugin[video].loadedBytes"), n = l.viewer.get("plugin[video].totalBytes"), i = Math.floor(parseInt(e) / parseInt(n) * 100), o.showLoadingProgress(e, n), l.lastLoadedPercentage === i ? l.loadingTicks++ : l.loadingTicks = 0, l.lastLoadedPercentage = i, l.loadingTicks > 30 && (i = e = 100), i > 90 && (clearInterval(r), o.loadingDone())
                    }, 500);
                s.trackPageView("Loading")
            },
            onIntroBtnClick: function() {
                if (l.isMobile && (l.isiPad || t.initAudio()), a.body.removeClass("intro"), s.trackEvent("Buttons", "Click", "Intro - Start Experience"), l.viewer) {
                    var n = this;
                    l.isMobile ? n.beginLoadingExperience() : (a.introBtn.clone().empty().insertAfter(".btnFilm").addClass("modalBtn"), e(".modalBtn").css({
                        top: parseInt(a.introBtn.offset().top) + "px",
                        left: parseInt(a.introBtn.offset().left) + "px"
                    }), e(".modalBtn").animate({
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    }, 200, function() {
                        e(".modalBtn").remove(), n.beginLoadingExperience()
                    }))
                }
            },
            onBtnMobileStartClick: function() {
                var t = this;
                l.isMobile ? t.loadingDoneBegin360() : (a.btnMobileStart.clone().empty().insertAfter("#loading-content").addClass("modalBtn"), e(".modalBtn").css({
                    top: parseInt(a.btnMobileStart.offset().top) + "px",
                    left: parseInt(a.btnMobileStart.offset().left) + "px"
                }), e(".modalBtn").animate({
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                }, 250, function() {
                    e(".modalBtn").remove(), t.loadingDoneBegin360()
                }))
            },
            filmEnded: function() {
                l.debug && (console.log("tutorialComplete : " + l.tutorialComplete), console.log("filmComplete : " + l.filmComplete)), !l.filmComplete && l.tutorialComplete ? (s.trackPageView("Film End Frame"), s.trackEvent("Video", "Watched", "100%"), o.updateVisitedCount(), a.finalFrame.fadeIn(), l.filmComplete = !0, l.isMobile ? t.playPiano(!1) : t.setVolume(0, 1500, ["audioPiano"])) : (l.filmComplete = !1, l.debug && console.warn("Forced to set filmComplete to FALSE"))
            },
            filmHalfway: function() {
                s.trackEvent("Video", "Watched", "50%")
            },
            doLoading: function(e) {
                e ? (a.ctrlFsIntro.remove(), a.loading.show(), a.body.addClass("loading")) : (a.loading.fadeOut(), a.body.removeClass("loading"))
            },
            onNavBtnClick: function(e) {
                e.preventDefault(), i.toggleNav(), o.closeListViewMap()
            },
            onReplayClick: function() {
                s.trackEvent("Buttons", "Click", "Replay Button"), this.resetCameraPOV(!0), l.filmComplete = !1, l.currentFilmTime = 0, a.finalFrame.hide(), o.closeListViewMap(), i.closeNav(), t.setVolume(1, 100, ["audioPiano", "audioPads"]), this.doFilm(!0)
            },
            togglePauseVideo: function() {
                s.trackEvent("Buttons", "Clicks", "Play/Pause - Main"), e.event.trigger({
                    type: "keyup",
                    which: 32,
                    keyCode: 32
                })
            },
            resetCameraPOV: function() {
                t.callPano("moveCameraTo(0, 0)")
            },
            toggleSound: function() {
                s.trackEvent("Buttons", "Click", "Toggle Mute"), l.muted ? (l.userMuted = !1, l.muted = !1, t.soundOn()) : (l.userMuted = !0, l.muted = !0, t.soundOff())
            },
            toggleFullscreen: function() {
                s.trackEvent("Buttons", "Click", "Toggle Fullscreen"), l.fullscreen ? (l.fullscreen = !1, this.closeFullScreen()) : (l.fullscreen = !0, this.openFullScreen())
            },
            openFullScreen: function() {
                a.ctrlFullscreen.addClass("fullscreen"), a.ctrlFsIntro.addClass("fullscreen");
                var e = document.documentElement;
                e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen && e.msRequestFullscreen()
            },
            closeFullScreen: function() {
                a.ctrlFullscreen.removeClass("fullscreen"), a.ctrlFsIntro.removeClass("fullscreen"), document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()
            },
            showPlayPauseBtn: function(e) {
                e ? a.videoControls.find("li").show() : a.videoControls.find("li").hide()
            },
            getParameterByName: function(e) {
                e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var t = new RegExp("[\\?&]" + e + "=([^&#]*)"),
                    n = t.exec(location.search);
                return null === n ? "" : decodeURIComponent(n[1].replace(/\+/g, " "))
            },
            doDegrees: function(e) {
                e ? a.degrees.addClass("reveal") : a.degrees.removeClass("reveal")
            },
            showDeg: function(e, t) {
                var n = parseInt(e) / 360 * 100;
                a.degreesStatusH.css({
                    "background-position": 4 * n + "% 0"
                }), a.degreesStatusV.css({
                    "background-position": 4 * n + "% bottom"
                }), a.degreesStatusH.find("span").html(parseFloat(e).toFixed(2) + "&deg;"), a.degreesStatusV.find("span").html(parseFloat(t).toFixed(2) + "&deg;")
            },
            fullScreenHandler: function() {},
            handleVisibilityChange: function() {
                var e = a.body.hasClass("intro"),
                    n = a.body.hasClass("loading");
                document[l.hidden] ? e || n ? t.playIntroMusic(!1, !0) : (t.pauseVideo(!0), t.soundOff()) : e ? (t.playIntroMusic(!0), l.introCompleted || t.resumeVideo(!0)) : n ? t.playIntroMusic(!0) : (t.resumeVideo(!0), l.userMuted || t.soundOn(l.currentType))
            }
        };
    return c
}), define("app/SpeedCheck", ["jquery", "app/USYTour", "lodash"], function(e, t) {
    "use strict";
    var n = {
            imageAddr: "http://usy-360video-stage.monkeylabs.com.au/img/thumbs.jpg",
            downloadSize: 14e5
        },
        i = {
            measureConnectionSpeed: function() {
                var i, o, r = new Image,
                    s = this;
                i = (new Date).getTime();
                var a = "?nnn=" + i;
                r.src = n.imageAddr + a, e(r).load(function() {
                    o = (new Date).getTime();
                    var e = s.showResults(i, o);
                    t.speedCheckComplete(e)
                }), e(r).error(function() {
                    t.speedCheckComplete(!1)
                })
            },
            showResults: function(e, t) {
                var i = (t - e) / 1e3,
                    o = 8 * n.downloadSize,
                    r = (o / i).toFixed(2),
                    s = (r / 1024).toFixed(2),
                    a = (s / 1024).toFixed(2);
                return a
            }
        };
    return i
});
