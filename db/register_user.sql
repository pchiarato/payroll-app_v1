-- commented out to add more info across multiple tables.
-- INSERT INTO employees(fname,lname,email,pass,usertype) VALUES($1, $2, $3, $4, $5);

INSERT INTO employees(fname,lname,email,pass,usertype,company_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING employee_id;

