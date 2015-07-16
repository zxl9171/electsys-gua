var id=localStorage['temp'];
var info=localStorage[id].split(',');
$('#name').html(info[1]);
$('#score').html(info[2]);