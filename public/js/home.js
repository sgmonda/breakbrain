socket.emit('brain', {email: user.email});
showLoading();

socket.on('brain', function(brain){

	loadJS([
		'/js/jqplot/jquery.jqplot.js',
		'/js/jqplot/jqplot.canvasTextRenderer.min.js',
		'/js/jqplot/jqplot.canvasAxisLabelRenderer.min.js',
		'/js/jqplot/jqplot.pieRenderer.min.js',
		'/js/jqplot/jqplot.barRenderer.min.js',
		'/js/jqplot/jqplot.categoryAxisRenderer.min.js'
	], function(){
		$(document).ready(function(){
			hideLoading();
			setTimeout(function(){

				$('#stat-1 > .knob').knob({
					min: 0,
					max: 100,
					fgColor: 'red',
					bgColor: 'rgba(0,0,0,0.2)',
					readOnly: 'true',
					width: 80
				});

				$('#stat-2 > .knob').knob({
					min: 0,
					max: 100,
					fgColor: 'green',
					bgColor: 'rgba(0,0,0,0.2)',
					readOnly: 'true',
					width: 80
				});

				$('#stat-3 > .knob').knob({
					min: 0,
					max: 100,
					fgColor: 'blue',
					bgColor: 'rgba(0,0,0,0.2)',
					readOnly: 'true',
					width: 80
				});

				$('#stat-4 > .knob').knob({
					min: 0,
					max: 100,
					fgColor: 'purple',
					bgColor: 'rgba(0,0,0,0.2)',
					readOnly: 'true',
					width: 80
				});

				$('#stat-5 > .knob').knob({
					min: 0,
					max: 100,
					fgColor: 'orange',
					bgColor: 'rgba(0,0,0,0.2)',
					readOnly: 'true',
					width: 80
				});

				$('.stat').fadeIn('slow');    
            });
		});
	});
});


socket.emit('recommend-games', user.email);
socket.on('recommend-games', function(games){
	games = games.slice(0,6);
	var game_template = document.getElementById('quick-games').innerHTML.replace(/(\n|\t)/g, '').match(/<!--{(.*)}-->/)[0].replace(/(<!--{|}-->)/g, '');
	games.forEach(function(g){
		var aux_game = game_template.replace(/{{name}}/g, g.name)
		  .replace(/{{capacity}}/g, g.capacity)
		  .replace(/{{hability}}/g, g.hability)
		  .replace(/{{logo}}/g, g.client_logo);
		$('#quick-games').append(aux_game).click(function () {
			window.location = '/games.html';
		});
	});
});

var stream_template = document.getElementById('stream-list').innerHTML.replace(/(\n|\t)/g, '').match(/<!--{(.*)}-->/)[0].replace(/(<!--{|}-->)/g, '');
socket.emit('get-news').on('get-news', function(news){
	news.forEach(function(n){
		$('#stream-list').append(stream_template.replace(/{{name}}/g, n.name)
								 .replace(/{{avatar}}/g, n.avatar)
								 .replace(/{{time}}/g, n.time)
								 .replace(/{{new}}/g, n['new']));
	});
});
socket.emit('get-global-news').on('get-global-news', function(news){
	news.forEach(function(n){
		$('#stream-list-global').append(stream_template.replace(/{{name}}/g, n.name)
										.replace(/{{avatar}}/g, n.avatar)
										.replace(/{{time}}/g, n.time)
										.replace(/{{new}}/g, n['new']));
	});
});