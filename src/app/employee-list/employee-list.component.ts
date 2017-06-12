import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EmployeeService } from '../employee/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.sass']
})
export class EmployeeListComponent implements OnInit {
  employees:any[];
  user:{};

  constructor(private employeeService: EmployeeService, private authService:AuthService, private router:Router, private route:ActivatedRoute) {}


  ngOnInit() {
     this.authService.getProfile()
      .subscribe(
        profile => {
          this.user = profile
        })
   this.onGetEmployees();
 }
    


  onGetEmployees() {
    this.employeeService.getEmployees()
      .subscribe(
        data => {
            this.employees = data;
          },
        error => { console.log(error) }
      )
  }
  onViewDetails(id:number) {
    this.employeeService.getEmployeeById(id);
    this.router.navigate(['details'], {relativeTo: this.route})
  }

}
