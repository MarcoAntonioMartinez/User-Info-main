import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from './user';
import { UserService } from '../user.service';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  
  
  //the domain model for users
  model: User = new User();
 
 
  //boolean variables used to disable submit and display buttons 
  isSubmittable: boolean = false;
  isDisplayable: boolean = false;
  
  //boolean set to true when user has not been added
  isNotAdded = false;
  
  //used to set the user id
  userId = 0;
  
  //false if submit button was not clicked
  isSubmitClicked: boolean = false;
  
  //string that is used to set default date to today
  today = "";
  
  //form instance with an array of users
  public form: {
	users: User[];
  };
  
  ngOnInit(): void {
	
	//set the default date to today
	this.setToday();
	
  }
  
  //set birthday to user's birthday
  public assignBirthday():void {
				
	if(this.model.birthday === ""){
	
	  this.model.birthday = this.today;
	}
	
  }
  
  
  //set today to todays date
  public setToday():void {
    
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth()+1;
	let year = date.getFullYear();
	let monthStr = "";
	let dayStr = "";

	//set today to todays date with a leading zero where needed 
	if (month<10 && day<10){ 	
	  monthStr = "0" + month.toString();
	  dayStr = "0" + day.toString();
	  this.today = year + '-' + monthStr + '-' + dayStr;
	}
	else if (day < 10){
	  dayStr = "0" + day.toString();
	  this.today = year + '-' + month + '-' + dayStr;
	}
	else if (month < 10){
	  monthStr = "0" + month.toString();
	  this.today = year + '-' + monthStr + '-' + day;
	}
	else{
	  this.today = year + '-' + month + '-' + day;
	}
  }
   
  //Disable submit button depending on if there is data and if the submit button was clicked
  public disabledSubmit(): void {
	
	if(this.form.users.length >= 1 && !this.isSubmitClicked)	{

	  this.isSubmittable = true; 
	  
	}
	
	else{
	
	  this.isSubmittable = false;
	}
  }
  
  //disables display data button if there is no data
  private disabledDisplay(): void {
	if(this.form.users.length >= 1)	{
	  this.isDisplayable = true;
	}
	else{
	  this.isDisplayable = false;
	}
  }
  
  //constructor to initialize the form instance users array and inject UserService 
  constructor(private userService: UserService){
	
	this.form = {
		users: []
	};
	
  }
  
  //adds a user to the users array
  public addUser(): void {
    
	
	//reset the boolean after add user button is clicked right after submit was clicked
	this.isSubmitClicked = false;
	
	this.assignBirthday();
	
	let fNameUpper = this.model.firstName.slice(0,1).toUpperCase() + this.model.firstName.slice(1);
	let lNameUpper = this.model.lastName.slice(0,1).toUpperCase() + this.model.lastName.slice(1);
	
	//add the user using the user model
	this.form.users.push({
		id: this.userId.toString(),
		firstName: fNameUpper,
		lastName: lNameUpper,
		sex: this.model.sex,
		birthday: this.model.birthday
	});
	
	//increment the id after a new user is added
	this.userId++;
	
	//set the users array to the new users and send it to DisplayDataComponent
	this.userService.setUsers(this.form.users);	
	
	//disable submit and display if conditions are met
	this.disabledSubmit();
	this.disabledDisplay();
	
	//user has been added
	//this.isNotAdded = false;
  }
  
  /*resets the form
  * arg 1: the form to be cleared
  */
  public clearForm(form: any){
	form.reset();
  }
  
  /*logs the form data and form model and resets the form
  * arg 1: the form to be submitted
  */
  public handleUserData(form: any): void {
	//if user has not been added confirm that the user doesn't want to add current user
	if(this.isNotAdded){
	  if(confirm("Are you sure you don't want to add the current user?")){
		//submit button was clicked
		this.isSubmitClicked = true;

		//submit will be disabled when there is no new data
		this.disabledSubmit();
	
		//display the users array
		console.group("Form Data");
		console.log(this.form.users);
		console.groupEnd();
	
		//display the form model
		console.group("Form Model");
		console.log(form);
		console.groupEnd();
		
		form.resetForm();
		
		//reset the boolean to true since user will be added 
		this.isNotAdded = true;
	  }
	  //otherwise user data will not be cleared and can be added after finishing input
	  else{
	    
		//reset the boolean to true since user has not been added yet
		this.isNotAdded = true;
		
	  }
	}
	//otherwise, user has been added so submit normally
	else{
	  //submit button was clicked
		this.isSubmitClicked = true;

		//reset the boolean to true since user has already been added 
		this.isNotAdded = true;
		
		//submit will be disabled when there is no new data
		this.disabledSubmit();
	
		//display the users array
		console.group("Form Data");
		console.log(this.form.users);
		console.groupEnd();
	
		//display the form model
		console.group("Form Model");
		console.log(form);
		console.groupEnd();
		
		form.resetForm();
	}	
	
	
  }

}
