# gamer
A REST API for an online video game store built with node.js, express.js, and MongoDB.
## Installation for development
download zip file<br>
run `npm install` in root directoy to install dependencies<br>
set environment variable `$env:gamer_jwtPrivateKey="any_string_you_want"` <sub>(Note: Syntax for setting depends on OS)</sub><br>
run `npm start` to run nodemon<br>
app will be live on localhost:3001
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
## Requests and Responses with Postman
Authenticate and receive an auth token in response body for a previously existing user.
<img width="1920" alt="auth-token" src="https://github.com/katsup07/gamer/assets/90941888/94ae2c2b-34c2-4204-87b5-ec3646ad69c3">
<br>
<br>
Make a post request with a new game to add to the database.
<img width="1914" alt="create-game" src="https://github.com/katsup07/gamer/assets/90941888/fce1cf8e-7608-41db-9aec-e2edf232f69d">
<br>
<br>
Set auth token in headers before making any post, put, or delete requests. Game data will be returned in response upon success.
<img width="1917" alt="success" src="https://github.com/katsup07/gamer/assets/90941888/2b696bab-84d1-43f2-b16a-bf1ed41e87d7">
<br>
<br>
Get all games from database and view newly created game info in response.
<img width="1915" alt="get-all" src="https://github.com/katsup07/gamer/assets/90941888/05a2faf5-4844-4413-a251-deceeb2ea5c2">
<br>
<br>
Create a new user and receive auth token in response headers.
<img width="1914" alt="create-new-user" src="https://github.com/katsup07/gamer/assets/90941888/edf755de-87d6-4454-a362-105ba58366d0">
<br>
<br>
## Example UI connected to Gamer API
<img width="935" alt="Desktop Screenshot 2023 07 27 - 18 50 46 69" src="https://github.com/katsup07/gamer/assets/90941888/96b63fd3-868b-4ae6-86fe-de9b91f3544e">

