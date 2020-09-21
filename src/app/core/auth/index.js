import Auth from './Auth';

const auth = new Auth();

export function login(email, password, callback, failCallback) {
  const signin = auth.signin(email, password);
  console.log(signin);
  signin
    .then(() => {
      console.log('login');
      callback({ data: signin });
    })
    .catch((error) => {
      const errorMsg = error.description || error.message || 'Unspecified error';
      console.log('login', errorMsg);
      failCallback();
    });
}

export function register(email, firstname, lastname, password, callback) {
  auth.signup(email, firstname, lastname, password)
    .then(() => {
      console.log('register');
      callback();
    })
    .catch((error) => {
      const errorMsg = error.description || error.message || 'Unspecified error';
      console.log('register', errorMsg);
    });
}

export function logout() {
  auth.signout();
}

export function forgotPassword(email, callback) {
  auth.forgotPassword(email)
    .then(() => {
      console.log('forgotPassword');
      callback();
    })
    .catch((error) => {
      const errorMsg = error.description || error.message || 'Unspecified error';
      console.log('forgotPassword', errorMsg);
    });
}

export function changePassword(curPassword, newPassword, callback) {
  auth.changePassword(curPassword, newPassword)
    .then(() => {
      console.log('changePassword');
      callback();
    })
    .catch((error) => {
      const errorMsg = error.description || error.message || 'Unspecified error';
      console.log('changePassword', errorMsg);
    });
}

export async function getUserByToken() {
  try {
    const profile = await auth.getUserByToken();

    return { data: profile };
  }
  catch (error) {
    return null;
  }

  /* {
    data: {
      id: 1,
      username: "admin",
      password: "demo",
      email: "admin@demo.com",
      accessToken: "access-token-8f3ae836da744329a6f93bf20594b5cc",
      refreshToken: "access-token-f8c137a2c98743f48b643e71161d90aa",
      roles: [1], // Administrator
      pic: "/media/users/300_25.jpg",
      fullname: "Sean",
      occupation: "CEO",
      companyName: "Keenthemes",
      phone: "456669067890",
      address: {
        addressLine: "L-12-20 Vertex, Cybersquare",
        city: "San Francisco",
        state: "California",
        postCode: "45000"
      },
      socialNetworks: {
        linkedIn: "https://linkedin.com/admin",
        facebook: "https://facebook.com/admin",
        twitter: "https://twitter.com/admin",
        instagram: "https://instagram.com/admin"
      }
    }
  };*/
}

export function handleAuthentication(callback) {
  return function (dispatch) {
    auth.handleAuthentication()
      .then(() => {
        // auth
      })
      .catch(err => {
        // unauth
      });
  }
}