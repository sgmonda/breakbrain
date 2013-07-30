// #############################################################################
// ## UTILS ####################################################################
// #############################################################################

// Gets a "get parameter"
var get = function(param){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == param) return sParameterName[1];
    }
    return undefined;
};

// Load a list of JS scripts
var loadJS = function(array, callback){
    function load(url, clbk){
        console.log('loading "' + url + '" dynamically');
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = clbk;
        script.onload = clbk;
        head.appendChild(script);
    }
    function loadJSs(list, clbk){
        var js = list.pop();
        if(!js){
            clbk && clbk();
        }
        else load(js, function(){
            loadJSs(list, clbk);
        });
    }    
    array.reverse();
    loadJSs(array, callback);
};



// Loads styles (CSS)
var loadCSS = function(array, callback){
    var load = function(url, clbk){
        console.log('loading "' + url + '" dynamically');
        var head = document.getElementsByTagName('head')[0];
        var fileref=document.createElement('link');
        fileref.rel = 'stylesheet';
        fileref.type = 'text/css';
        fileref.href = url;
        fileref.onload = clbk;
        fileref.onreadystatechange = clbk;
        head.appendChild(fileref);
    };
    var loadCSSs = function(list, clbk){
        var css = list.pop();
        if(!css) clbk && clbk();
        else load(css, function(){
            loadCSSs(list, clbk);
        });
    };
    array.reverse();
    loadCSSs(array, callback);
};


// Writes an object into session
var objToSession = function(obj, id){
    window.sessionStorage[id] = JSON.stringify(obj);
};

// Reads an object from session
var objFromSession = function(id){
    var obj = window.sessionStorage[id];
    if(obj) return JSON.parse(obj);
    return {};
};

var showLoading = function(){
    $.blockUI.defaults.fadeOut = 0; 
    $.blockUI.defaults.fadeIn = 0; 
    $.blockUI({
        message: '<img src="/img/loading.gif" width="200"/>', 
        showOverlay: true, 
        css: {
            'font-family': 'sans-serif',
            'font-size': 'small',
            background: 'white',
            border: 'solid 2px #333',
            'border-radius': '0.5em',
            'overflow': 'hidden'
        }
    });
};
var hideLoading = function(){
    $.unblockUI();
};

const countries = ['Afghanistan', '&Aring;land Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo, Democratic Republic', 'Cook Islands', 'Costa Rica', 'C&ocirc;te d\'Ivoire (Ivory Coast)', 'Croatia (Hrvatska)', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (north)', 'Korea (south)', 'Kuwait', 'Kyrgyzstan', 'Lao People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Former Yugoslav Republic Of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territories', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'R&eacute;union', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen Islands', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Virgin Islands (British)', 'Virgin Islands (US)', 'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Zaire', 'Zambia', 'Zimbabwe', 'Fakeland'];
