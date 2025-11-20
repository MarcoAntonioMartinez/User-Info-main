import { Injectable } from '@angular/core';
import { User } from './user-info/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //form instance with User array property used to acquire data from 1st page form
  public form: {
	users: User[];
  };

  //initialize the form's users array
  constructor() {

	this.form = {
		users: []
	};
	
  }
  //setter for the users array
  setUsers(usersArr: User[]){
	this.form.users = usersArr;
  }
  //getter for the users array
  getUsers(): User[] {
	
	return this.form.users;
  
  }
  
}
