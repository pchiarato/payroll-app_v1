--SELECT clockin, clockout, time_id FROM timetable WHERE employee_id = $1 and clockin::date = $2 order by time_id asc;
SELECT clockin, clockout, time_id FROM timetable WHERE employee_id = $1 and clockin::date = $2 order by time_id asc;