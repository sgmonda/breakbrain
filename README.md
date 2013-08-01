Current status (based on integration tests):

[![Build Status](https://secure.travis-ci.org/sgmonda/stdio.png)](http://travis-ci.org/sgmonda/stdio)

#Breakbrain

Social network to improve mental skills by mean of mini-games

## About Breakbrain

Breakbrain is a complex social network oriented to improve mental skills by mean of multiplayer and single-player mini-games playing. It has been built on top of NodeJS, using MongoDB as persistence system. Breakbrain has been thought to support 3rd-party games integration, so you can be a part of the developing community if you want, allowing other users to play your games. It is awesome, isn't it?

![Alt text](/docs/memoria/images/horizontal-logo.png)

Breakbrain offers you a stats dashboard where you can see your mental skills evolution and compare it with other users one. Furthermore, this social network integrates a recommendation module to tip you about what games you must play (based on your skills) and which players you could follow.

Social aspects are really simple: you can follow other users, to see their evolution and news and play multi-player games against them, and other users can follow you.

## Installation

### Prerequisites

#### NodeJS

First of all you need NodeJS installed on your computer. It's really easy; you can find downloads and documentation in [the official NodeJS website](http://nodejs.org/ "NodeJS").

In the case you are using Ubuntu GNU/Linux, it is even easier:
````
$ sudo apt-get install nodejs
````

Once you have NodeJS correctly installed, you must be able to see node's version. In my case:
````
$ node -v
v0.8.5
````

#### MongoDB

Once NodeJS is installed on your system, the next step is to install MongoDB database. As in the previous case, it is easy to install, using [the official downloads and documentation](http://mongodb.org "MongoDB").

Remember that GNU/Linux simplifies your life. With Ubuntu:
````
$ sudo apt-get install mongodb
````

After installing MongoDB, you must be able to check everything works ok. In my case:
````
$ mongo --version
MongoDB shell version: 2.2.3
````
### Breakbrain installation and usage

When NodeJS and MongoDB are working properly, you are ready to install Breakbrain in your machine. To do it, just follow these steps:

- Download this repository as a ZIP file into a known directory. Alternatively, if you have [git](http://git-scm.com/ "Git") you can clone this repository directly.
````
git clone https://github.com/sgmonda/breakbrain
````

- Go into the downloaded directory with a terminal.
````
cd breakbrain
````

- Install the dependences:
````
$ npm install
````

- Using Breakbrain platform now is very easy, just start the server:
````
$ node server.js
Tue, 30 Jul 2013 22:48:45 (GMT) :: DATABASE: Connecting to MongoDB database...
Tue, 30 Jul 2013 22:48:46 (GMT) :: DATABASE: Connected and authenticated successfully
Tue, 30 Jul 2013 22:48:46 (GMT) :: EMAIL-MODULE: Email subsystem ready to send emails
Tue, 30 Jul 2013 22:48:46 (GMT) :: GAMES-MODULE: Loading games server...
Tue, 30 Jul 2013 22:48:46 (GMT) :: WEB SERVER: running on port 20661
Tue, 30 Jul 2013 22:48:46 (GMT) :: GAMES-MODULE: Loading game "Un juego"... in Working memory (Memory)
Tue, 30 Jul 2013 22:48:47 (GMT) :: WEBSOCKETS SERVER: running on port 20661
Tue, 30 Jul 2013 22:48:47 (GMT) :: MAIN SERVER: The whole server is ready!
````
- Now you can open the following page in a web browser
````
http://localhost:20661
````

That's all. Enjoy Breakbrain!




