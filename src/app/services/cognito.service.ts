import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  ISignUpResult
} from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: environment.cognito.userPoolId,
      ClientId: environment.cognito.userPoolWebClientId
    });
  }

  signUp(user: User): Observable<ISignUpResult> {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: user.email }),
      new CognitoUserAttribute({ Name: 'given_name', Value: user.firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: user.lastName }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: '+1' + user.mobile })
    ];

    return new Observable(observer => {
      this.userPool.signUp(
        user.username,
        user.password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            observer.error(err);
            return;
          }
          observer.next(result!);
          observer.complete();
        }
      );
    });
  }

  signOut(): Observable<void> {
    return new Observable(observer => {
      const currentUser = this.userPool.getCurrentUser();
      if (currentUser) {
        currentUser.signOut();
      }
      observer.next();
      observer.complete();
    });
  }

  confirmSignUp(username: string, code: string): Observable<any> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    return new Observable(observer => {
      cognitoUser.confirmRegistration(code, true, (err: any, result: any) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next(result);
        observer.complete();
      });
    });
  }

  resendConfirmationCode(username: string): Observable<any> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    return new Observable(observer => {
      cognitoUser.resendConfirmationCode((err: any, result: any) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next(result);
        observer.complete();
      });
    });
  }

  signIn(username: string, password: string): Observable<any> {
    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
      Storage: window.localStorage
    });

    return new Observable(observer => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          observer.next({ success: true, session });
          observer.complete();
        },
        onFailure: (err) => {
          // Check if user is unverified
          if (err.code === 'UserNotConfirmedException') {
            observer.next({ 
              success: false, 
              requiresVerification: true, 
              username: username,
              message: 'Account not verified. Please check your email for verification code.'
            });
            observer.complete();
          } else {
            observer.error(err);
          }
        }
      });
    });
  }

  forgotPassword(username: string): Observable<void> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    return new Observable(observer => {
      cognitoUser.forgotPassword({
        onSuccess: () => {
          observer.next();
          observer.complete();
        },
        onFailure: (err) => {
          observer.error(err);
        }
      });
    });
  }

  resetPassword(username: string, code: string, newPassword: string): Observable<void> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    });

    return new Observable(observer => {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
          observer.next();
          observer.complete();
        },
        onFailure: (err) => {
          observer.error(err);
        }
      });
    });
  }
}
