# Nachbar
Nachbar is going to be a location-based real-time network, which allows user to communicate with nearbys through broadcast or private messages.

The basic scenario is as following:

  - User A fills out nickname and some extra info, then login(No registration needed).
  - The system judges user A's geological position by GPS or IP, then find and return nearbys to A.
  - The client(browser or app) displays the nearbys on a map or as a list.
  - User A sends private message to one nearby B, or broadcasts a message so that all nearbys can receive it.

# Technology

Following technologies are used in the project:

  - node.js
  - express
  - mongodb
  - mongoose
  - coffee-script
  - jade
  - backbone.js
  - socket.io
  - jquery
  - jquery-ui
  - blueprint

# How to run

## Softwares to install

First, intall [node.js](http://nodejs.org/)

Second, install [npm](http://npmjs.org/)

    curl http://npmjs.org/install.sh | sh

Third, install [coffee-script](http://jashkenas.github.com/coffee-script/)

    npm install -g coffee-script

Finally, install [mongodb](http://www.mongodb.org/)

## Source and Packages

First, get source code from github

    git clone git://github.com/liufengyun/nachbar.git

Then, install packages

    cd nachbar

    npm install

Now run and have a cup of coffee:-)

    coffee nachbar.coffee
  
# Thanks

The initial code is based on the chat example of socket.io, see below:

https://github.com/LearnBoost/socket.io/tree/master/examples/chat

# Contacts

Please send email to liufengyunchina@gmail.
