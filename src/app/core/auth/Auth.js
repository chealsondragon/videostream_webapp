import auth0 from 'auth0-js';
import params from './../../../auth0-params';
import jwtDecode from 'jwt-decode';


export default class Auth {

  auth0 = new auth0.WebAuth({
    domain: params.domain,
    clientID: params.clientId,
    // audience: `https://${params.domain}/userinfo`,
    audience: params.apiAudience,
    redirectUri: params.callbackUrl,
    scope: params.scope,
    responseType: 'token id_token'
  });

  constructor() {
    this.signin = this.signin.bind(this);
    this.signout = this.signout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  signin(email, password) {
    return new Promise((resolve, reject) => {
      this.auth0.client.login(
        { realm: params.realm, username: email, password },
        (err, authResult) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          console.log(authResult);
          this.setSession(authResult);
          return resolve();
        }
      );
    })
  }

  signup(email, firstname, lastname, password) {
    return new Promise((resolve, reject) => {
      this.auth0.signup(
        { connection: params.realm, email, password, given_name: firstname, family_name: lastname },
        (err, authResult) => {
          if (err) {
            console.log(err);
            return reject(err);
          }

          console.log('signup', authResult);
          return resolve();
        }
      );
    })
  }

  signout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  }

  forgotPassword(email) {
    return new Promise((resolve, reject) => {
      this.auth0.changePassword(
        { email, connection: params.realm },
        (err) => {
          if (err) {
            console.log(err);
            return reject(err);
          }

          console.log('forgotPassword', 'success');
          return resolve();
        }
      );
    })
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
          return resolve();
        } else if (err) {
          console.log(err);
          return reject(err);
        }
      });
    })
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    const decoded = jwtDecode(authResult.idToken);
    console.log(decoded);
    localStorage.setItem('user_id', decoded.sub);
    localStorage.setItem('user_email', decoded.email);
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  getUserByToken() {
    return new Promise((resolve, reject) => {
      try {
        this.auth0.client.userInfo(
          localStorage.getItem('access_token'),
          (err, result) => {
            console.log(err, result);
            if (err) {
              reject(err);
              return;
            }
            console.log(result);
            resolve(result);
          })
      }
      catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  changePassword(curPass, newPass) {
    return new Promise((resolve, reject) => {
      const email = localStorage.getItem('user_email');
      this.auth0.client.login(
        {
          realm: params.realm, username: email, password: curPass,
          audience: `https://${params.domain}/api/v2/`, scope: "update:current_user_metadata read:current_user"
        },
        (err, authResult) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          console.log(authResult);

          const mgmt = new auth0.Management({
            domain: params.domain,
            token: authResult.accessToken
          });

          const userId = localStorage.getItem('user_id');
          mgmt.patchUserAttributes(userId, {
            user_metadata: {
              newPassword: newPass
            }
          }, (err, result) => {
            console.log(err, result);
            if (err) {
              console.log(err);
              return reject(err);
            }

            return resolve();
          })
        }
      );
    });
  }
}
