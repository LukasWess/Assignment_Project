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
var staffMembers = []; // Define the staffMembers array globally

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
                    $('<td>').text(staffMember.expectedReturnTime)
                ).data('staffMember', staffMember);
                staffTable.append(tr);

                // Add the staffMember to the staffMembers array
                staffMembers.push(staffMember);
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

console.log(staffMembers);

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
            var expectedReturnTime = new Date();
            expectedReturnTime.setMinutes(expectedReturnTime.getMinutes() + duration);

            // Format the expected return time
            var expectedReturnHours = expectedReturnTime.getHours();
            var expectedReturnMinutes = expectedReturnTime.getMinutes();
            if (expectedReturnMinutes < 10) {
            expectedReturnMinutes = '0' + expectedReturnMinutes;
            }
            var expectedReturnTimeFormatted = expectedReturnHours + ':' + expectedReturnMinutes;

            // Set the expected return time
            selectedStaffMember.expectedReturnTime = expectedReturnTimeFormatted;

            // Find the index of the selected staff member in the array
            var index = staffMembers.findIndex(staff => staff.name === selectedStaffMember.name && staff.surname === selectedStaffMember.surname);

            // Update the object in the array
            if (index !== -1) {
                staffMembers[index] = selectedStaffMember;
            }

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

        // Log the staffMembers array
        console.log(staffMembers);
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

function checkIfStaffMemberIsLate() {
    var currentTime = new Date();
    console.log('Current time:', currentTime);
    staffMembers.forEach(function(staffMember) {
        console.log('Checking staff member:', staffMember.name);
        if (staffMember.status === 'Out') {
            var expectedReturnTimeParts = staffMember.expectedReturnTime.split(':');
            var expectedReturnTime = new Date();
            expectedReturnTime.setHours(expectedReturnTimeParts[0]);
            expectedReturnTime.setMinutes(expectedReturnTimeParts[1]);
            expectedReturnTime.setSeconds(expectedReturnTimeParts[2] || 0);
            console.log('Expected return time:', expectedReturnTime);
            if (currentTime.getTime() > expectedReturnTime.getTime() + 1000) {
                // Calculate how long the staff member has been out of the office
                var minutesLate = Math.floor((currentTime.getTime() - expectedReturnTime.getTime()) / 60000);
                console.log('Staff member is late by:', minutesLate, 'minutes');

                // Update the staffMemberIsLate property
                staffMember.staffMemberIsLate = minutesLate;

                // Check if a toast for this staff member has already been created
                if (!staffMember.toastCreated) {
                    // Create a new toast
                    var toastHTML = `
                    <div class="toast" data-staff-id="${staffMember.id}" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header">
                            <img src="${staffMember.picture}" class="rounded mr-2" alt="Staff Member Picture" width="30" height="30">
                            <strong class="mr-auto">${staffMember.name} is late</strong>
                            <button type="button" class="ml-2 mb-1 close" data-bs-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="toast-body">
                            ${staffMember.name} is ${minutesLate} minutes late.
                        </div>
                    </div>`;

                    var toastElement = $(toastHTML); // Create toastElement from toastHTML
                    var toastContainer = $('#toastContainer');
                    toastContainer.append(toastElement);
                    toastElement = $('.toast').last();
                    toastElement.toast({ delay: 10000000, autohide: false }); // Set options for the toast
                    toastElement.toast('show'); // Show the toast

                    // Update the toastCreated property
                    staffMember.toastCreated = true;
                } else {
                    // Update the existing toast's text
                    var existingToast = $('#toastContainer .toast[data-staff-id="' + staffMember.id + '"]');
                    existingToast.find('.toast-body').text(staffMember.name + ' is ' + minutesLate + ' minutes late.');
                }
            }
        }
    });
}

// Call the function every second
setInterval(checkIfStaffMemberIsLate, 1000);

$(document).ready(function(){
    $(".dropbtn").click(function(){
        $(".dropdown-content").toggle();
    });
});

$(".dropdown-content a").click(function(event){
    event.preventDefault(); // Prevent the default action
    var selectedOptionIcon = $(this).find('svg').prop('outerHTML'); // Get the SVG of the selected option
    $(".dropbtn").html(selectedOptionIcon); // Replace the HTML of the button with the selected option icon
    $(".dropdown-content").hide(); // Hide the dropdown
    $(".dropbtn").parent().addClass('center-icon'); // Add the 'center-icon' class to the parent td
});


