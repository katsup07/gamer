# gamer
A REST API for an online video game store built with node.js and express.js.
## Installation for development
download zip file<br>
run `npm install` in root directoy to install dependencies<br>
set environment variable `$env:gamer_jwtPrivateKey="any_string_you_want"` <sub>(Note: Syntax for setting depends on OS)</sub><br>
run `npm start` to run nodemon<br>
app will be live on localhost:3000
## Integration/Unit Testing
Set the environment type.<br>
run `$env:NODE_ENV="test"` for integration/unit testing. <sub>(Note: Syntax for setting depends on OS)</sub><br>
run `$env:NODE_ENV="development"` for development. <sub>(Note: Syntax for setting depends on OS)</sub><br>
## Manually Testing the API routes
There currently is no front end app for manual testing, so something such as [`Postman`](https://www.postman.com/) can be used instead.
## Auth and Admin Routes
Users must first be registered before using auth post/put routes. Use Postman to register users.<br>
<br>
However, it is not currently possible to give users admin status outside of the database. This is required to delete data. The following test user can be used for testing the admin delete routes by authenticating and receiving a valid token:
```
{
    "email": "luke7@bear.com",
    "password": "010101"
}
```
