using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using fullcalendarcore.Models;
using Microsoft.Extensions.Options;
using fullcalendarcore.DataAccessLayer;
using fullcalendarcore.Library;

namespace fullcalendarcore.Controllers
{
    public class HomeController : Controller
    {
        private DA _DA { get; set; }

        public HomeController(IOptions<AppSettings> settings)
        {
            _DA = new DA(settings.Value.ConnectionStr);
        }

        public IActionResult Index() 
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetCalendarEvents(string start, string end) {
            List<Event> events = _DA.GetCalendarEvents(start, end);

            return Json(events);
        }

        [HttpPost]
        public IActionResult UpdateEvent([FromBody] Event evt) 
        {
            string message = String.Empty;

            message = _DA.UpdateEvent(evt);

            return Json(new { message });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() 
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
