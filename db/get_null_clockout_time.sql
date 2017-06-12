select * from timetable
join employees on timetable.employee_id = employees.employee_id
 where not clockin isnull and clockout isnull