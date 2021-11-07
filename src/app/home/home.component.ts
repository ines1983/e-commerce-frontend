import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../common/app.constants';
import { User } from '../login/User';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  content: string;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUser: any;
  public user: User = new User();
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  
  constructor( private tokenStorage: TokenStorageService, private userService: UserService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const token: string = this.route.snapshot.queryParamMap.get('token');
	const error: string = this.route.snapshot.queryParamMap.get('error');
  	if (this.tokenStorage.getUser()) {
      this.isLoggedIn = true;
      this.currentUser = this.tokenStorage.getUser();
    }
  	else if(token){
  		this.tokenStorage.saveToken(token);
      this.userService.getCurrentUser().subscribe(
        data => {
          this.login(data);
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
  	} else if(token === null) {
      this.isLoggedIn = false; 
    }
  	else if(error){
  		this.errorMessage = error;
	    this.isLoginFailed = true;
  	}
  }

  login(user): void {
	  this.tokenStorage.saveUser(user);
	  this.isLoginFailed = false;
	  this.isLoggedIn = true;
	  this.currentUser = this.tokenStorage.getUser();
    window.location.href = '/home';
  }
}
