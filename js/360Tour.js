
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
	
});

function startWithParameters(v) {

	if ((hlookat != 0) || (vlookat != 0) || (time != 0)) {
		callPano("moveCameraTo("+hlookat+", "+vlookat+");");
		callPano("set(plugin[video].pausedonstart, true);");
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