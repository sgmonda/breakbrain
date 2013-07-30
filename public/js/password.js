var hash = get('passwordChange');
if(!hash) window.location = 'login.html';
else socket.emit('check-hash', {hash: hash});

socket.on('check-hash', function(err){
    if(err){
        alert('Invalid hash. This code has been used yet or is not valid.');
        window.location = 'login.html';
    } else {
        $('#set-password-button').on('click', function(){
            change();
        });

        $('input').keypress(function(e){
            e.which == 13 && change();
        });

        socket.on('password-change', function(err){
            if(!err){
                alert('Your new password has been set. Now you can login');
                window.location = 'login.html';
            }else alert(err.msg);
        });

        var change = function(){
            $('*').removeClass('wrong');
            var password = $('#input-password-password').val();
            var password2 = $('#input-password-password2').val();
            if(!password || (password != password2)){
                $('#input-password-password').addClass('wrong');
                $('#input-password-password2').addClass('wrong');
                alert('You have to write the same password twice.');
            }else{
                socket.emit('password-change', {hash: hash, newpassword: CryptoJS.SHA1(password).toString()});
            }    
        };
    }
});

