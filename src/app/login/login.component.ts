import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConstants } from '../common/app.constants';
import { FormBuilder } from '@angular/forms';
import { User } from './User';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUser: any;
  public user: User = new User();
  googleURL = AppConstants.GOOGLE_AUTH_URL;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb : FormBuilder,
     private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  form = this.fb.group({
    username: [''],
    password: ['']
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.form.value.username, this.form.value.password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        if(data.authenticated){
	        this.login(data.user);
        } else {
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  login(user): void {
	  this.tokenStorage.saveUser(user);
	  this.isLoginFailed = false;
	  this.isLoggedIn = true;
	  this.currentUser = this.tokenStorage.getUser();
    window.location.href = '/home';
  }

  addUserRole(user: User) {
    this.user.id = this.currentUser.id;
    this.userService.addUserRole(this.user).subscribe(
      (response) => {}
    );
  }
}
