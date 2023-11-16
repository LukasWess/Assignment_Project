function digitalClock() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1; 
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

   
    day = (day < 10) ? '0' + day : day;
    month = (month < 10) ? '0' + month : month;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    var formattedTime = day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;

    
    document.getElementById('clock').innerHTML = formattedTime;
}


setInterval(digitalClock, 1000);


// Define the Employee class
class Employee {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }
}

// Define the StaffMember class
class StaffMember extends Employee {
    constructor(name, surname, picture, email, status, outTime, duration, expectedReturnTime, staffMemberIsLate) {
        super(name, surname);
        this.picture = picture;
        this.email = email;
        this.status = 'In';
        this.outTime = outTime;
        this.duration = duration;
        this.expectedReturnTime = expectedReturnTime;
        this.staffMemberIsLate = staffMemberIsLate;

    }
}

// Define the DeliveryDriver class
class DeliveryDriver extends Employee {
    constructor(name, surname, vehicle, telephone, deliverAddress, returnTime, deliveryDriverIsLate) {
        super(name, surname);
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliverAddress = deliverAddress;
        this.returnTime = returnTime;
        this.deliveryDriverIsLate = deliveryDriverIsLate;
    }
}

var selectedStaffMember = null;
//StaffUserGet Function doing a ajax call to the randomuser api and getting 5 random users and displaying them in a table
//The function is creating objects and dynamicly populating the html table, changing the nr of result will change the nr of users displayed. 
//this makes this code very scalable and easy to use.
$(document).ready(function() {
    $.ajax({
        url: 'https://randomuser.me/api/?results=5 ',
        dataType: 'json',
        success: function(data) {
            var staffTable = $('#staffTable'); 
            $.each(data.results, function(i, item) {
                var staffMember = new StaffMember(item.name.first, item.name.last, item.picture.thumbnail, item.email);
                var tr = $('<tr>').append(
                    $('<td>').html('<img src="' + staffMember.picture + '" alt="Profile Picture" class="rounded-image">'),
                    $('<td>').text(staffMember.name),
                    $('<td>').text(staffMember.surname),
                    $('<td>').text(staffMember.email),
                    $('<td>').text(staffMember.status), 
                    $('<td>').text(staffMember.outTime), 
                    $('<td>').text(staffMember.duration), 
                    $('<td>').text(staffMember.expectedReturnTime), 
                    
                    
                ).data('staffMember', staffMember);
                staffTable.append(tr);
            });

            $('#staffTable').on('click', 'tr', function() {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    selectedStaffMember = null;
                } else {
                    $('#staffTable tr').removeClass('selected');
                    $(this).addClass('selected');
                    selectedStaffMember = $(this).data('staffMember');
                }
            });
        }
    });

    
});

$('#out-button').on('click', function() {
    if (selectedStaffMember) {
        $('#modalTitle').text('Enter out-time for ' + selectedStaffMember.name);
        $('#durationModal').modal('show');
    }
});

$(document).ready(function() {
    $('#confirmButton').on('click', function() {
        console.log('Confirm button clicked');
        var duration = $('#durationInput').val();
        duration = parseInt(duration);

        if (!isNaN(duration)) {
            var outTime = new Date();
            var expectedReturnTime = new Date(outTime.getTime() + duration * 60000);

            var clockTime = document.getElementById('clock').innerHTML.split(' ')[1]; // Get the time from the digital clock
            var hoursAndMinutes = clockTime.split(':').slice(0, 2).join(':'); // Get only the hours and minutes

            selectedStaffMember.status = 'Out';
            selectedStaffMember.outTime = hoursAndMinutes;
            selectedStaffMember.duration = Math.floor(duration / 60) + 'h ' + (duration % 60) + 'min';
            selectedStaffMember.expectedReturnTime = expectedReturnTime.getHours() + ':' + expectedReturnTime.getMinutes();

            var selectedRow = $('#staffTable tr.selected');
            selectedRow.children().eq(4).text('Out');
            selectedRow.children().eq(5).text(selectedStaffMember.outTime);
            selectedRow.children().eq(6).text(selectedStaffMember.duration);
            selectedRow.children().eq(7).text(selectedStaffMember.expectedReturnTime);

            // Unselect the row
            selectedRow.removeClass('selected');
            selectedStaffMember = null;
        }

        $('#durationModal').modal('hide');
    });
});

$('#in-button').on('click', function() {
    if (selectedStaffMember) {
        selectedStaffMember.status = 'In';
        selectedStaffMember.outTime = '';
        selectedStaffMember.duration = '';
        selectedStaffMember.expectedReturnTime = '';

        var selectedRow = $('#staffTable tr.selected');
        selectedRow.children().eq(4).text('In');
        selectedRow.children().eq(5).text('');
        selectedRow.children().eq(6).text('');
        selectedRow.children().eq(7).text('');

        // Unselect the row
        selectedRow.removeClass('selected');
        selectedStaffMember = null;
    }
});