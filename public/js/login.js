

// #############################################################################
// ## LOGIN ####################################################################
// #############################################################################

var login = function(){
    var email = $('#input-login-email').val();
    var password = $('#input-login-password').val();
    $('#input-login-email').removeClass('wrong');
    $('#input-login-password').removeClass('wrong');
    !email && $('#input-login-email').addClass('wrong');
    !password && $('#input-login-password').addClass('wrong');
    if(email && password) {
        showLoading();
        socket.emit('login', {
            email: email,
            password: CryptoJS.SHA1(password).toString()
        });    
    }
};

countries.forEach(function(elem){
    $('#input-register-country').append('<option>' + elem + '</option>');
});

socket.on('login', function(user){
    hideLoading();
    if(user.error){
        alert(user.error);
    }else if(user.active){
        objToSession(user, 'user');
        var remember = $("#remember").is(":checked");
        if(remember){
            window.localStorage.email = user.email;
            window.localStorage.password = user.password;
        }        
        window.location = 'home.html';
    }else{
        if(confirm('Your account has not been activated. You should have received an email to do it.\nHowever, we can send you that email again. Do you want to receive a new activation email?')){
            if(user.email){
                socket.emit('send-activation-email', {email: user.email});
            }
        }
    }
});

socket.on('send-activation-email', function(err){
    if(err){
        alert(err.msg);
    }
});

$('#input-login-username').focus();
$('#login-button').on('click', function(){
    login();
});
$('#input-login-email, #input-login-password').keypress(function(e){
    e.which == 13 && login();
});

$('#remember-link').on('click', function(){
    var email = $('#input-login-email').val();
    if(!email){
        email = prompt('Write your email. We\'ll send you the instructions to follow to change your password.');
    }
    
    if(email){
        socket.emit('send-password-change-email', {email: email});
        alert('We have sent you the instructions to follow to change your password. Check your email.');
    }
});

socket.on('send-password-change-email', function(err){
    if(err) alert(err.msg);    
});


// #############################################################################
// ## REGISTER #################################################################
// #############################################################################

var registerVisible = false;
$('#register-control, #register-footer').on('click', function(){
    registerVisible = !registerVisible;
    if(registerVisible) $('#register-form').slideDown(500);
    else $('#register-form').slideUp(500);
});

$("#input-register-birth" ).datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: "1930:2012"
});
$('.ui-datepicker-year').val(2012);


$('#register-button').on('click', function(){
    
    $('*').removeClass('wrong');
    
    var realname = $('#input-register-realname').val(),
        email = $('#input-register-email').val(),
        birthday = $('#input-register-birth').val(),
        password = $('#input-register-password').val(),
        password2 = $('#input-register-password2').val(),
        country = $('#input-register-country').val(),
        sex = $('#input-register-sex').val(),
        nick = $('#input-register-nick').val();
    
    var error = false;
    var errormsg = '';
    
    if(realname.length < 5 || realname.indexOf(' ') < 0){
        $('#input-register-realname').addClass('wrong');
        errormsg += '* Please, provide your real name. BreakBrain is a serious social network.\n';
        error = true;
    }
    if(birthday.length < 3){
        $('#input-register-birth').addClass('wrong');
        errormsg += '* Please, provide your birthday. BreakBrain will use your age to improve your experience.\n';
        error = true;
    }
    if(password.length < 5){
        $('#input-register-password').addClass('wrong');
        $('#input-register-password2').addClass('wrong');
        errormsg += '* Provide a password (5 characters at least).\n';
        error = true;
    }else if(password != password2){
        $('#input-register-password').addClass('wrong');
        $('#input-register-password2').addClass('wrong');
        errormsg += '* Password and password confirmation are different.\n';
        error = true;
    }    
    if(email.indexOf('@') < 0 || email.indexOf('.') < 0){
        $('#input-register-email').addClass('wrong');
        errormsg += '* You have to provide a correct email address. You need it to activate your account.\n';
        error = true;
    }
    
    if(errormsg.length > 3){
        alert('Your information has the following problems:\n' + errormsg);
    }
    
    
    if(!error){
        var newuser = {
            realname: realname,
            birthday: birthday,
            password: CryptoJS.SHA1(password).toString(),
            email: email,
            country: country,
            sex: sex,
            nick: nick
        };
        
        socket.emit('register', newuser);
    }
    
});

socket.on('register', function(err){
    if(!err){
        alert('Registered succesfully! Check your email and activate your account');
        window.location = 'login.html';
    }else if(err.msg == 'email-taken'){
        $('#input-register-email').addClass('wrong');        
        alert('Email address already taken. Are you registered yet?');
    }else{
        alert('A strange error has occurred!: ' + err.msg);
    }
});

