/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Scripts/calendar.js":
/*!*****************************!*\
  !*** ./Scripts/calendar.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var currentEvent;\n\nvar formatDate = function formatDate(date) {\n  return date === null ? '' : moment(date).format(\"MM/DD/YYYY h:mm A\");\n};\n\nvar fpStartTime = flatpickr(\"#StartTime\", {\n  enableTime: true,\n  dateFormat: \"m/d/Y h:i K\"\n});\nvar fpEndTime = flatpickr(\"#EndTime\", {\n  enableTime: true,\n  dateFormat: \"m/d/Y h:i K\"\n});\n$('#calendar').fullCalendar({\n  defaultView: 'month',\n  height: 'parent',\n  header: {\n    left: 'prev,next today',\n    center: 'title',\n    right: 'month,agendaWeek,agendaDay'\n  },\n  eventRender: function eventRender(event, $el) {\n    $el.qtip({\n      content: {\n        title: event.title,\n        text: event.description\n      },\n      hide: {\n        event: 'unfocus'\n      },\n      show: {\n        solo: true\n      },\n      position: {\n        my: 'top left',\n        at: 'bottom left',\n        viewport: $('#calendar-wrapper'),\n        adjust: {\n          method: 'shift'\n        }\n      }\n    });\n  },\n  events: '/Home/GetCalendarEvents',\n  eventClick: updateEvent,\n  selectable: true,\n  select: addEvent\n});\n/**\r\n * Calendar Methods\r\n **/\n\nfunction updateEvent(event, element) {\n  currentEvent = event;\n  if ($(this).data(\"qtip\")) $(this).qtip(\"hide\");\n  $('#eventModalLabel').html('Edit Event');\n  $('#eventModalSave').html('Update Event');\n  $('#EventTitle').val(event.title);\n  $('#Description').val(event.description);\n  $('#isNewEvent').val(false);\n  var start = formatDate(event.start);\n  var end = formatDate(event.end);\n  fpStartTime.setDate(start);\n  fpEndTime.setDate(end);\n  $('#StartTime').val(start);\n  $('#EndTime').val(end);\n\n  if (event.allDay) {\n    $('#AllDay').prop('checked', 'checked');\n  } else {\n    $('#AllDay')[0].checked = false;\n  }\n\n  $('#eventModal').modal('show');\n}\n\nfunction addEvent(start, end) {\n  $('#eventForm')[0].reset();\n  $('#eventModalLabel').html('Add Event');\n  $('#eventModalSave').html('Create Event');\n  $('#isNewEvent').val(true);\n  start = formatDate(start);\n  end = formatDate(end);\n  fpStartTime.setDate(start);\n  fpEndTime.setDate(end);\n  $('#eventModal').modal('show');\n}\n/**\r\n * Modal\r\n * */\n\n\n$('#eventModalSave').click(function () {\n  var title = $('#EventTitle').val();\n  var description = $('#Description').val();\n  var startTime = moment($('#StartTime').val());\n  var endTime = moment($('#EndTime').val());\n  var isAllDay = $('#AllDay').is(\":checked\");\n  var isNewEvent = $('#isNewEvent').val() === 'true' ? true : false;\n\n  if (startTime > endTime) {\n    alert('Start Time cannot be greater than End Time');\n    return;\n  } else if ((!startTime.isValid() || !endTime.isValid()) && !isAllDay) {\n    alert('Please enter both Start Time and End Time');\n    return;\n  }\n\n  var event = {\n    title: title,\n    description: description,\n    isAllDay: isAllDay,\n    startTime: startTime._i,\n    endTime: endTime._i\n  };\n\n  if (isNewEvent) {\n    sendAddEvent(event);\n  } else {\n    sendUpdateEvent(event);\n  }\n});\n\nfunction sendAddEvent(event) {\n  axios({\n    method: 'post',\n    url: '/Home/AddEvent',\n    data: {\n      \"Title\": event.title,\n      \"Description\": event.description,\n      \"Start\": event.startTime,\n      \"End\": event.endTime,\n      \"AllDay\": event.isAllDay\n    }\n  }).then(function (res) {\n    var _res$data = res.data,\n        message = _res$data.message,\n        eventId = _res$data.eventId;\n\n    if (message === '') {\n      var newEvent = {\n        start: event.startTime,\n        end: event.endTime,\n        allDay: event.isAllDay,\n        title: event.title,\n        description: event.description,\n        eventId: eventId\n      };\n      $('#calendar').fullCalendar('renderEvent', newEvent);\n      $('#calendar').fullCalendar('unselect');\n      $('#eventModal').modal('hide');\n    } else {\n      alert(\"Something went wrong: \".concat(message));\n    }\n  }).catch(function (err) {\n    return alert(\"Something went wrong: \".concat(err));\n  });\n}\n\nfunction sendUpdateEvent(event) {\n  axios({\n    method: 'post',\n    url: '/Home/UpdateEvent',\n    data: {\n      \"EventId\": currentEvent.eventId,\n      \"Title\": event.title,\n      \"Description\": event.description,\n      \"Start\": event.startTime,\n      \"End\": event.endTime,\n      \"AllDay\": event.isAllDay\n    }\n  }).then(function (res) {\n    var message = res.data.message;\n\n    if (message === '') {\n      currentEvent.title = event.title;\n      currentEvent.description = event.description;\n      currentEvent.start = event.startTime;\n      currentEvent.end = event.endTime;\n      currentEvent.allDay = event.isAllDay;\n      $('#calendar').fullCalendar('updateEvent', currentEvent);\n      $('#eventModal').modal('hide');\n    } else {\n      alert(\"Something went wrong: \".concat(message));\n    }\n  }).catch(function (err) {\n    return alert(\"Something went wrong: \".concat(err));\n  });\n}\n\n$('#deleteEvent').click(function () {\n  if (confirm(\"Do you really want to delte \\\"\".concat(currentEvent.title, \"\\\" event?\"))) {\n    axios({\n      method: 'post',\n      url: '/Home/DeleteEvent',\n      data: {\n        \"EventId\": currentEvent.eventId\n      }\n    }).then(function (res) {\n      var message = res.data.message;\n\n      if (message === '') {\n        $('#calendar').fullCalendar('removeEvents', currentEvent._id);\n        $('#eventModal').modal('hide');\n      } else {\n        alert(\"Something went wrong: \".concat(message));\n      }\n    }).catch(function (err) {\n      return alert(\"Something went wrong: \".concat(err));\n    });\n  }\n});\n$('#AllDay').on('change', function (e) {\n  if (e.target.checked) {\n    $('#EndTime').val('');\n    fpEndTime.clear();\n    this.checked = true;\n  } else {\n    this.checked = false;\n  }\n});\n$('#EndTime').on('change', function () {\n  $('#AllDay')[0].checked = false;\n});\n\n//# sourceURL=webpack:///./Scripts/calendar.js?");

/***/ }),

/***/ "./Styles/calendar.scss":
/*!******************************!*\
  !*** ./Styles/calendar.scss ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./Styles/calendar.scss?");

/***/ }),

/***/ 0:
/*!**********************************************************!*\
  !*** multi ./Scripts/calendar.js ./Styles/calendar.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./Scripts/calendar.js */\"./Scripts/calendar.js\");\nmodule.exports = __webpack_require__(/*! ./Styles/calendar.scss */\"./Styles/calendar.scss\");\n\n\n//# sourceURL=webpack:///multi_./Scripts/calendar.js_./Styles/calendar.scss?");

/***/ })

/******/ });