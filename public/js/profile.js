var interests_visible = false;
$('#interests-expander').on('click', function(){
    interests_visible = !interests_visible;
    interests_visible && $('#interests').slideDown(1000);
    !interests_visible && $('#interests').slideUp(1000);
});

socket.emit('brain', {email: user.email});
showLoading();

socket.on('brain', function(brain){    

    // Interests =================================================================================
    
    $("input").removeAttr("checked");
    brain.interests.memory.working_memory && $('#check-mem-wm').attr("checked","checked");
    brain.interests.memory.spatial_recall && $('#check-mem-sr').attr("checked","checked");
    brain.interests.memory.face_name_recall && $('#check-mem-fc').attr("checked","checked");
    brain.interests.problem_solving.arithmetic && $('#check-prob-ar').attr("checked","checked");
    brain.interests.problem_solving.logical_reasoning && $('#check-prob-lr').attr("checked","checked");
    brain.interests.problem_solving.quantitative_reasoning && $('#check-prob-qr').attr("checked","checked");
    brain.interests.attention.focus && $('#check-att-fo').attr("checked","checked");
    brain.interests.attention.visual_field && $('#check-att-vf').attr("checked","checked");
    brain.interests.speed.spatial_orientation && $('#check-spee-so').attr("checked","checked");
    brain.interests.speed.information_processing && $('#check-spee-ip').attr("checked","checked");
    brain.interests.flexibility.response_inhibition && $('#check-flex-ri').attr("checked","checked");
    brain.interests.flexibility.planning && $('#check-flex-pl').attr("checked","checked");
    brain.interests.flexibility.task_switching && $('#check-flex-ts').attr("checked","checked");
    brain.interests.flexibility.verbal_fluency && $('#check-flex-vf').attr("checked","checked");

    // ======================================================================
    
    $("#search-right-birth").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "1930:2012"
    });
    $("#search-right-birth").val(user.birthday);
    
    $('#search-right-avatar > img')[0].src = user.avatar;
    $('#search-right-realname').val(user.realname);
    $('#search-right-score').text(user.score);
    $('#search-right-nick').val(user.nick);
    $('#search-right-email').val(user.email);
    $('#search-right-age').text('calcular');
    $('#search-right-country').append('<option>' + user.country + '</option>');
    countries.forEach(function(elem){
        $('#search-right-country').append('<option>' + elem + '</option>');
    });

    console.log(user.followees);
    
    $('#search-right-followers').text(user.followers.length);
	$('#search-right-followers-container').on('mouseenter', function () {
		if (!$('#followers-list').is(':visible')) {
			$('#followers-list').slideDown();
		}
	});
	$('#search-right-followers-container').on('mouseleave', function () {
		if ($('#followers-list').is(':visible')) {
			$('#followers-list').slideUp();
		}
	});

    $('#search-right-followees').text(user.followees.length);
	$('#search-right-followees-container').on('mouseenter', function () {
		if (!$('#followees-list').is(':visible')) {
			$('#followees-list').slideDown();
		}
	});
	$('#search-right-followees-container').on('mouseleave', function () {
		if ($('#followees-list').is(':visible')) {
			$('#followees-list').slideUp();
		}
	});
    
    var general = new JustGage({
        id: "stat-general", 
        value: user.score, 
        min: 0,
        max: 1000,
        title: "Global score",
        label: "points",
        gaugeWidthScale: 0.9,
        showMinMax: true,
        startAnimationTime : 0,
        valueFontColor : '#444',
        titleFontColor: '#444',
        labelFontColor : '#444',
        gaugeColor: 'rgba(0,0,0,0.1)',
        levelColors: ['#444']
    });

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

                var month_trans = [[],[],[],[],[]];
                for(var i=0; i < 30; i++){
                    for(var j=0; j < 5; j++){
                        month_trans[j][i] = brain.month[i][j];
                    }
                }

                var month_stats = $.jqplot ('stats-month', month_trans, {
                    animate: true,
                    title: 'Last month',
                    series: [
                        {label: 'Memory', color: 'red', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Flexibility', color: 'green', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Prob. solv.', color: 'blue', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Speed', color: 'purple', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Attention', color: 'yellow', lineWidth: 3, markerOptions: {style: 'circle', size: 2}}
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
                            min: 1, max: 30,
                            ticks: [[1, ''], [5, '25 days ago'], [10, '20 days ago'], [15, '15 days ago'], [20, '10 days ago'], [25, '5 days ago'], [20, '10 days ago'], [30, '']]
                        },
                        yaxis: {
                            min: 0
                        }
                    }
                });


                var year_trans = [[],[],[],[],[]];
                for(var i=0; i < 12; i++){
                    for(var j=0; j < 5; j++){
                        year_trans[j][i] = brain.year[i][j];
                    }
                }

                var year_stats = $.jqplot ('stats-year', year_trans, {
                    animate: true,
                    title: 'Last year',
                    series: [
                        {label: 'Memory', color: 'red', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Flexibility', color: 'green', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Prob. solv.', color: 'blue', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Speed', color: 'purple', lineWidth: 3, markerOptions: {style: 'circle', size: 2}},
                        {label: 'Attention', color: 'yellow', lineWidth: 3, markerOptions: {style: 'circle', size: 2}}
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
                            min: 1, max: 30,
                            ticks: [[1, '1 year ago'], [3, '9 months ago'], [6, '6 months ago'], [9, '3 months ago'], [12, '']]
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

// AVATAR UPLOADING ////////////////////////////////////////////////////////////////////

var oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

oFReader.onload = function (oFREvent) {
    var b64img = oFREvent.target.result;    
    $('#search-right-avatar > img')[0].src = b64img;

};

function loadImageFile() {
    if (document.getElementById("uploadImage").files.length === 0) { return; }
    var oFile = document.getElementById("uploadImage").files[0];
    if(oFile.size > 524288) alert('Selected file is too large. Please, select an image which size does not exceed 512KB');
    else {
        if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
        oFReader.readAsDataURL(oFile);
    }
}

// Changes in user info

$('#button-save-changes').on('click', function(){
    var newrealname = $('#search-right-realname').val();
    var newavatar = $('#search-right-avatar > img')[0].src;
    var newbirth = $("#search-right-birth").val();
    var newnick = $('#search-right-nick').val();
    var newcountry = $('#search-right-country').val();
    if(!newrealname || !newavatar || !newbirth || !newnick || !newcountry){
        alert('Complete all fields!');
    }else{
        showLoading();
        socket.emit('update-user', {
            email: user.email,
            realname: newrealname,
            avatar: newavatar,
            birth: newbirth,
            nick: newnick,
            country: newcountry,
            interests: {
                memory: {
                    working_memory: $("#check-mem-wm").is(":checked"),
                    spatial_recall: $("#check-mem-sr").is(":checked"),
                    face_name_recall: $("#check-mem-fc").is(":checked")
                },
                flexibility: {
                    response_inhibition: $("#check-flex-ri").is(":checked"),
                    planning: $("#check-flex-pl").is(":checked"),
                    task_switching: $("#check-flex-ts").is(":checked"),
                    verbal_fluency: $("#check-flex-vf").is(":checked")
                },
                problem_solving: {
                    arithmetic: $("#check-prob-ar").is(":checked"),
                    logical_reasoning: $("#check-prob-lr").is(":checked"),
                    quantitative_reasoning: $("#check-prob-qr").is(":checked")
                },
                speed: {
                    spatial_orientation: $("#check-spee-so").is(":checked"),
                    information_processing: $("#check-spee-ip").is(":checked")
                },
                attention: {
                    focus: $("#check-att-fo").is(":checked"),
                    visual_field: $("#check-att-vf").is(":checked")
                }
            }
        });
    }

});

socket.on('update-user', function(u){
    hideLoading();
    if(!u){
        alert('Error while updating data. Try again!');
    }else if(u.msg){
        alert(u.msg + '\nRefresh this page');
    }else{
        objToSession(u, 'user');
        window.location = window.location;
    }

});