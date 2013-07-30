var activateID = get('activate');
socket.on('activate', function(err){
    if(!err) alert('Your user account has been activated. Now you can login!');
    else alert(err.msg);        
    window.location = 'login.html';
});
if(activateID){
    socket.emit('activate', {userID: activateID});
}else{
    window.location = 'login.html';
}