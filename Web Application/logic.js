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
                    $('<td>').text(''), // status
                    $('<td>').text(''), // outTime
                    $('<td>').text(''), // duration
                    $('<td>').text(''), // expectedReturnTime
                    $('<td>').text(''), // staffMemberIsLate
                );
                staffTable.append(tr);
            });

            
            $('#staff-table-body').on('click', 'tr', function() {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    $('#staff-table-body tr').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        }
    });
});