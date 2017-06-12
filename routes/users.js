const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken')
const userCtrl = require('../models/userCtrl');
const config = require('../config/config');
const app = require('../index');
const db = app.get('db');
const payrollCtrl = require('../models/payrollCtrl');
const cron = require('node-cron');
const moment = require('moment');



// let cronLogger = cron.schedule("1 * * * * *", () => {
//     let timer = new Date().toString()
//     console.log(timer)
//     logthis();
// }, false)




// tester end point
// router.post('/register', (req, res) => {
//         let newUser = req.body;
//         console.log(newUser)

//         res.status(200).json('ok')
//})


router.post('/register-business', (req, res) => {
    let newBusiness = req.body;

    let fullname = req.body.business_owner.split(" ");
    let fname = fullname[0];
    let lname = fullname[1];
    let userId = null;
    //console.log(newBusiness);
    newBusiness.pass = userCtrl.hashPassword(newBusiness.pass);
    db.register_business([newBusiness.business_owner, newBusiness.business_name, newBusiness.business_type, newBusiness.phone_number, newBusiness.email, newBusiness.address, newBusiness.pass], (err, business) => {
        if (err) {
            console.error('error from register-business route')
            throw err;
        }
        db.register_user([fname, lname, newBusiness.email, newBusiness.pass, business[0].user_type, business[0].business_id], (err, user) => {
            if (err) {
                console.error('error from register_user @ register_business');
                throw err;
            }
            userId = user[0].employee_id;
            db.register_user_info([newBusiness.address, newBusiness.phone_number, newBusiness.business_type, userId, business[0].registered_date, 'none', 0, business[0].registered_date], (err, user_info) => {
                if (err) {
                    throw err;
                }
            })

        })
        if (newBusiness.fax_number) {
            db.register_business_fax([newBusiness.fax_number, business[0].business_id], (err, fax) => {
                if (err) {
                    console.error('error from register_business_fax');
                    throw err;
                }
                // return;
            })
        }

        res.status(200).json({ success: true, msg: 'Business registered' });
        delete newBusiness.pass;
    })

})

router.post('/register', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user[0].usertype === 'admin' || req.user[0].usertype === 'owner') {
        let company_id = req.user[0].company_id;
        let newUser = req.body;
        //console.log(newUser);
        newUser.pass = userCtrl.hashPassword(newUser.pass);
        db.register_user([newUser.fname, newUser.lname, newUser.email, newUser.pass, newUser.usertype, company_id], (err, user) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ success: false, msg: 'Failed to register user' });
            }
            //console.log(user);
            let userId = user[0].employee_id;
            db.register_user_info([newUser.address, newUser.phonenumber, newUser.department, userId, newUser.hire_date, newUser.gender, newUser.rate, newUser.dob], (err, user_info) => {
                if (err) {
                    throw err;
                }
            })
            delete newUser.pass;
            return res.status(200).json({ success: true, msg: 'User registered' });


        })
    }
    return res.status(500).json({ message: 'Not authorized' })
})

router.post('/login', (req, res, next) => {
    //console.log('/login', req.body);
    const email = req.body.email;
    const password = req.body.pass;
    db.get_user_by_email([email], (err, user) => {
        if (err) {
            throw err;
        }
        if (!user[0]) {
            return res.status(400).json({ success: false, msg: 'User not found' })
        }
        userCtrl.comparePassword(password, user[0].pass, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                const token = jwt.sign(user[0], config.secret, {
                    expiresIn: 604800 // week in seconds
                });
                res.status(200).json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user[0].employee_id,
                        name: user[0].fname,
                        lastName: user[0].lname,
                        email: user[0].email,
                        usertype: user[0].usertype,
                        company_id: user[0].company_id

                    }

                });

            } else {
                return res.json({ success: false, msg: 'Wrong username/password' });
            }

        })
    })
})

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    //console.log(req.user[0]);
    res.status(200).json({
        id: req.user[0].employee_id,
        name: req.user[0].fname,
        lastName: req.user[0].lname,
        email: req.user[0].email,
        usertype: req.user[0].usertype,
        company_id: req.user[0].company_id
    });
})

router.get('/payroll/:date', passport.authenticate('jwt', { session: false }), (req, res) => {
    let queryDate = req.params.date;
    let userId = req.user[0].employee_id;
    db.payroll.getEmployeePayrollByDate([queryDate, userId], (err, payroll) => {
        if (err) {
            console.error('error from payroll:date endpoint');
            throw err
        }
        res.status(200).json(payroll);

    })
})

router.get('/hours', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.user[0].employee_id;
    db.get_total_hours([id], (err, hours) => {
        if (err) {
            throw err;
        }
        res.status(200).json(hours[0]);
    })
})

let today = new Date();

router.get('/timecard', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.user[0].employee_id
    let queryDate = today.toDateString();
    if (req.body.date) {
        queryDate = req.body.date;
    }
    db.get_time_by_id([id, queryDate], (err, timecard) => {
        if (err) {
            throw err;
        }
        res.status(200).json(timecard);

    })

})

router.get('/timecard/:date', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.user[0].employee_id
    let queryDate = req.params.date;
    db.get_time_by_id([id, queryDate], (err, timecard) => {
        if (err) {
            throw err;
        }
        //console.log(timecard);
        res.status(200).json(timecard);

    })

})


// timecard post endpoint
router.post('/timecard', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.user[0].employee_id;
    let time;
    let timeCardId;
    if (req.body.clockIn) {
        time = req.body.clockIn;
        db.clock_in([time, id], (err, timecard) => {
            if (err) {
                throw err;
            }
            return res.status(200).json(timecard[0]);
        })
    }
    if (req.body.clockOut) {
        time = req.body.clockOut;
        //console.log(req.body);
        timeCardId = req.body.timeCardId;
        db.clock_out([time, timeCardId], (err, timecard) => {
            if (err) {
                throw err;
            }
            return res.status(200).json(timecard[0]);
        })

    }

})

router.get('/listusers', passport.authenticate('jwt', { session: false }), (req, res) => {
        if (req.user[0].usertype === 'admin' || req.user[0].usertype === 'owner') {
            const company_id = req.user[0].company_id;
            db.get_users([company_id], (err, users) => {
                if (err) {
                    console.log(err)
                }
                return res.status(200).json(users);
            })
        } else {
            return res.status(500).json({ message: 'Not authorized' })
        }
    })
    // gets employee by id for the details page
router.get('/employee/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.params.id;
    db.get_user_by_id([id], (err, employee) => {
        if (err) {
            throw err;
        }
        //console.log(employee[0]);
        res.status(200).json(employee[0]);
    })
})

router.get('/payroll', passport.authenticate('jwt', { session: false }), (req, res) => {
    //console.log('this is the req.user', req.user);
    let userId = req.user[0].employee_id;
    db.payroll.getEmployeePayroll([userId], (err, payroll) => {
        if (err) {
            console.error('error from /payroll, getEmployeePayroll');
            throw err;
        }
        res.status(200).json(payroll);
    })

})


// try to get info from the database and save it into an object;

function logthis() {
    console.log('cron is working')
}
// method to clock-out any employee that missed a puch out at the end of their shifts and to notify admin.
function timeFixer() {
    let time = new Date();
    let newClockoutTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
    db.get_null_clockout_time((err, timecard) => {
            if (err) {
                throw err;
            }
            console.log(timecard)
            if (timecard.length > 0) {
                timecard.forEach(employee => {
                    console.log(employee.clockout)
                    db.fix_null_clockout_time([newClockoutTime, employee.time_id], (err, fixed_timecard) => {
                        if (err) {
                            console.error('error from timeFixer function');
                            throw err;
                        }
                        //send an email to admins with employee.fname, employee.lname, employee_id, employee.email, employee.company_id;
                        // notifying that employee missed punch out time.
                    })

                });
            } //end of if-statement
        }) // end of get_null_clockout_time function
} // end of time fixer
//timeFixer()
let cronTimeFixer = cron.schedule('59 23 * * *', () => { // this function will auto-run everyday at 23:59:00 and clockout any employee who missed a punch-out.
    timeFixer();
}, false)
cronTimeFixer.start(); // runs cron task to fix employees time automatic.

function payroll() {
    let today = new Date().toDateString()
    let payroll_day = moment(today).format('YYYY-MM-DD');
    let payroll_id;
    db.get_times((err, users) => {
        let usersArray = users;
        usersArray.forEach((employee) => {
                employee.decimal_time = payrollCtrl.timeConverter(employee.totaltime);
                employee.earnings = payrollCtrl.timeToCurrencyConverter(employee.totaltime, employee.hourly_rate);
                employee.gross_pay = payrollCtrl.addPay(employee.earnings.regularPay, employee.earnings.overtime);
                employee.regular_pay = employee.earnings.regularPay;
                employee.overtime_pay = employee.earnings.overtime;
                employee.social_security_amount = payrollCtrl.calculateSocialSecurity(employee.gross_pay, .042);
                employee.medicare_amount = payrollCtrl.calculateMedicare(employee.gross_pay, .0145);
                employee.federal_tax_amount = payrollCtrl.calculateFederalTax(employee.gross_pay, .15, employee.social_security_amount, employee.medicare_amount);
                employee.total_tax_amount = payrollCtrl.calculateTotalTaxesPaid(employee.federal_tax_amount, employee.medicare_amount, employee.social_security_amount)
                employee.net_pay = payrollCtrl.calculateNetPay(employee.gross_pay, employee.total_tax_amount);
                employee.week_ending = payroll_day;
                // employee.week_ending = '2017-06-10'

                return
            })
            //console.log(usersArray);
        usersArray.forEach(employee => {
            db.payroll.createPayroll([employee.employee_id, employee.week_ending, employee.decimal_time, employee.hourly_rate], (err, payroll) => {
                if (err) {
                    console.error('error from createPayroll');
                    throw err
                }
                payroll_id = payroll[0].payroll_id;
                db.payroll.addPayroll([
                    employee.gross_pay,
                    employee.total_tax_amount,
                    employee.employee_id,
                    payroll_id,
                    employee.medicare_amount,
                    employee.social_security_amount,
                    employee.federal_tax_amount,
                    employee.net_pay,
                    employee.regular_pay,
                    employee.overtime_pay
                ], (err, completed_payroll) => {
                    if (err) {
                        console.error('error from addPayroll')
                        throw err;
                    }
                    return
                })

            })
        })





    })
}
//payroll(); //DO NOT UNCOMMENT THIS UNLESS YOU WANT TO RUN PAYROLL;
let cronPayroll = cron.schedule('59 23 * * 6', () => { // this cron job will run payroll at 23:59:00 every Saturday;
    payroll();
}, false);
cronPayroll.start();


module.exports = router;