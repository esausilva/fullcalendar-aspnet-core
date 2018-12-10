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
    eventClick: updateEvent
});

/**
 * Calendar Methods
 **/

function updateEvent(event, element) {
    currentEvent = event; 

    if ($(this).data("qtip")) $(this).qtip("hide");
    
    $('#eventModalLabel').html('Edit Event');
    $('#eventModalSave').html('Update Event');
    $('#eventTitle').html(`<strong>${event.title}</strong>`);
    $('#Description').val(event.description);

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

/**
 * Modal
 * */

$('#eventModalSave').click(() => {
    const description = $('#Description').val();
    const startTime = moment($('#StartTime').val());
    const endTime = moment($('#EndTime').val());
    const isAllDay = $('#AllDay').is(":checked");

    if (startTime > endTime) {
        alert('Start Time cannot be greater than End Time');

        return;
    } else if ((!startTime.isValid() || !endTime.isValid()) && !isAllDay) {
        alert('Please enter both Start Time and End Time');

        return;
    }

    axios({
        method: 'post',
        url: '/Home/UpdateEvent',
        data: {
            "EventId": currentEvent.eventId,
            "Description": description,
            "Start": startTime._i,
            "End": endTime._i,
            "AllDay": isAllDay
        }
    })
    .then(res => {
        if (res.data.message === '') {
            currentEvent.description = description;
            currentEvent.start = startTime;
            currentEvent.end = endTime;
            currentEvent.allDay = isAllDay;

            $('#calendar').fullCalendar('updateEvent', currentEvent);
            $('#eventModal').modal('hide');
        } else {
            alert(`Something went wrong: ${res.data.message}`);
        }
    })
    .catch(err => alert(`Something went wrong: ${err}`));
});

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
