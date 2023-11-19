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
var staffMembers = []; 

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

            var clockTime = document.getElementById('clock').innerHTML.split(' ')[1]; 
            var hoursAndMinutes = clockTime.split(':').slice(0, 2).join(':'); 

            selectedStaffMember.status = 'Out';
            selectedStaffMember.outTime = hoursAndMinutes;
            selectedStaffMember.duration = Math.floor(duration / 60) + 'h ' + (duration % 60) + 'min';
            var expectedReturnTime = new Date();
            expectedReturnTime.setMinutes(expectedReturnTime.getMinutes() + duration);

            var expectedReturnHours = expectedReturnTime.getHours();
            var expectedReturnMinutes = expectedReturnTime.getMinutes();
            if (expectedReturnMinutes < 10) {
            expectedReturnMinutes = '0' + expectedReturnMinutes;
            }
            var expectedReturnTimeFormatted = expectedReturnHours + ':' + expectedReturnMinutes;

            selectedStaffMember.expectedReturnTime = expectedReturnTimeFormatted;

            
            var index = staffMembers.findIndex(staff => staff.name === selectedStaffMember.name && staff.surname === selectedStaffMember.surname);

            
            if (index !== -1) {
                staffMembers[index] = selectedStaffMember;
            }

            var selectedRow = $('#staffTable tr.selected');
            selectedRow.children().eq(4).text('Out');
            selectedRow.children().eq(5).text(selectedStaffMember.outTime);
            selectedRow.children().eq(6).text(selectedStaffMember.duration);
            selectedRow.children().eq(7).text(selectedStaffMember.expectedReturnTime);

            
            selectedRow.removeClass('selected');
            selectedStaffMember = null;
        }

        $('#durationModal').modal('hide');

        
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

        
        selectedRow.removeClass('selected');
        selectedStaffMember = null;
    }
});

function checkIfStaffMemberIsLate() {
    var currentTime = new Date();
    staffMembers.forEach(function(staffMember) {
        if (staffMember.status === 'Out') {
            var expectedReturnTimeParts = staffMember.expectedReturnTime.split(':');
            var expectedReturnTime = new Date();
            expectedReturnTime.setHours(expectedReturnTimeParts[0]);
            expectedReturnTime.setMinutes(expectedReturnTimeParts[1]);
            expectedReturnTime.setSeconds(expectedReturnTimeParts[2] || 0);

            if (currentTime.getTime() > expectedReturnTime.getTime() + 1000) {
                var minutesLate = Math.floor((currentTime.getTime() - expectedReturnTime.getTime()) / 60000);
                staffMember.staffMemberIsLate = minutesLate;

                if (!staffMember.toastCreated) {
                    // Update the toast elements based on the provided HTML structure
                    $('#lateToastImage').attr('src', staffMember.picture);
                    $('#lateToastTitle').text(staffMember.name + ' is late');
                    $('#lateToastBody').html(staffMember.name + ' is ' + minutesLate + ' minutes late.');

                    var toastContainer = $('#lateToastContainer');
                    var toastElement = $('#lateToast');
                    toastContainer.append(toastElement);
                    toastElement.toast({ delay: 10000000, autohide: false });
                    toastElement.toast('show');

                    staffMember.toastCreated = true;
                } else {
                    // Update the existing toast elements based on the provided HTML structure
                    $('#lateToastImage').attr('src', staffMember.picture);
                    $('#lateToastTitle').text(staffMember.name + ' is late');
                    $('#lateToastBody').html(staffMember.name + ' is ' + minutesLate + ' Minutes Out of Office.');
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
    event.preventDefault(); 
    var selectedOptionIcon = $(this).find('svg').prop('outerHTML'); 
    $(".dropbtn").html(selectedOptionIcon); 
    $(".dropdown-content").hide(); 
    $(".dropbtn").parent().addClass('center-icon'); 

    
    selectedVehicle = $(this).text().trim();
    selectedVehicleSvg = selectedOptionIcon;
});


var deliveryDrivers = [];


$(document).ready(function() {
    var selectedVehicle = '';
    var selectedVehicleSvg = '';

    $(".dropdown-content a").click(function(event){
        event.preventDefault(); 
        var selectedOptionIcon = $(this).find('svg').prop('outerHTML'); 
        $(".dropbtn").html(selectedOptionIcon); 
        $(".dropdown-content").hide(); 
        $(".dropbtn").parent().addClass('center-icon'); 

        
        selectedVehicle = $(this).text().trim();
        selectedVehicleSvg = selectedOptionIcon;
    });

    $('#addButton').click(function() {
        var name = $('#nameInput').val();
        var surname = $('#surnameInput').val();
        var telephone = $('#telephoneInput').val();
        var deliverAddress = $('#deliverAddressInput').val();
        var returnTime = $('#returnTimeInput').val();
        var vehicle = selectedVehicle;
    
        var errors = [];
    
        if (!vehicle) errors.push('Vehicle type is required.');
        if (!name) errors.push('Name is required.');
        if (!surname) errors.push('Surname is required.');
        if (!telephone) errors.push('Telephone number is required.');
        else if (telephone.length < 7) errors.push('The telephone number must be at least 7 digits and only Digits.');
        if (!deliverAddress) errors.push('Delivery address is required.');
        if (!returnTime) errors.push('Return time is required.');
    
        if (errors.length > 0) {
            var toastHTML = `
                <div class="toast center-toast" role="alert" aria-live="assertive" aria-atomic="true" id="toastContainerOne">
                    <div class="toast-header">
                        <strong class="mr-auto">Error</strong>
                        <button type="button" class="ml-2 mb-1 close" data-bs-dismiss="toast" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                        ${errors.join('<br>')}
                    </div>
                </div>`;

            var toastElement = $(toastHTML); 
            var toastContainer = $('[aria-live="polite"][aria-atomic="true"]');
            toastContainer.append(toastElement);
            toastElement = $('.toast').last();
            toastElement.toast({ delay: 1000000 }); 
            toastElement.toast('show'); 
        
        } else {
            
            var newDeliveryDriver = new DeliveryDriver(name, surname, selectedVehicle, telephone, deliverAddress, returnTime, false);
            deliveryDrivers.push(newDeliveryDriver);
    
            var newRow = `<tr>
                <td>${selectedVehicleSvg} ${selectedVehicle}</td>
                <td>${name}</td>
                <td>${surname}</td>
                <td>${telephone}</td>
                <td>${deliverAddress}</td>
                <td>${returnTime}</td>
            </tr>`;
            $('#deliveryBoardTable tbody').append(newRow);
    
            $('#nameInput').val('');
            $('#surnameInput').val('');
            $('#telephoneInput').val('');
            $('#deliverAddressInput').val('');
            $('#returnTimeInput').val('');
            selectedVehicle = '';
            selectedVehicleSvg = '';
        }
    })});

var selectedDeliveryDriverIndex = null;

$('#deliveryBoardTable tbody tr').last().data('index', deliveryDrivers.length - 1);

$('#deliveryBoardTable').on('click', 'tr', function() {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        selectedDeliveryDriverIndex = null;
    } else {
        $('#deliveryBoardTable tr').removeClass('selected');
        $(this).addClass('selected');
        selectedDeliveryDriverIndex = $(this).data('index');
    }
});

$('#clearButton').click(function() {
    if (selectedDeliveryDriverIndex !== null) {
        var confirmDelete = confirm('Are you sure you want to remove this delivery driver?');
        if (confirmDelete) {
            $('#deliveryBoardTable tr.selected').remove();
            deliveryDrivers.splice(selectedDeliveryDriverIndex, 1);
            selectedDeliveryDriverIndex = null;
        }
    }
});

function deliveryDriverIsLate() {
    var currentTime = new Date();

    deliveryDrivers.forEach(function(deliveryDriver) {
        var returnTimeParts = deliveryDriver.returnTime.split(':');
        var returnTime = new Date();
        returnTime.setHours(returnTimeParts[0]);
        returnTime.setMinutes(returnTimeParts[1]);
        returnTime.setSeconds(returnTimeParts[2] || 0);

        if (returnTime < currentTime && !deliveryDriver.toastCreated) {
            var lateMinutes = Math.floor((currentTime - returnTime) / 60000);

            // Update the toast elements based on the provided HTML structure
            $('#deliveryToastBody').html(`
                Name: ${deliveryDriver.name} ${deliveryDriver.surname}<br>
                Address: ${deliveryDriver.deliverAddress}<br>
                Telephone: ${deliveryDriver.telephone}<br>
                Estimated return time: ${deliveryDriver.returnTime}<br>
            `);

            var toastContainer = $('#deliveryToastContainer');
            var toastElement = $('#deliveryToast');
            toastContainer.append(toastElement);
            toastElement.toast({ delay: 10000000, autohide: true });
            toastElement.toast('show');

            deliveryDriver.toastCreated = true;
        }
    });
}

setInterval(deliveryDriverIsLate, 1000);

$(document).ready(function(){
    $('ul.navbar-nav li.dropdown').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });
});
