$(function () {

	$('#jmpress').jmpress({
		viewPort : {
			height  : 700,
			width   : 800,
			maxScale: 2,
			minScale: 0.1
		},
		animation: {
			transitionDuration : '1s'
		}
	});

	$('.step').on('enterStep', function(event) {
		$(this).find('.hiden-out').animate({opacity: 1}, 1500);
		if ($(this).hasClass('intro-step')) {
			$('.intro-step').animate({opacity: 1}, 2000, 'swing');
		} else {
			$('.intro-step').animate({opacity: 0}, 500, 'swing');
		}
		if ($(this).hasClass('metodologia-step')) {
			$('.metodologia-step').delay(500).animate({opacity: 1}, 2000, 'swing');
		} else {
			$('.metodologia-step').animate({opacity: 0}, 1000, 'swing');
		}
		if ($(this).hasClass('arquitectura-step')) {
			$('.arquitectura-step').animate({opacity: 1}, 2000, 'swing');
		} else {
			$('.arquitectura-step').animate({opacity: 0}, 1000, 'swing');
		}
		if ($(this).hasClass('resultados-step')) {
			$('.resultados-step').animate({opacity: 1}, 2000, 'swing');
		} else {
			$('.resultados-step').animate({opacity: 0}, 1000, 'swing');
		}
		if ($(this).hasClass('conclusiones-step')) {
			$('.conclusiones-step').animate({opacity: 1}, 2000, 'swing');
		} else {
			$('.conclusiones-step').animate({opacity: 0}, 1000, 'swing');
		}
		if ($(this).hasClass('pesas-step')) {
			$('.pesas-step').delay(1000).animate({opacity: 1}, 2000, 'swing');
		} else {
			$('.pesas-step').delay(1000).animate({opacity: 0}, 1000, 'swing');
		}
		if ($(this).hasClass('diagram-step')) {
			$('.diagram-step').delay(0).animate({opacity: 1}, 2000, 'swing');
		} else {
			$('.diagram-step').delay(0).animate({opacity: 0}, 1000, 'swing');
		}
		if ($(this).attr('id') === 'brain-parts-step') {
			$(this).find('#brain-parts').delay(2000).animate({width: 300}, 1500);

			var timeout = 3500;
			$(this).find('li').each(function (index, elem) {
				$(elem).delay(timeout).animate({opacity: 1}, 1000);
				timeout += 200;
			});
		}

	});
	$('.transparent').on('enterStep', function(event) {
		$(this).delay(0).animate({opacity: 1}, 1000, 'swing');
	});
	$('.show-index').on('enterStep', function(event) {
		$('.index').delay(0).animate({opacity: 1}, 1500, 'swing');
	});
	$('.hide-index').on('enterStep', function(event) {
		console.log('hide-index');
		$('.index').delay(0).animate({opacity: 0}, 1000, 'swing');
	});
	$('.transparent').on('leaveStep', function(event) {
		$(this).animate({opacity: 0}, 1000);
	});
	$('.semitransparent').on('leaveStep', function(event) {
		$(this).animate({opacity: 0.5}, 1000);
	});
	$('#draw8-step').on('leaveStep', function (event) {
		for(var i = 1, len = 9; i < len; i++){
			$('#draw' + i).lazylinepainter('destroy');
		}
	});
 
});

var draw = function (componentID, delay) {
	$('#' + componentID + '-step').on('enterStep', function (event) {
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