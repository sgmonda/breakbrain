$(function () {

	$('#jmpress').jmpress({
		viewPort : {
			height  : 700,
			width   : 800,
			maxScale: 2,
			minScale: 0.1
		},
		animation: {
			transitionDuration : '2s'
		}
	});

	$('.step').on('enterStep', function(event) {
		// $(this).css('opacity', 0);
		// $(this).show();
		// $(this).delay(1000).animate({opacity: 1}, 2000);
	});
	$('.transparent').on('leaveStep', function(event) {
		$(this).animate({opacity: 0}, 500); //////// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	});
	$('.semitransparent').on('leaveStep', function(event) {
		$(this).animate({opacity: 0.5}, 500);
	});
 
});

var draw = function (componentID, delay) {
	$('#' + componentID).on('enterStep', function (event) {
		console.log('Painting ' + componentID + '...');
		setTimeout(function () {
			$('#' + componentID).lazylinepainter({
				"svgData": pathObj,
				"strokeWidth": 5,
				"strokeColor": "#444"
			}).lazylinepainter('paint'); 
		}, delay * 1000);
	});
};