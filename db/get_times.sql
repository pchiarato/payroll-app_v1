SELECT e.fname,e.lname,e.employee_id, e.email, round(sum(info.hourly_rate)/count(t.clockout),2) as hourly_rate, sum((EXTRACT(EPOCH FROM clockout::timestamp) - EXTRACT(EPOCH FROM clockin::timestamp))) as totaltime from timetable t
left join employees e on t.employee_id = e.employee_id
left join employees_info as info on e.employee_id = info.employee_id
where EXTRACT(week from clockin) = EXTRACT(week from current_date - 7)
group by e.employee_id

--this is used to query info needed by the payroll function