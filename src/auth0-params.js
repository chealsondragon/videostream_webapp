let config = {
  "domain": "soarin.auth0.com",
  "clientId": "6xE190WSmE2Xsf4Tl9fL1GoWji1DZWAO",
  "callbackUrl": "http://localhost:3000/auth/login",
  "realm": "Username-Password-Authentication",
  "apiUrl": "http://localhost:8000",
  "apiAudience": "",
  "scope": "openid email update:email update:password",
  "responseType": "token id_token"
};

if (process.env.ON_SERVER === 'true') {
  config.callbackUrl = process.env.CALLBACK_URL;
  config.apiAudience = process.env.API_AUDIENCE;
  config.apiUrl = process.env.API_URL;
}

export default config;
