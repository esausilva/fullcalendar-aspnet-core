using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace fullcalendarcore.Library
{
    public class Event
    {
        public int EventId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public bool AllDay { get; set; }
    }
}
