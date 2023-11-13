function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    document.getElementById('clock').innerHTML = hours + ':' + minutes + ':' + seconds;
}

setInterval(updateClock, 1000);

$(document).ready(function() {
    $.ajax({
        url: 'https://randomuser.me/api/?results=5',
        dataType: 'json',
        success: function(data) {
            var staffTable = $('#staff-table-body');
            $.each(data.results, function(i, item) {
                var tr = $('<tr>').append(
                    $('<td>').html('<img src="' + item.picture.thumbnail + '" alt="Profile Picture">'),
                    $('<td>').text(item.name.first),
                    $('<td>').text(item.name.last),
                    $('<td>').text(item.email),
                );
                staffTable.append(tr);
            });
        }
    });
});