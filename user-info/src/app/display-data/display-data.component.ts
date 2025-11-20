import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user-info/user';

@Component({
  selector: 'display-data',
  templateUrl: './display-data.component.html',
  styleUrls: ['./display-data.component.css']
})
export class DisplayDataComponent implements OnInit {
 
   
  //default date picker date will be set to user birthday 
  birthday = "";
 
  //form instance used to hold array of users
  public displayForm: {
	users: User[];
	
  };
  
  //array of users used to display filtered data
  public displayUsers: User[] = [];
  
  //arrays for user age data and filtered age data
  userAge: number[] = [];
  userFilteredAge: number[] = [];
  
  //user age data variables
  ageMin = 0;
  ageMax = 0;
  ageAvg = 0;
  
  //used to filter user data
  filter = "";
  
  //determines if the filter should be applied
  isFilterable = false;
  
  //map used to determine which table row is being edited
  editCache: { [key: string]: any } = {};
  
  //variable to check if editing has started
  isEditable = false;
  
  //initialize display form and inject UserService
  constructor(private userService: UserService) { 
    this.displayForm = {
		users: []
		
	};
	
  }
 
 //set everything up for displaying user age data and edit cache
  ngOnInit(): void {
  
	//get the user data from the UserInfoComponent
	this.displayForm.users = this.userService.getUsers();
	
	//calculate all user's age
	this.addUserAge();
	
	/* update the edit cache with the data from displayForm.users 
	*   and set edit boolean to false */
	this.updateEditCache();
	
	//set display users array to display form users array
	this.assignDisplayUsers();	
	
  }
  
  //set birthday to user's birthday
  private assignBirthday(id: string):void {
    
	//set the date picker to the birthday that is being edited
	let birthYear = this.editCache[id].data.birthday.slice(0,4);
	
	let birthMonth = this.editCache[id].data.birthday.slice(5,7);
	
	let birthDay = this.editCache[id].data.birthday.slice(8,10);
	
	this.birthday = birthYear + '-' + birthMonth + '-' + birthDay;
	
	//make sure the user that is being edited does not have empty birthday
	if(this.editCache[id].data.birthday === ""){
	
	  this.editCache[id].data.birthday = this.birthday;
	}
	
  }
  
  //assign displayUsers to the users array
  private assignDisplayUsers(): void{
    
	if(this.displayForm.users.length !=0){
	  for(let user of this.displayForm.users) {
	
	    this.displayUsers.push({
	      id: user.id,
	      firstName: user.firstName,
		  lastName: user.lastName,
	   	  sex: user.sex,
		  birthday: user.birthday
	    });
      }
	}
	else{
	  console.log("Display users has nothing");
	}

  }
  
  /**********************************************************
  * Beginning of Filter User Methods
  *
  ***********************************************************/
  //when the drop-down list changes make it so it doesn't filter the data
  public onChange(): void{
	
	this.isFilterable = false;
	
  }
  
  //sets the filter to drop-down list selection
  public filterUser(): void{
	
	//if filter is not blank then filter the data
	if(this.filter !== ""){
	  //data can now be filtered
	  this.isFilterable = true;
	  
	  //filter out the array that does not match the sex chosen
	  this.displayUsers = this.displayForm.users.filter(item => item.sex === this.filter)
	
  	  //add display users ages to user age array
	  this.addUserAge();

	  //display the filtered array
	  if(this.displayUsers.length != 0){
	
	    console.group("Filtered Data");
	    for(let index in this.displayUsers){
          console.log(this.displayUsers[index]);  
	    }	
	    console.groupEnd();
	  }
	  else{
	    console.group("Filtered Data");
	    console.log("No filtered data");
	    console.groupEnd();
	  }
	
	}
	
		
	
  }
	  
  //clear the filter and reassign displayUsers array and user age array
  public clearFilter(): void{
    //clear filter
    this.isFilterable = false;
	
	//reassign the age data to the original user data
	this.assignUserAgeData(this.displayForm.users, this.userAge);
	
  }
 
 /**********************************************************
  * End of Filter User Methods
  *
  ***********************************************************/
 
 
 
 /**********************************************************
  * Beginning of Edit User Methods
  *
  ***********************************************************/
  
  /* begins editing and sets default date on date picker shown when editing
  *     arg 1: takes a string as argument which represents id of the user to be edited */
  public startEdit(id: string): void{
	 
	//editing has started  
    this.editCache[id].edit = true;

	//initialize date picker with birthday of current user
	this.assignBirthday(id);

	//editing has started, 
	this.isEditable = true;

  }
	
  /*cancel an edit
  *	  arg 1: the user that is being edited*/
  public cancelEdit(id: string): void{
    //show confirmation for canceling an edit
    if(confirm("Are you sure you want to cancel?")) {
      const index = this.displayForm.users.findIndex(item => item.id === id);
	  this.editCache[id] = {
		data: { ...this.displayForm.users[index] },
		edit: false
	  };
	  
	  //row is no longer being edited
	  this.isEditable = false;
	}
  }
  
  //show alert if user clicks on the save clickable a tag with invalid data
  public saveAlert(){
    //show alert if form is invalid
	alert("Please follow on-screen instructions to fix input data.");
  }
  
    
  /*save the edit and assign the ages to ages array 
  *	  arg 1: the id of user that was edited*/
  public saveEdit(id: string): void {
    //make sure name and sex are saved in a proper way 
	let userSex = this.editCache[id].data.sex.toLowerCase();
	let fName = this.editCache[id].data.firstName;
	let lName = this.editCache[id].data.lastName;
	
	//capitalize the first letter in the name
	fName = fName.slice(0,1).toUpperCase() + fName.slice(1);
	lName = lName.slice(0,1).toUpperCase() + lName.slice(1);
	
	//assign the modified edited data 
	this.editCache[id].data.sex = userSex;
	this.editCache[id].data.firstName = fName;
	this.editCache[id].data.lastName = lName;
	
	//update the data in the array
	const index = this.displayForm.users.findIndex(item => item.id === id);
	Object.assign(this.displayForm.users[index], this.editCache[id].data);
	this.editCache[id].edit = false;
	  
	
	//display the edited data
	console.group("Edited Form Data");
	console.log(this.displayForm.users);
	console.groupEnd();
	  
	//add the edited user's age
	this.addUserAge();
	
	//editing has ended
	this.isEditable = false;
	
	
  }
	
  //update the edit cache 
  public updateEditCache(): void {
	this.displayForm.users.forEach(item => { 
		this.editCache[item.id] = {
			edit: false,
			data: { ...item }
		};
	});
  }
	
  /*remove the user from the table
  *   arg 1: the id of the user to be removed*/
  public removeUser(index: string) :void {
    let numIndex = parseInt(index);
	  
    //show confirmation for deleting a user from unfiltered array
	if(!this.isFilterable){
	  //find the index of the row of data that will be deleted
	  const removeIndex = this.displayForm.users.findIndex(item => item.id === index);  	
	  
	  if(confirm("Are you sure want to delete "+ this.displayForm.users[removeIndex].firstName + " " + this.displayForm.users[removeIndex].lastName + "?")) {

		this.displayForm.users.splice(removeIndex, 1);	
		
		//when the user in unfiltered array is removed, cancel the edit
		this.isEditable = false;
      }
	  
	}
	
	//if data is filterable
	else{
	  //find id of row to be deleted from displayUsers
	  const removeDisplayIndex = this.displayUsers.findIndex(item => item.id === index);
	  
	  //show confirmation for remove filtered data
	  if(confirm("Are you sure you want to delete "+ this.displayUsers[removeDisplayIndex].firstName + " " + this.displayUsers[removeDisplayIndex].lastName + "?")){

		//remove the deleted user from filtered data and unfiltered data
		this.displayUsers.splice(removeDisplayIndex, 1);
		this.displayForm.users.splice(numIndex, 1);
		
		//when the user in filtered array is removed, cancel the edit
		this.isEditable = false;
		
		//update table display 
		if(this.displayUsers.length !== 0){
		
		  //update the users array to hold current displayUsers data
		  this.displayUsers = [...this.displayUsers];
		}
		
		//if displayUsers is empty, update table display to show nothing
		else{
		  this.displayUsers = [...this.displayUsers];
		}
		
		//display updated form data	
		if(this.displayForm.users.length != 0){
		  //display the updated data after removing user
		  console.group("Updated Display Form Data After Removal");
		  console.log(this.displayForm.users);
		  console.groupEnd();
		}
		else{
		  console.group("Updated Form Data After Removal");
		  console.log("No form data");
		  console.groupEnd();
		}	
		
		//display updated filtered array 
		if(this.displayUsers.length != 0){
		  //display the updated data after removing user
		  console.group("Updated Display Users Data After Removal");
		  console.log(this.displayUsers);
		  console.groupEnd();
		}
		else{
		  console.group("Updated Display Users Data After Removal");
		  console.log("No form data");
		  console.groupEnd();
		}
	  }
	  
	}
	
	//update the ages array 
	this.addUserAge();
		
  }
  /**********************************************************
  * End of Edit User Methods
  *
  ***********************************************************/
	
	
  /**********************************************************
  * Beginning of Calculate User Age Methods
  *
  ***********************************************************/
	
  /*update user age array
  *  arg 1: takes the array of users that holds the data currently
  *  arg 2: the age array to be updated	*/
  private assignUserAgeData(usersArr: Array<User> , ageArr: Array<number> ): void {
	if(usersArr.length != 0){
	  //set the age minimum and age maximum of the user data 
	  this.ageMin = this.getAgeMin(ageArr);
	  this.ageMax = this.getAgeMax(ageArr);

	  //set the age average and round it up to nearest whole number
	  this.ageAvg = Math.round(this.getAgeAvg(ageArr));
	}
	//if empty set to 0 instead of having NaN or infinity
	else{ 
	  this.ageMin = 0;
	  this.ageMax = 0;
	  this.ageAvg = 0;
	} 
  }
	
  //calculate the user age for the user data or filtered data
  private addUserAge() :void {
	
	//update which set of data is used to calculate the age
	if(this.isFilterable){
	    
	  //make sure array is reset so filtered user age data is accurate
	  this.userFilteredAge.length = 0;
		
	  for(let user of this.displayUsers) {

		this.userFilteredAge.push(this.calculateAge(user));
		  		  
	  }
	
	this.assignUserAgeData(this.displayUsers, this.userFilteredAge);
	
	}
	  
	else{
	
	  //make sure array is reset so user age data is accurate
	  this.userAge.length = 0;
		
	  for(let user of this.displayForm.users) {
		this.userAge.push(this.calculateAge(user));
	  }
		
	  this.assignUserAgeData(this.displayForm.users, this.userAge);
	}
  }
	
  /*calculate the age of the user
  *  arg 1: a user  */
  private calculateAge(user: User) :number{
    let age = 0;
	
	var currentDate = new Date();
	
	let currentYear = currentDate.getFullYear();
	
	//get the user's birth year
	let yearStr = user.birthday.slice(0,4);
	
	let yearNum = parseInt(yearStr);

	age = currentYear - yearNum;
	
	return age;
	
	}
	
  //get the age minimum of an array
  private getAgeMin(age: number[]): number{
   	age: [];
	return Math.min(...age);
  }
	
  //get the maximum of an array
  private getAgeMax(age: number[]): number{
    age: [];
	return Math.max(...age);
  }
	
  //get the average of an array
  private getAgeAvg(age: number[]): number{
	age: [];
		
	return (age.reduce(function(a,b){
	  return (a + b)
	  }, 0))/age.length;
			
  }
  /**********************************************************
  * End of Calculate User Age Methods
  *
  ***********************************************************/
}

