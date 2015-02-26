# web-app

First Run
-----------------------
1. If on a Mac first install [Xcode](https://developer.apple.com/xcode/downloads/)
2. Install [MongoDB](https://www.mongodb.org/downloads)
3. Install [Node.js](http://nodejs.org/download/)
4. Install Imagemagick using [Homebrew](http://brew.sh/) if you're using OS X

				$ brew install imagemagick
				$ brew install graphicsmagick

5. Navigate to the web-app directory
6. Install npm dependencies:

        $ npm install
				$ npm install gm
        $ npm install --global gulp

7. Create a folder for the MongoDB server with

        $ mkdir db

8. Use ``gulp`` to run the application (it will automatically start Mongo)
9. Navigate your browser to [http://localhost:4000](http://localhost:4000/)
