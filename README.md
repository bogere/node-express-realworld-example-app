# ![Node/Express/Mongoose Example App](project-logo.png)

[![Build Status](https://travis-ci.org/anishkny/node-express-realworld-example-app.svg?branch=master)](https://travis-ci.org/anishkny/node-express-realworld-example-app)

> ### Example Node (Express + Mongoose) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.

<a href="https://thinkster.io/tutorials/node-json-api" target="_blank"><img width="454" src="https://raw.githubusercontent.com/gothinkster/realworld/master/media/learn-btn-hr.png" /></a>

This repo is functionality complete — PRs and issues welcome!

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm run dev` to start the local server
- `npm test ` to run the tests including testing all the category API.

#Usage
After running the above command `npm run dev` to start the local development server, then you can visit the localhost:3000/api/articles to view the articles. 
For the categories, you shall use postman tool or curl script to test the API requests. remember some API  routes require authentication before you can access them.
Easiest way is to run `npm test` and get the details of teh mock up API requests that you can use to test in postman tool or curl script.
-fetching all categories.
 Category
└ All Categories for Articles
  GET http://localhost:3000/api/category 
Create Category for Article
  POST http://localhost:3000/api/category
  formData ==> title | description | parentCategory | author
Update Category for Article
PUT http://localhost:3000/api/category 
 formData ==> title | description | parentCategory

     

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication
- [slug](https://github.com/dodo/node-slug) - For encoding titles into a URL-friendly format

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.

## Error Handling

In `routes/api/index.js`, we define a error-handling middleware for handling Mongoose's `ValidationError`. This middleware will respond with a 422 status code and format the response to have [error messages the clients can understand](https://github.com/gothinkster/realworld/blob/master/API.md#errors-and-status-codes)

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.


##Design Patterns
What are design patterns?
A design pattern is a general, reusable solution to a commonly occurring problem.
1.Singleton..
 The singleton patterns restrict the number of instantiations of a "class" to one. No matter how many times the  `require('./auth')` or `require('express')` statement is used in nodejs application, it is only  instantiated once(singleton pattern)
//auth.js
```js
var auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth; ```
//category.js
```js
var router = require('express').Router(),
    mongoose = require('mongoose')
    Category = mongoose.model('Category'),
     User = mongoose.model('User'),
     auth = require('../auth'); 

    //API End points for adding, deleting categories.
// Preload category objects on routes with ':category'
router.param('category', function(req, res, next) { //missing statements}
```

  2. middlewares/pipelines
  Middleware--> the output of one unit/function is the input for the next. Express server has many middlewares that help in error handling , logging the request and responses.
  In this case they take in request object as input, work on it via the middleware and give 
  the output in form of response object
  // Normal express config defaults (configuring the middleware)
 ```js
  app.use(cors());
   app.use(require('morgan')('dev'));
// parse application/x-www-form-urlencoded--> raw format
   app.use(bodyParser.urlencoded({ extended: false }));
  //parse application/json
  app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}
```

3.Factory pattern
Factory is a creational design pattern allowing us to abstract away object creation implementation details from the outside world. Express does this by only exporting the factory.
```js
/**
 * Expose `createApplication()`.
 */
exports = module.exports = createApplication;
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };
  ...
  return app;
}

//And, using the factory to create an express application is as simple as this:
import express from 'express';
..
const app = express();
```
<br />

##Is the codebase maintainable, unit-testable, and scalable?
-The codebase is `maintainable` because the project files are well structured and follow most  express-mongodb boilerplate structure , thus easier to add the data models to the models directory, configuration values such as environment variables and database access ports via the config directory. Then the routes directory hold the api directory that defines the API structure for the application
-`Difficulty in performing unit tests`  because most api routes are not written in form of functions.
-`Not scalable`  because it lacks the caching capabilities and nodejs application still use server side sessions instead of only the tokens fro authorisation purposes. session method is not scalable on the server side




[![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)
