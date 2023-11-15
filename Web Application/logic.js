function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    document.getElementById('clock').innerHTML = hours + ':' + minutes + ':' + seconds;
}

setInterval(updateClock, 1000);

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
        this.status = status;
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

$(document).ready(function() {
    $.ajax({
        url: 'https://randomuser.me/api/?results=5',
        dataType: 'json',
        success: function(data) {
            var staffTable = $('#staffTable'); 
            $.each(data.results, function(i, item) {
                var staffMember = new StaffMember(item.name.first, item.name.last, item.picture.thumbnail, item.email);
                var tr = $('<tr>').append(
                    $('<td>').html('<img src="' + staffMember.picture + '" alt="Profile Picture">'),
                    $('<td>').text(staffMember.name),
                    $('<td>').text(staffMember.surname),
                    $('<td>').text(staffMember.email),
                    $('<td>').text(staffMember.status), // status
                    $('<td>').text(staffMember.outTime), // outTime
                    $('<td>').text(staffMember.duration), // duration
                    $('<td>').text(staffMember.expectedReturnTime), // expectedReturnTime
                    $('<td>').text(staffMember.staffMemberIsLate), // staffMemberIsLate
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

    $('#in-button').on('click', function() {
        if (selectedStaffMember) {
            selectedStaffMember.status = 'In';
            $('#staffTable tr.selected').children().eq(4).text('In');

            // Unselect the row
            $('#staffTable tr.selected').removeClass('selected');
            selectedStaffMember = null;
        }
    });
});