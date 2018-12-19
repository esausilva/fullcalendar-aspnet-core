using fullcalendarcore.Library;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace fullcalendarcore.DataAccessLayer
{
    public class DA
    {
        public string _ConnectionStrVC { get; set; }

        public DA(string ConnectionStrVC) {
            _ConnectionStrVC = ConnectionStrVC;
        }

        private SqlConnection GetConnection() {
            SqlConnection conn = new SqlConnection(_ConnectionStrVC);
            conn.Open();

            return conn;
        }

        private void CloseConnection(SqlConnection conn) {
            conn.Close();
        }
        
        public List<Event> GetCalendarEvents(string start, string end) {
            List<Event> events = new List<Event>();

            using (SqlConnection conn = GetConnection()) {
                using (SqlCommand cmd = new SqlCommand(@"select
                                                            event_id
                                                            ,title
                                                            ,[description]
                                                            ,event_start
                                                            ,event_end
                                                            ,all_day
                                                        from
                                                            [Events]
                                                        where
                                                            event_start between @start and @end", conn) {
                    CommandType = CommandType.Text
                }) {
                    cmd.Parameters.Add("@start", SqlDbType.VarChar).Value = start;
                    cmd.Parameters.Add("@end", SqlDbType.VarChar).Value = end;

                    using (SqlDataReader dr = cmd.ExecuteReader()) {
                        while (dr.Read()) {
                            events.Add(new Event() {
                                EventId = Convert.ToInt32(dr["event_id"]),
                                Title = Convert.ToString(dr["title"]),
                                Description = Convert.ToString(dr["description"]),
                                Start = Convert.ToString(dr["event_start"]),
                                End = Convert.ToString(dr["event_end"]),
                                AllDay = Convert.ToBoolean(dr["all_day"])
                            });
                        }
                    }
                }
            }

            return events;
        }

        public string UpdateEvent(Event evt) {
            string message = "";
            SqlConnection conn = GetConnection();
            SqlTransaction trans = conn.BeginTransaction();

            try {
                SqlCommand cmd = new SqlCommand(@"update
	                                                [Events]
                                                set
	                                                [description]=@description
                                                    ,title=@title
	                                                ,event_start=@start
	                                                ,event_end=@end 
	                                                ,all_day=@allDay
                                                where
	                                                event_id=@eventId", conn, trans) {
                    CommandType = CommandType.Text
                };
                cmd.Parameters.Add("@eventId", SqlDbType.Int).Value = evt.EventId;
                cmd.Parameters.Add("@title", SqlDbType.VarChar).Value = evt.Title;
                cmd.Parameters.Add("@description", SqlDbType.VarChar).Value = evt.Description;
                cmd.Parameters.Add("@start", SqlDbType.DateTime).Value = evt.Start;
                cmd.Parameters.Add("@end", SqlDbType.DateTime).Value = Helpers.ToDBNullOrDefault(evt.End);
                cmd.Parameters.Add("@allDay", SqlDbType.Bit).Value = evt.AllDay;
                cmd.ExecuteNonQuery();

                trans.Commit();
            } catch (Exception exp) {
                trans.Rollback();
                message = exp.Message;
            } finally {
                CloseConnection(conn);
            }

            return message;
        }

        public string AddEvent(Event evt, out int eventId) {
            string message = "";
            SqlConnection conn = GetConnection();
            SqlTransaction trans = conn.BeginTransaction();
            eventId = 0;

            try {
                SqlCommand cmd = new SqlCommand(@"insert into [Events]
                                                (
	                                                title
	                                                ,[description]
	                                                ,event_start
	                                                ,event_end
	                                                ,all_day
                                                )
                                                values
                                                (
	                                                @title
	                                                ,@description
	                                                ,@start
	                                                ,@end
	                                                ,@allDay
                                                );
                                                select scope_identity()", conn, trans) {
                    CommandType = CommandType.Text
                };
                cmd.Parameters.Add("@title", SqlDbType.VarChar).Value = evt.Title;
                cmd.Parameters.Add("@description", SqlDbType.VarChar).Value = evt.Description;
                cmd.Parameters.Add("@start", SqlDbType.DateTime).Value = evt.Start;
                cmd.Parameters.Add("@end", SqlDbType.DateTime).Value = Helpers.ToDBNullOrDefault(evt.End);
                cmd.Parameters.Add("@allDay", SqlDbType.Bit).Value = evt.AllDay;

                eventId =  Convert.ToInt32(cmd.ExecuteScalar());

                trans.Commit();
            } catch (Exception exp) {
                trans.Rollback();
                message = exp.Message;
            } finally {
                CloseConnection(conn);
            }

            return message;
        }

        public string DeleteEvent(int eventId) {
            string message = "";
            SqlConnection conn = GetConnection();
            SqlTransaction trans = conn.BeginTransaction();

            try {
                SqlCommand cmd = new SqlCommand(@"delete from 
	                                                [Events]
                                                where
	                                                event_id=@eventId", conn, trans) {
                    CommandType = CommandType.Text
                };
                cmd.Parameters.Add("@eventId", SqlDbType.Int).Value = eventId;
                cmd.ExecuteNonQuery();

                trans.Commit();
            } catch (Exception exp) {
                trans.Rollback();
                message = exp.Message;
            } finally {
                CloseConnection(conn);
            }

            return message;
        }
    }
}
