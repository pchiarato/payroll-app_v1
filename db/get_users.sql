-- select employee_id, fname, lname, email, usertype, company_id from employees where company_id = $1;
select e.employee_id, e.fname, e.lname, e.email, e.usertype, e.company_id,b.business_name from employees e
join businesses b on e.company_id = b.business_id where e.company_id = $1;