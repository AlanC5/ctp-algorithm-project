var socket = io();

// clearText is the variable to know when to remove the "user is typing" message
var clearText;

$('form').submit(function(){
  var text = $('#m').val();
  socket.emit('chat message', text);
  $('#messages').append('<li>' + socket.id + ": " + text + '</li>');
  $('#m').val('');
  return false;
});

$('#m').keypress(function(){
  socket.emit('user is typing');
});

socket.on('chat message',function(msg){
  $('#messages').append('<li>' + msg.id + ": " + msg.text + '</li>');
});

socket.on('user is typing',function(id){
  clearTimeout(clearText);
  $('#user_typing').text(id + " is typing...");
  clearText = setTimeout(function(){
    $('#user_typing').text("");
  }, 3000);
});
