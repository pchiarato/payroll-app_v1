INSERT INTO payroll(employee_id,week_ending,total_hours_worked,hourly_rate) VALUES($1,$2,$3,$4) RETURNING payroll_id;