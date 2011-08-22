# Nachbar
  Nachbar is going to be a location-based real-time network, which allows user to communicate with nearbys through broadcast or private messages.

  The basic scenario is as following:

  - User A fill out a nickname and some extra info, then login(No registration needed).
  - The system judges user A's geological position by GPS or IP, then find and return nearbys to A.
  - The client(browser or app) displays the nearbys on a map or as a list.
  - User A sends private message to one nearby B, or broadcast a message so that all nearbys can receive it.

# Technology

  Following technologies are used in the project:

  - node.js
  - mongodb
  - mongoose
  - coffee-script
  - express
  - jade
  - jquery
  - socket.io

# How to run

  Softwares to install:  

  * intall [node.js](http://nodejs.org/)
  * install [npm](http://npmjs.org/)

    curl http://npmjs.org/install.sh | sh

  * install [coffee-script](http://jashkenas.github.com/coffee-script/)

    npm install -g coffee-script

  * install [mongodb](http://www.mongodb.org/)

  Source and Packages:

  * get source code

    git clone git://github.com/liufengyun/nachbar.git

  * install packages

    cd nachbar

    npm install

  Now run and have a cup of coffee:-)

    coffee nachbar.coffee
  
# Thanks

  The initial code is based on the chat example of socket.io, see below:

  https://github.com/LearnBoost/socket.io/tree/master/examples/chat

# Contacts

  Please send email to liufengyunchina@gmail.
