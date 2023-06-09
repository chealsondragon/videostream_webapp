# Investor Dashboard

### GitLab CI/CD

Environment Variables

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

AWS_REGION

AWS_OUTPUT

### Elastic Beanstalk

t2.medium - 0.046$/hr

apache

Node.js 12.16.1


`eb ssh`

```
$ node
-bash: node: command not found
```


Environment Variables

| Key | Value | Desc |
| ----|-------|------|
| API_AUDIENCE | `https://investors.soarinenergy.com` | |
| API_URL | `https://investors.soarinenergy.com` | |
| CALLBACK_URL | `https://investors.soarinenergy.com` | |
| ON_SERVER | `true` | |


On GitLab, commands: ..., `eb deploy`
On EC2, commands: `npm install` (with --production flag), `npm run dev`


Ways to serve static files:
`serve`: development mode (rewrites/redirects with serve.json)
`react-scripts start`: development mode - requires node-sass
`react-scripts build && node serve.js`: development mode - requires node-sass
`node serve.js`: production mode, looks okay - requires `build` prebuilt


#### Auth0

[Embedded Login vs Universal Login](https://auth0.com/docs/guides/login/universal-vs-embedded)

We are doing `Embedded Login`.

[Libraries](https://auth0.com/docs/libraries)

`Auth0 SPA SDK` is only for the Universal Login.

`Lock` is an embeddable login form that can be configured to your needs and is recommended for use in single-page apps, preferably in conjunction with Universal Login.

`auth0.js` is a client-side library for Auth0. It is recommended for use in single-page apps, preferably in conjunction with Universal Login.

We are using `auth0.js`. It's the only choice for our custom designed interface.

[Auth0.js Documentation](https://auth0.github.io/auth0.js/index.html)

In this project, we implement Auth0 in React (with saga). We don't have any backend.

| Key | Value | Desc |
| ----|-------|------|
| domain | soarin.auth0.com |  |
| clientId | 6xE190WSmE2Xsf4Tl9fL1GoWji1DZWAO |  |
| callbackUrl | http://localhost:3000/auth/login | Return URL after login |
| realm | Username-Password-Authentication | Database Connection Name (in Auth0 dashboard) |
| apiUrl | http://localhost:8000 | not used |
| apiAudience |  | blank when SPA general authentication, `.../api/v2/` when management API authentication |
| scope | openid email update:email update:password |  |
| responseType | token id_token |  | 


Try Django or React app in Auth0 dashboard. That would be helpful to understand.

Users are registered in the specified (with realm) Auth0 database and can be found at [Users](https://manage.auth0.com/dashboard/us/soarin/users).
#   i n f l u e n c e r - w e b a p p  
 