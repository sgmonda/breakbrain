loadJS([
    '/js/jqplot/jquery.jqplot.js',
    '/js/jqplot/jqplot.barRenderer.min.js',
    '/js/jqplot/jqplot.categoryAxisRenderer.min.js',
    '/js/jqplot/jqplot.pointLabels.min.js'
], function(){

    var search = function(){
        var q = $('#search-box > input').val();
        socket.emit('search-users', {query: q});
        showLoading();
    };

    socket.on('search-users', function(data){
        hideLoading();
        $('#search-results').empty();
        var length = data.length;
        if(length < 1) alert('no results');
        data.forEach(function(e){
            var item = '<li>' +
                    '<div class="_id">' + e._id + '</div>' + 
                    '<div class="search-result-avatar">' +
                    '    <img src="' + (e.avatar || '/img/sample2.jpg') + '"/>' +
                    '</div>' +
                    '<div class="search-result-score">score: <div id="score1">' + e.score + '</div></div>' +
                    '<div class="search-result-info">' +
                    '    <div class="search-result-name">' +
                    '        ' + e.realname + 
                    '    </div>' +
                    '    <div class="search-result-nick">' +
                    '        ' + e.nick + 
                    '    </div>' + 
                    '    <div class="search-result-country">' +
                    '        ' + e.country + 
                    '    </div>' +
                    '</div>' +
                    '</li>';
            $('#search-results').append(item);
        });

        $('#search-results li').on('click', function(){
            var userID = $(this).find('._id').text();
            showLoading();
            $('#friend-button').hide();
            socket.emit('user-complete-info', {userID: userID});
        });
        
    });

    socket.on('user-complete-info', function(data){
        hideLoading();
        $('#search-right-avatar > img')[0].src = data.avatar;
        $('#search-right-realname').text(data.realname);
        $('#search-right-score').text(data.score);
        $('#search-right-nick').text(data.nick);
        $('#search-right-birthday').text(data.birthday);
        $('#search-right-age').text('calcular');
        $('#search-right-country').text(data.country);
        $('#search-right-infomsg').hide();
        $('#search-right-info').show();
        drawBarPlot(data.brain);
        $('#selected-user-id').text(data.id);
        
        $('#friend-button').text('Follow this user');
        if(data.followers.indexOf(user._id) > -1){
            $('#friend-button').text('Stop following this user');
        }
        $('#friend-button').show();
    });
        
    $('#friend-button').on('click', function(){
        var followeeID = $('#selected-user-id').text();
        showLoading();
        socket.emit('follow/unfollow', {followerID: user._id, followeeID: followeeID});
    });
    
    socket.on('follow/unfollow', function(data){ // follow and unfollow
        hideLoading();
        var selectedUser = $('#selected-user-id').text();
        if(!data.err && data.followeeID == selectedUser){
            if(data.following){
                $('#friend-button').text('Stop following this user');
            }else{
                $('#friend-button').text('Follow this user');
            }
            objToSession(data.user, 'user');
        }else alert('ERROR: ' + data.err);
    });

    $('#search-box > button').on('click', function(){
        search();
    });
    $('#search-box > input').keypress(function(e){
        e.which == 13 && search();
    });

    var drawBarPlot = function(values){

        $(document).ready(function(){
            var s1 = [values[0]];
            var s2 = [values[1]];
            var s3 = [values[2]];
            var s4 = [values[3]];
            var s5 = [values[4]];
            // Can specify a custom tick Array.
            // Ticks should match up one for each y value (category) in the series.
            
            var ticks = ['Brain areas', ''];

            $('#search-right-plot').html(''); // Clear previous plots
            
            var plot1 = $.jqplot('search-right-plot', [s1, s2, s3, s4, s5], {
                // The "seriesDefaults" option is an options object that will
                // be applied to all series in the chart.
                seriesDefaults:{
                    renderer:$.jqplot.BarRenderer,
                    rendererOptions: {fillToZero: true}
                },
                // Custom labels for the series are specified with the "label"
                // option on the series option.  Here a series option object
                // is specified for each series.
                series:[
                    {label:'Memory', color: 'red'},
                    {label:'Flexibility', color: 'green'},
                    {label:'Problem solving', color: 'blue'},
                    {label: 'Speed', color: 'purple'},
                    {label: 'Attention', color: 'orange'}
                ],
                // Show the legend and put it outside the grid, but inside the
                // plot container, shrinking the grid to accomodate the legend.
                // A value of "outside" would not shrink the grid and allow
                // the legend to overflow the container.
                legend: {
                    show: true,
//                    placement: 'outsideGrid',
                    location: 'e'
                },
                axes: {
                    // Use a category axis on the x axis and use our custom ticks.
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    }
                }
            });
        });

    };

});
