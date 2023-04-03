# gamer
A REST API for an online video game store built with node.js and express.js.
## Installation for development
download zip file<br>
run `npm install` in root directoy to install dependencies<br>
run `npm start` to run nodemon<br>
set environment variable `$env:gamer_jwtPrivateKey="any_string_you_want"` <sub>(Note: Syntax for setting depends on OS)</sub><br>
app will be live on localhost:3000
## Integration/Unit Testing
Set the environment type.<br>
run `$env:NODE_ENV="test"` for integration/unit testing. <sub>(Note: Syntax for setting depends on OS)</sub><br>
run `$env:NODE_ENV="development"` for development. <sub>(Note: Syntax for setting depends on OS)</sub><br>
## Manually Testing the api routes
There currently is no front end app for manual testing, so something such as [`Postman`](https://www.postman.com/) can be used.
## Auth and Admin Routes
Users must first be registered before using auth post/put routes. Use Postman to register users.<br>
However, it is not currently possible to give users admin status outside of the database. The following test user's _id can be used for testing the admin delete routes:
```
_id: 642422f0ff89040bd0a6b09c
name: "Lukey2"
email: "luke2@bear.com"
password: "$2b$10$faOYWa3d/3/fwIpUbtLwMuU31jl4MLRmZDDRE9aThxMZvUK5.9aLi"
isAdmin: true
```
