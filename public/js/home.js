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


                /* Time spent graph */

                var plot2 = jQuery.jqplot ('stats-time', [[
                    ['Memory', brain.times[0]],['Flexibility', brain.times[1]], ['Problem solving', brain.times[2]],
                    ['Speed', brain.times[3]],['Attention', brain.times[4]]
                ]], {
                    title: 'Time spent',
                    seriesColors: [
                        'red', 'green', 'blue', 'purple', 'yellow'
                    ],
                    seriesDefaults: {
                        // Make this a pie chart.
                        renderer: jQuery.jqplot.PieRenderer,
                        rendererOptions: {
                            // Put data labels on the pie slices.
                            // By default, labels show the percentage of the slice.
                            showDataLabels: true
                        }
                    },
                    legend: { show:true, location: 'e' },
                    grid: {
                        background: 'rgba(0,0,0,0)',
                        gridLineColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.3)',
                        shadowAlpha: 0.01
                    }
                });

                /* Week evolution graph */

                var week_trans = [[],[],[],[],[]];
                for(var i=0; i < 7; i++){
                    for(var j=0; j < 5; j++){
                        week_trans[j][i] = brain.week[i][j];
                    }
                }

                var week_stats = $.jqplot ('stats-week', week_trans, {
                    animate: true,
                    title: 'Last week',
                    series: [
                        {label: 'Memory', color: 'red', lineWidth: 3, markerOptions: {style: 'circle', size: 3}},
                        {label: 'Flexibility', color: 'green', lineWidth: 3, markerOptions: {style: 'circle', size: 3}},
                        {label: 'Prob. solv.', color: 'blue', lineWidth: 3, markerOptions: {style: 'circle', size: 3}},
                        {label: 'Speed', color: 'purple', lineWidth: 3, markerOptions: {style: 'circle', size: 3}},
                        {label: 'Attention', color: 'yellow', lineWidth: 3, markerOptions: {style: 'circle', size: 3}}
                    ],
                    legend: {show: true, location: 'ne'},
                    grid: {
                        background: 'rgba(0,0,0,0)',
                        gridLineColor: '#d9d9d9',
                        borderColor: '#aaa',
                        shadowAlpha: 0.01
                    },
                    axes: {
                        xaxis: {
                            min: 1, max: 7,
                            ticks: [[1, '7 days ago'], [2, '6 days ago'], [3, '5 days ago'], [4, '4 days ago'], [5, '3 days ago'], [6, '2 days ago'], [7, 'yest.']]
                        },
                        yaxis: {
                            min: 0
                        }
                    }
                });
            }, 500);
        });
    });
});


socket.emit('recommend-games', user.email);
socket.on('recommend-games', function(games){
    games = games.slice(0,6);
    var game_template = document.getElementById('quick-games').innerHTML.replace(/(\n|\t)/g, '').match(/<!--{(.*)}-->/)[0].replace(/(<!--{|}-->)/g, '');
    games.forEach(function(g){
        $('#quick-games').append(game_template.replace(/{{name}}/g, g.name)
                                .replace(/{{capacity}}/g, g.capacity)
                                .replace(/{{hability}}/g, g.hability)
                                .replace(/{{logo}}/g, g.client_logo));

    });
});

var game_template = document.getElementById('stream-list').innerHTML.replace(/(\n|\t)/g, '').match(/<!--{(.*)}-->/)[0].replace(/(<!--{|}-->)/g, '');
socket.emit('get-news').on('get-news', function(news){
    news.forEach(function(n){
        $('#stream-list').append(game_template.replace(/{{name}}/g, n.name)
                                 .replace(/{{avatar}}/g, n.avatar)
                                .replace(/{{time}}/g, n.time)
                                 .replace(/{{new}}/g, n['new']));
    });
    console.log('news: ', news);
});