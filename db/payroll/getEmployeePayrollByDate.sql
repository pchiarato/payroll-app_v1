SELECT e.employee_id, e.fname,e.lname,e.email,e.usertype,p.week_ending,p.hourly_rate,p.total_hours_worked,
p_line.gross_pay, p_line.tax_amount_paid,p_line.vacation_days_used,p_line.sick_days_used,p_line.medicare_amount,
p_line.social_security_amount,p_line.federal_tax_amount, p_line.net_pay,p_line.regular_pay,p_line.overtime_pay
FROM employees e
JOIN payroll p on e.employee_id = p.employee_id
JOIN payroll_line p_line on p.payroll_id = p_line.payroll_id
WHERE extract(week from p.week_ending) = extract(week from $1::date) AND e.employee_id = $2;