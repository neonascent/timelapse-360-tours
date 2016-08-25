
var currentAction = "";

// function showOverlay (overlayHTML, action) {
  
  	// hideMap();
	// $(".annotation-paragraph").hide();
	// $(".actionButton").addClass(action);
	// $("#blocker").show();
	// $( "#blocker .top-line" ).animate({
		// width: '100%'
	  // }, 500, function() {
		// $( "#blocker .right-line" ).animate({
			// height: '100%'
		  // }, 500, function() {
		////	Animation complete.
		  // });
	  // });
	// $("#overlay-div").html(overlayHTML);
	// $("#overlay").fadeIn(2000);
	// $("#overlay > div").animate({top: 0},1000);
	// currentAction = action;
	// if (!($(".valiantPhoto video").get(0).paused)) {
		// $(".valiantPhoto video").get(0).pause();
		// playVideo = true;
	// } else {
		// playVideo = false;
	// }
// }

// function hideOverlay () {
	// $(".annotation-paragraph").show();
	// $(".actionButton").removeClass(currentAction);
	// $("#overlay").hide();
	// $("#blocker").hide();
	// $( "#blocker .top-line" ).css('width', '0%');
	// $( "#blocker .right-line" ).css('height', '0%');
	// $("#overlay > div").css("top",200);
	// currentAction = "";
	////stop all videos
	// $(".video video").each( function() {
		// $(this).get(0).pause();
	// });
	// if (playVideo) {
		// $(".valiantPhoto video").get(0).play();
	// }
// }

var hlookat = null;
var vlookat = null;
var video = null;
var time = null;
var viewer = null;
var fov = null;

$(document).ready(function () {
	// implemented in app.js
	
	
	// $("#closeOverlay").click(function () {
		// hideOverlay();
	// });
	
	// $("#blocker").click(function () {
		// hideOverlay();
	// });


	hlookat = getParameterByName("hlookat") ? getParameterByName("hlookat") : 0;	
	vlookat = getParameterByName("vlookat") ? getParameterByName("vlookat") : 0;
	video = getParameterByName("video") ? getParameterByName("video") : null;
	time = getParameterByName("time") ? getParameterByName("time") : 0;
	fov = getParameterByName("fov") ? getParameterByName("fov") : 90;
	
	// start tracking
	initTracking();
	
	// preload share image
	preload(['images/share-icons.png']);
	
	// close share window
	$( ".btnCloseShare" ).click(function() {
	  $( "#share" ).fadeOut(200);
	  callPano("endShare();");
	});
});

function initTracking() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-1226844-19', 'auto');
  ga('send', 'pageview');
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

function hideStartBox() {
	$( "#intro-poster" ).fadeOut(1000);
	$( "#intro-logos" ).fadeOut(1000);
	$( "#intro" ).fadeOut(200);
}

function showShare() {
	$( "#share" ).fadeIn(200);
	ga('send', 'event', {
		eventCategory: 'Tour',
		eventAction: 'share',
		eventLabel: location.href
	});
}

function startWithParameters(v) {

	if ((hlookat != 0) || (vlookat != 0) || (time != 0)) {
		callPano("moveCameraTo("+hlookat+", "+vlookat+");");
		callPano("set(plugin[video].pausedonstart, true);");
	} 
	
	if (fov != 90) {
		callPano("set(view.fov, "+ fov + ")");
	}
	
	if (video !== null) {
		callPano("videointerface_play('"+video+"',"+time+");");
	} else {
		callPano("videointerface_play('"+v+"',"+time+");");
	}
}

function setupViewer() {
	viewer || (viewer = document.getElementById("krpanoSWFObject"));
}

function callPano(e) {
	setupViewer(), viewer.call(e);
}
	
function getParameterByName(e) {
	e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var t = new RegExp("[\\?&]" + e + "=([^&#]*)"),
		n = t.exec(location.search);
	return null === n ? "" : decodeURIComponent(n[1].replace(/\+/g, " "))
}

function showMap() {
	//hideOverlay();
	$(".map").fadeIn(1000);
	$(".mapButton").addClass('hoverState');
	$( ".map .top-line" ).animate({
		width: '100%'
	  }, 500, function() {
		$( ".map .right-line" ).animate({
			height: '100%'
		  }, 500, function() {
			// Animation complete.
		  });
	  });
}

var mapShown = false;