# web-app

First Run
-----------------------
1. If on a Mac first install [Xcode](https://developer.apple.com/xcode/downloads/)
2. Install [MongoDB](https://www.mongodb.org/downloads)
2. [Install Node.js](http://nodejs.org/download/)
3. Globally install Grunt, Yeoman, and Bower:

        $ npm install -g grunt-cli
        $ npm install -g yo
        $ npm install -g bower
        
 (Optional) install [Angular Fullstack Generator](https://github.com/DaftMonk/generator-angular-fullstack#generators) for yo, not necessary for running the app, but it has useful features to auto-generate code:
        
        $ npm install -g generator-angular-fullstack
4. Navigate to the web-app directory
5. Install npm and bower dependencies:

        $ bower install 
        $ npm install

6. Start up the MongoDB server with

        $ mkdir db
        $ mongod --dbpath db

7. Use ``grunt serve`` to run the application.

Build & Deploy to Continous Integration & Deployment
-----------------------
To build and deploy to the production branch which will be grabbed by CodeShip for testing and deploying.
```
grunt build:dist
grunt buildcontrol:deploy
```

Project Structure
-----------------------
Overview (to change, using default structure)

    ├── client
    │   ├── app                 - All of our app specific components go in here
    │   ├── assets              - Custom assets: fonts, images, etc…
    │   ├── components          - Our reusable components, non-specific to to our app
    │
    ├── e2e                     - Our protractor end to end tests
    │
    └── server
        ├── api                 - Our apps server api
        ├── auth                - For handling authentication with different auth strategies
        ├── components          - Our reusable or app-wide components
        ├── config              - Where we do the bulk of our apps configuration
        │   └── local.env.js    - Keep our environment variables out of source control
        │   └── environment     - Configuration specific to the node environment
        └── views               - Server rendered views

An example client component in `client/app`

    main
    ├── main.js                 - Routes
    ├── main.controller.js      - Controller for our main route
    ├── main.controller.spec.js - Test
    ├── main.html               - View
    └── main.less               - Styles

An example server component in `server/api`

    thing
    ├── index.js                - Routes
    ├── thing.controller.js     - Controller for our `thing` endpoint
    ├── thing.model.js          - Database model
    ├── thing.socket.js         - Register socket events
    └── thing.spec.js           - Test

Tools
-----------------------
* Yeoman
    - A webscaffolding tool to get you sprinting instead of wasting time trying to setup your project.
    - Has tons of generators to fit your tech. stack of choice, one of the most popular ones, which we'll be using is called [angular-fullstack-generator](https://github.com/DaftMonk/generator-angular-fullstack).
    - Simply type `yo` and choose what you want in your project and you're up and running.
* Bower
    - This manages packages so you don't have to. Simply type `bower install` and it will install all packages in your `bower.json` everytime.
    - This is great because you don't have your web dependencies in your repo. You just have to simply run bower when you download a new project.
* Grunt
    - Building and Automation Tool, it can also be used with [Heroku's toolbelt](https://github.com/DaftMonk/generator-angular-fullstack#heroku) for deployment.
    - Building and deploying are two commands away, `grunt && grunt buildcontrol:heroku`
    - Also runs client-side and server-side unit tests with Karma.
    - `grunt serve` will be used alot to run the application and another good feature is grunt's injector. It will automatically restart the server or refresh your page if theres any change in server-side or client-side code.
* NPM
    - Node Package Manager - a bunch of package for node including all the tools above.
    - Running `npm install` will look for the `package.json` file to install all the server-side dependencies.
* More to come
