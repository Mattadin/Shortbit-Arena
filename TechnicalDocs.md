# Polar Palace Technical Documentation

## Description
A thorough walktrough of the technology implementations and pointed sources to how interactions are done within the react application of Polar Palace.

![alt text](https://github.com/Mattadin/polar-palace/blob/main/client/src/img/polarpalacebg2.0.png)


## Goals
The goal of this project is to create a space where users will be able to connect with existing or potential new friends through a carefree environment where fun is the end experience. This project attempts to capture key features such as simple maintenance, inter-connectivity of users, scalability, security and performance. Motivation for this project comes from a societal increase in adults who play video games coupled with an undersaturated market of games available for gaming parents who wish to introduce their children to the hobby. Polar Palace sets out to create an environment which provokes thought and meaning for growing minds, while offering a simple and fun game for parents and their children.


## Table of Contents
- [Description](#description)
- [Goals](#goals)
- [Technology Used](#technology-used)
- [Alternatives Considered](#alternatives-considered)
- [Game Baselines](#game-baselines)
- [The Game Lifecycle](#the-game-lifecycle)
- [Advanced Canvas](#advanced-canvas)
- [Questions](#questions)

# Technology Used
•	React
•	Node.js
•	Express.js
•	HTML
•	CSS
•	Javascript
•	JSX
•	Apollo Server
•	Graph QL
•	Socket.io
•	Canvas
•	JWT
•	MongoDb
•	Mongoose
•	Heroku

A quick glance will alert a user to the basic infrastructure of this project, which is utilization of the MERN stack in combination with certain outliers. MERN was chosen for the stack base due to project requirements. The Apollo and Graph QL duo are implemented as the primary source of database querying for its ease of use and integratability with react applications.  JSON Web Token (JWT) is used for user authentication and session tracking again for ease of use. For the game screen, Canvas is the chosen candidate as its reliability and versatile nature lends itself well to ease of maintenance and application. Socket.io is chosen as the means for interconnectivity between client and server as an introduction to websockets and for assisting in extremely tight sprint deadlines.


# Alternatives Considered

## Bootstrap/Tailwind
Bootstrap and Tailwind were purposely omitted to reduce lack of predictability for the limited deadlines for this sprint. In future iterations a quick refactor to one of these technologies will be strongly considered.

## Websockets
Websockets were purposely omitted again since the current implementation is shallow enough to be supported by the simple socket.io library, which allowed for much quicker advancements in feature development for this short sprint.

## MySQL
MySQL and specifically Sequelize was strongly considered for use in this project as OOP is the backbone from which it is built, but as the current database storage requirements are low and will continue to be so, the complex nature of defining relationships in MySQL served to be too high consumption on man hours for this sprint. As future developments such as Co-Op Story Mode are developed, a dedicated refactor to MySQL will be considered but is unlikely.

# Game Baselines

Before discussing in detail the complex web of action and reaction that takes place within the game portions of Polar Palace, it is prudent to first discuss the infrastructure in place that supports these interactions. Inspiration for this style is deep rooted in my particular passions in back-end development and therefore my approach to designing the relationships within the game are reflective of interconnected data groups.

## Canvas

Our canvas serves as a visual aid for the actions and reactions our users will experience throughout their gameplay experience within Polar Palace. The technology is simplest in theory and its use is occasionally mentioned during our lifecycle portion of this documentation. Therefore we will discuss some essentials to give context before discussing our life cycle, then we'll return to discuss the more advanced interactions that occur within the application.

At the core, Canvas requires we interact with the DOM- however in react, this is not a reality- even by simply using a ref we encounter issues with the backbone for its drawing engine, the method getContext(''). This forces its use case into a useEffect which we will want to set socket as a dependency for re-render as our socket content will be passing new updated info to be drawn for our Players and Projectiles. Canvas allows for many different applications, but for the purposes of Polar Palace we will be using the 2d context and with the exception of our overlay canvas (discussed in Advanced Canvas section) we will simply be drawing a series of images. We do this by defining the image and telling our context 2d variable (in our case ctx) to draw it with ctx.drawImage().

## Back End:

## Entity

As we discuss in depth the relationships and their importance, its important to begin with the Entity constructor. On initial inception, there was simply a "Player" and "Projectile" however I quickly discovered there were several shared traits between the two. This consideration lead to the creation of the "Entity" constructor which simply contains the shared traits between a Player and a Projectile. Param is passed as an argument for easy access to shared information as we delve deeper into how entity object data is passed between front and back end when we discuss the life cycle later in this discussion.

*../server/Entities.js beginning from line 2*

    Entity = (param) => {
    let self = {
        x: 250,
        y: 250,
        spdX: 0,
        spdY: 0,
        id: '',
        map: 'map',
    };
    if (param) {
        if (param.x) {
        self.x = param.x;
        }
        if (param.y) {
        self.y = param.y;
        }
        if (param.map) {
        self.map = param.map;
        }
        if (param.id) {
        self.id = param.id;
        }
    }

## The Player

The user controls a single "character" which will serve as the identity of the player. On the back end, we define this as a simple constructor with data from the Entity constructor, still passing param for future use and defining traits required for tracking the user's location, mouse angle, speed, and establishing default states of activity all set to "false" to define the initiated player as "stationary" or no actions being taken.

*../server/Entities.js beginning from line 63*

        Player = (param) => {
        let self = Entity(param);
        self.number = '' + Math.floor(10 * Math.random());
        self.displayName = '';
        self.pressingRight = false;
        self.pressingLeft = false;
        self.pressingUp = false;
        self.pressingDown = false;
        self.pressingAttack = false;
        self.mouseAngle = 0;
        self.maxSpd = 10;
        self.hp = 100;
        self.hpMax = 100;
        self.level = 0;
        self.ultimate = 0;
        self.img = '';
        }


## The Projectile

Very similar to the Player, the Projectile identifies as an Entity while passing param as an argument, and like the Player constructor it also seeks to track location and speed but with some key differences. The projectile in its nature is largely uncontrolled by any player once it is "initiated"- it must fly in a specific direction for a specifically defined amount of time.

*../server/Entities.js beginning from line 248*

    Projectile = (param) => {
    let self = Entity(param);
    self.id = Math.random();
    self.angle = param.angle;
    self.spdX = Math.cos((param.angle / 180) * Math.PI) * 20;
    self.spdY = Math.sin((param.angle / 180) * Math.PI) * 20;
    self.shooter = param.shooter;

Below we define the angle from which the snowball knows where to fly (aka param.angle):

*../client/src/pages/Game.js beginning from line 298*

    document.onmousemove = (event) => {
      // find relative to center of the canvas
      let x = -250 + event.clientX - 200;
      let y = -250 + event.clientY - 100;
      // find the angle by extracting the y and the x using atan2
      let angle = Math.atan2(y, x) / Math.PI * 180;
      socket.emit('keyPress', { inputId: 'mouseAngle', state: angle });
    };

Here we are able to find the angle of the mouse relative to the center of the Canvas (in Polar Palace, canvas is a 500px by 500px square) minus the pixelated differences due to margin or padding. Then using atan2 we find the angle and pass that information from the front end to our back end, where it is passed as a parameter for our Projectile in entities.

The final important key of the Projectile is defining the person projecting it. In order to streamline prevention of a person hitting themselves with snowballs, its important to define the original projector for later reference in an if statement. 

## Recap

With an initial understanding of the infrastructure for the game state in our back end, we can now begin a discussion about the total lifecycle in which the front end is inseparably part of. Due to the complex nature of the relationship between Socket.io and Canvas, it is important that the process tracking and drawing our Players and Projectiles happen in the front end and pass this information through "packets."


# The Game Lifecycle

To be brief, the game's lifecycle runs on a trinity principle in which packeted information is sent back and forth from client to server, sending and receiving only the absolute necessities for maintaining a smoothe game state for all players simultaneously. These packets are organized by price of data- Initialization Package (init pack), Update Package (update pack) and Removal Package (removal pack). Upon inception, the game simply ran update packages and removal packages- however with use of profiling from dev tools it became apparent that the update packets constantly re-inventing a new Player (including assigning new ID, new draw, new positions etc) became very data expensive. By creating a tertiary, rarely necessary packet which handles the bulk of the expense the data load became streamlined and efficiency nearly quadroupled.

## Birth of a Player

Due to the nature of react, the entirety of our canvas interactions are wrapped in a useEffect(() => { }, [socket]). Unfortunately, socket will initiate as soon as a user enters the /game page is called. To prevent socket bugs from preventing rendering, we attach a clever piece of tech to our use effect causing it to begin its game functionality once the canvas has fully rendered:

*../client/src/pages/Game.js beginning from line 309*

      socket.emit('clientReady');

This tells our back end to begin initiating our game, which is listening with:

*../server/server.js beginning from line 63*

        socket.on('clientReady', ()=>{
        Player.onConnect(socket);
        // every frame update the game state and empty arrays to avoid duplication
        setInterval(() => {
        const packs = Entity.getFrameUpdateData();
        for (let i in SOCKET_LIST) {
            let socket = SOCKET_LIST[i];
            socket.emit('init', packs.initPack);
            socket.emit('update', packs.updatePack);
            socket.emit('remove', packs.removePack);
        }
        }, 80);
    });

This tells socket that a player is prepared to be "connected" to the game, generate a socket ID and begin checking every 80ms for various packet data being sent from the front end in the same intervals. These packets are handed off for use in our Entity class(shared attributes between Player and Projectile) and front end to know to begin generating these new entities:

*../server/Entities.js beginning from line 43*

    // Function that contains our initialization, removal, and update packets- resets the arrays and returns the updated info
    Entity.getFrameUpdateData = () => {
    let pack = {
        initPack: {
        player: initPack.player,
        projectile: initPack.projectile,
        },
        removePack: {
        player: removePack.player,
        projectile: removePack.projectile,
        },
        updatePack: {
        player: Player.update(),
        projectile: Projectile.update(),
        },
    };
    initPack.player = [];
    initPack.projectile = [];
    removePack.player = [];
    removePack.projectile = [];
    return pack;
    };

*../client/src/pages/Game.js beginning from line 150*

    socket.on('init', (data)=> {
        if(data.selfId) {
            selfId = data.selfId;
        }
        for(let i = 0 ; i < data.player.length; i++) {
            new Player (data.player[i]);
        }
        for(let i= 0; i < data.projectile.length; i++) {
            new Projectile(data.projectile[i]);
        }
    })



Here we create a series of empty arrays which are constantly emptied and refilled with updated user info based on our trinity packages. With our pre-reqs out of the way, we can now begin breaking down these packets.

## Init Pack

Now our user has a rendered canvas, the server has emitted its first batch of init/update/removal packs and the engine is running- immediately our Player entity gathers all the expensive data that constitutes our init pack:

*../server/Entities.js beginning from line 117*

        self.getInitPack = () => {
        return {
        id: self.id,
        x: self.x,
        y: self.y,
        number: self.number,
        hp: self.hp,
        hpMax: self.hpMax,
        level: self.level,
        ultimate: self.ultimate,
        map: self.map,
        img: self.img,
        };
    };


this information is immediately passed over to our front end mirror, the Player constructor which takes in initPack as a parameter to easily pass this data along:

*../client/src/pages/Game.js beginning from line 76*

    class Player {
            constructor(initPack) {
            let self = {};
            self.id = initPack.id;
            self.number = initPack.number;
            self.displayName = displayName;
            self.x = initPack.x;
            self.y = initPack.y;
            self.hp = initPack.hp;
            self.hpMax = initPack.hpMax;
            self.level = initPack.level;
            self.ultimate = initPack.ultimate;
            self.map = initPack.map;

Now that we have passed the relevant information to our client from the back end, we need to provide some visualization for our user to enjoy their newly created charater. We do this by passing the information to canvas, give it a context (ctx) to draw in, and provide the math to know where to place everything.

*../client/src/pages/Game.js beginning from line 90*

           self.draw = ()=> {
            if(Player.list[selfId].map !== self.map) {
                return;
            }
            let x= self.x - Player.list[selfId].x + 250;
            let y = self.y - Player.list[selfId].y + 250;

            let width = Img.player[userChoice].width/16;
            let height = Img.player[userChoice].height/16;

            let hpWidth = 30 * self.hp / self.hpMax;
            ctx.fillStyle = 'red';
            ctx.fillRect(x - hpWidth/2, y - 40, hpWidth, 4);
            // setting parameters for how to use the player images to render our user's sprites

            ctx.drawImage(Img.player[userChoice],
            0, 0, Img.player[userChoice].width, Img.player[userChoice].height,
            x-width/2, y-height/2, width, height);
        }
        Player.list[self.id] = self;
        return self;

Our Player.list[selfId] is defined in our server-side Player constructor as a culmination of all the properties we handed off in the self.getInitpack. Upon getting the init pack, we then push all the paramets of our new Player into an empty object in both the front and back end creating a mirrored Player.list to simplify the passing of information in both our client side and server side. When drawing, we first determine which map the player is in (currently either TUNDRA or PALACE)- once we've determined, we simply return when canvas attempts to draw the player on the alternative map. This instantiates our users and prevents them from affecting users on a different map, keeping both maps as seperate pseudo lobbies. Next we aim to define the x and y of the players by taking the individual's x and y and adjusting relative to the center of the canvas. Next we define the size of the images being rendered, for our current image sizes a division factor of 16 provided the sweet spot for visibility to canvas view consumption ratio. Finally we draw up the health bar of the characters using a fillRect and use simple algebra to have the bars decrease as the Player.maxHealth stat is decreased (by being hit with Projectiles).

This process is mirrored by the Projectile properties which similarly has mirrored properties and a Projectile.list on each end, the drawing process is the same but with the same differences of drawing perpetually moving entities that follow the path of our angle as previously defined using atan2 and the relative center of our canvas.


## Update Pack

With the bulk of the data now exchanged, all that is left is to simply maintain the state of the game every frame. We do this through our "update" packs which are relatively light weight packets that simply follow the entity's actions throughout their life span. Our update packet (emitted by the server every 80ms) looks like this:

*../client/src/pages/Game.js beginning from line 167*

        socket.on('update', (data)=> {
        for(let i = 0; i < data.player.length; i++) {
            let pack = data.player[i];
            let p = Player.list[pack.id];
            if(p) {
                if(pack.x !== undefined) {
                    p.x = pack.x;
                }
                if(pack.y !== undefined) {
                    p.y = pack.y;
                }
                if(pack.hp !== undefined) {
                    p.hp = pack.hp;
                }
                if(pack.level !== undefined) {
                    p.level = pack.level;
                }
                if(pack.map !== undefined) {
                    p.map = pack.map;
                }
                if(pack.ultimate !== undefined) {
                  p.ultimate = pack.ultimate;
                }
            }
        }
        for (let i = 0; i < data.projectile.length; i++) {
            let pack = data.projectile[i];
            let b = Projectile.list[data.projectile[i].id];
            if(b) {
                if(pack.x !== undefined) {
                    b.x = pack.x;
                }
                if (pack.y !== undefined) {
                    b.y = pack.y;
                }
            }
        }
    })

While this seems daunting, its very simple when taken in line by line. First, we loop through our player list, define our packet and simplify Player.list[pack.id] for readability. Now we check to see if the x, y, hp, level, map (in the future also Ultimates!) values have changed at all. If they have, then we send that updated information. Likewise, we check our Projectiles (which are entities aswell!) and loop through their list, take note of any changes in values and pass them up.


## Removal Pack

Similar to our update packet, our removal packet is also incredibly light weight and simply acts as our "janitor" to clean up users who disconnect and projectiles that have travelled too far or collided with a player. The removal function looks quite simple: loop through our Player.list and Projectile.list, find things set to be removed and simply delete them.

*../client/src/pages/Game.js beginning from line 208

    // expect: {player : [12323], projectile:[12323,123123]}
    socket.on('remove', (data)=> {
        for(let i = 0; i < data.player.length; i++) {
            delete Player.list[data.player[i]];
        }
        for(let i = 0; i < data.projectile.length; i++) {
            delete Projectile.list[data.projectile[i]];
        }
    });


## Recap

Our server is emitting our trinity packages every 80ms, we then set our Game file's classes and their mirrored counterparts in Server folder's Entities file listen for these changes and apply them, creating a constant stream of data maintaining game state for all users connected to Polar Palace's /game page. Each package is designed to handle a single task, where Init being the most expensive is the least used (only upon user connection) and Update/Removal being the least data dense being continuously used throughout the game.


# Advanced Canvas

Now that we've discussed the life cycle of the game and a brief mentioning