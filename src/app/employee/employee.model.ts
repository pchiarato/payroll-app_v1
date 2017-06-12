export class Employee {
    constructor(
        public employee_id:string,
        public fname:string,
        public lname:string,
        public email:string,
        public usertype:string,
        public phonenumber:string,
        public gender:string,
        public address:string,
        public rate:number,
        public department:string,
        public dob:string,
        public hiredate:string
        ) {}
}

                        // id: user[0].employee_id,
                        // name: user[0].fname,
                        // lastName: user[0].lname,
                        // email: user[0].email,
                        // usertype: user[0].usertype

    // addon
    // const phonenumber = form.value.phonenumber;
    // const gender = form.value.gender;
    // const address = form.value.address;
    // const rate = form.value.rate;
    // const dob = form.value.dob;
    // const hiredate = form.value.hiredate;
    // const department = form.value.department;
    // end of addon