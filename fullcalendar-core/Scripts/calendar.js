let currentEvent;
const formatDate = date => date === null ? '' : moment(date).format("MM/DD/YYYY h:mm A");
const fpStartTime = flatpickr("#StartTime", {
    enableTime: true,
    dateFormat: "m/d/Y h:i K"
});
const fpEndTime = flatpickr("#EndTime", {
    enableTime: true,
    dateFormat: "m/d/Y h:i K"
});

$('#calendar').fullCalendar({
    defaultView: 'month',
    height: 'parent',
    header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
    },
    eventRender(event, $el) {
        $el.qtip({
            content: {
                title: event.title,
                text: event.description
            },
            hide: {
                event: 'unfocus'
            },
            show: {
                solo: true
            },
            position: {
                my: 'top left',
                at: 'bottom left',
                viewport: $('#calendar-wrapper'),
                adjust: {
                    method: 'shift'
                }
            }
        });
    },
    events: '/Home/GetCalendarEvents',
    eventClick: updateEvent,
    selectable: true,
    select: addEvent
});

/**
 * Calendar Methods
 **/

function updateEvent(event, element) {
    currentEvent = event; 

    if ($(this).data("qtip")) $(this).qtip("hide");
    
    $('#eventModalLabel').html('Edit Event');
    $('#eventModalSave').html('Update Event');
    $('#EventTitle').val(event.title);
    $('#Description').val(event.description);
    $('#isNewEvent').val(false);

    const start = formatDate(event.start);
    const end = formatDate(event.end);

    fpStartTime.setDate(start);
    fpEndTime.setDate(end);

    $('#StartTime').val(start);
    $('#EndTime').val(end);

    if (event.allDay) {
        $('#AllDay').prop('checked', 'checked');
    } else {
        $('#AllDay')[0].checked = false;
    }

    $('#eventModal').modal('show');
}

function addEvent(start, end) {
    $('#eventForm')[0].reset();

    $('#eventModalLabel').html('Add Event');
    $('#eventModalSave').html('Create Event');
    $('#isNewEvent').val(true);

    start = formatDate(start);
    end = formatDate(end);

    fpStartTime.setDate(start);
    fpEndTime.setDate(end);

    $('#eventModal').modal('show');
}

/**
 * Modal
 * */

$('#eventModalSave').click(() => {
    const title = $('#EventTitle').val();
    const description = $('#Description').val();
    const startTime = moment($('#StartTime').val());
    const endTime = moment($('#EndTime').val());
    const isAllDay = $('#AllDay').is(":checked");
    const isNewEvent = $('#isNewEvent').val() === 'true' ? true : false;
    
    if (startTime > endTime) {
        alert('Start Time cannot be greater than End Time');

        return;
    } else if ((!startTime.isValid() || !endTime.isValid()) && !isAllDay) {
        alert('Please enter both Start Time and End Time');

        return;
    }

    if (isNewEvent) {
        sendAddEvent(title, description, startTime._i, endTime._i, isAllDay);
    } else {
        sendUpdateEvent(title, description, startTime._i, endTime._i, isAllDay);
    }
});

function sendAddEvent(title, description, startTime, endTime, isAllDay) {
    axios({
        method: 'post',
        url: '/Home/AddEvent',
        data: {
            "Title": title,
            "Description": description,
            "Start": startTime,
            "End": endTime,
            "AllDay": isAllDay
        }
    })
    .then(res => {
        const { message, eventId } = res.data;

        if (message === '') {
            const newEvent = {
                start: startTime,
                end: endTime,
                allDay: isAllDay,
                eventId,
                title,
                description
            };

            $('#calendar').fullCalendar('renderEvent', newEvent);
            $('#calendar').fullCalendar('unselect');
            
            $('#eventModal').modal('hide');
        } else {
            alert(`Something went wrong: ${message}`);
        }
    })
    .catch(err => alert(`Something went wrong: ${err}`));
}

function sendUpdateEvent(title, description, startTime, endTime, isAllDay) {
    axios({
        method: 'post',
        url: '/Home/UpdateEvent',
        data: {
            "EventId": currentEvent.eventId,
            "Title": title,
            "Description": description,
            "Start": startTime,
            "End": endTime,
            "AllDay": isAllDay
        }
    })
    .then(res => {
        const { message } = res.data;

        if (message === '') {
            currentEvent.title = title;
            currentEvent.description = description;
            currentEvent.start = startTime;
            currentEvent.end = endTime;
            currentEvent.allDay = isAllDay;

            $('#calendar').fullCalendar('updateEvent', currentEvent);
            $('#eventModal').modal('hide');
        } else {
            alert(`Something went wrong: ${message}`);
        }
    })
    .catch(err => alert(`Something went wrong: ${err}`));
}

$('#AllDay').on('change', function (e) {
    if (e.target.checked) {
        $('#EndTime').val('');
        fpEndTime.clear();
        this.checked = true;
    } else {
        this.checked = false;
    }
});

$('#EndTime').on('change', () => {
    $('#AllDay')[0].checked = false;
});
