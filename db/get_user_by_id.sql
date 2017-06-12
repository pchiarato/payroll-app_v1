-- select e.employee_id, e.fname, e.lname, e.email,e.company_id, e.usertype, e_info.address,e_info.phonenumber, e_info.gender, e_info.hire_date, e_info.birth_date,e_info.department,e_info.hourly_rate from employees as e
-- join employees_info as e_info on e.employee_id = e_info.employee_id where e.employee_id = $1
select e.employee_id, e.fname, e.lname, e.email,e.company_id, e.usertype, e_info.address,e_info.phonenumber, e_info.gender, e_info.hire_date, e_info.birth_date,e_info.department,e_info.hourly_rate, b.business_name from employees as e
join employees_info as e_info on e.employee_id = e_info.employee_id
join businesses b on e.company_id = b.business_id WHERE e.employee_id = $1;