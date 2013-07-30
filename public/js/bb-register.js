$("#input-register-birth" ).datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: "1930:2010"
});

$('#register-button').on('click', function(){
    
    $('*').removeClass('wrong');
    
    var realname = $('#input-register-realname').val(),
        username = $('#input-register-username').val(),
        birthday = $('#input-register-birth').val(),
        password = $('#input-register-password').val(),
        password2 = $('#input-register-password2').val(),
        email = $('#input-register-email').val(),
        email2 = $('#input-register-email2').val(),
        country = $('#input-register-country').val(),
        sex = $('#input-register-sex').val();
    
    var error = false;
    var errormsg = '';
    
    if(realname.length < 5 || realname.indexOf(' ') < 0){
        $('#input-register-realname').addClass('wrong');
        errormsg += '* Please, provide your real name. BreakBrain is a serious social network.\n';
        error = true;
    }
    if(username.length < 5 || username.indexOf(' ') > -1){
        $('#input-register-username').addClass('wrong');
        errormsg += '* Usernames can\'t have spaces, and must have 5 characters at least.\n';
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
        $('#input-register-email2').addClass('wrong');
        errormsg += '* You have to provide a correct email address. You need it to activate your account.\n';
        error = true;
    }else if(email != email2){
        $('#input-register-email').addClass('wrong');
        $('#input-register-email2').addClass('wrong');
        errormsg += '* Your email address and its confirmation are different.\n';
        error = true;    
    }
    
    
    
    if(errormsg.length > 3){
        alert('Your information has the following problems:\n' + errormsg);
    }
    
    
    if(!error){
        var newuser = {
            realname: realname,
            username: username,
            birthday: birthday,
            password: CryptoJS.SHA1(password).toString(),
            email: email,
            country: country,
            sex: sex
        };
        
        socket.emit('register', newuser);
    }
     
});

socket.on('register', function(err){
    if(!err){
        alert('Registered succesfully! Check your email and activate your account');
        window.location = 'login.html';
    }
    else if(err.msg == 'username-taken'){
        $('#input-register-username').addClass('wrong');
        alert('Username already taken. You can\'t use it!');
    }else if(err.msg == 'email-taken'){
        $('#input-register-email').addClass('wrong');
        $('#input-register-email2').addClass('wrong');
        alert('Email address already taken. Are you registered yet?');
    }else{
        alert('A strange error has occurred!');
    }
});
