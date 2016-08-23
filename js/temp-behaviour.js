
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

$(document).ready(function () {
	// implemented in app.js
	
	
	// $("#closeOverlay").click(function () {
		// hideOverlay();
	// });
	
	// $("#blocker").click(function () {
		// hideOverlay();
	// });
		
	$(".mapButton").click(function () { // This makes annotation a0 show example_iFrame.html when clicked.
		 toggleMap();
	});
	
});

function toggleMap() {
	if (mapShown) {
		hideMap();
	} else {
		showMap();
	}
	mapShown = !mapShown;
	
}

function hideMap() {
	$(".map").hide();
	$(".mapButton").removeClass('hoverState');
	$( ".map .top-line" ).css('width', '0%');
	$( ".map .right-line" ).css('height', '0%');
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