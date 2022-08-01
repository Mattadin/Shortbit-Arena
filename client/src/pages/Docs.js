import React from 'react';
import CANVASEX from '../img/canvas-example.PNG'
import SOCKETEX from '../img/socket-example.PNG'
import JWTEX from '../img/jwt-example.PNG'

const Docs = () => {

    return (
        <main className="container">
            <div id="toc" className="enter__game">
                <h1> Overview Documentation for Polar Palace</h1>
                <br></br>
                <h2> Table of Contents: </h2>
                <p> Technologies used </p>
                <p><a href="#canvas">Canvas</a></p>
                <p><a href="#socket">Socket.Io</a></p>
                <p><a href="#bcrypt">Bcrypt</a></p>
                <p><a href="#apollo">Apollo</a></p>
                <p><a href="#jwt">JSON Web Token</a></p>
                <br></br>
                <p> Systems Overview: </p>
                <p><a href="#login">Login system</a></p>
                <p><a href="#game">Game system</a></p>
                <br></br>
                <p><a href="https://github.com/Mattadin/polar-palace/blob/main/TechnicalDocs.md">In-depth technical documentation</a></p>
            </div>
            <center>
            <div className="docs__align">
                <h2 id="canvas"> Canvas </h2>
                <p>
                 Canvas API allows users to draw various graphics including shapes and images
                 using an HTML canvas tag. By defining the parameters of height and width for
                 the canvas, it is possible to control the "view port" of the individuals playing
                 Polar Palace. Once the dimensions of the canvas have been chosen (in the case of
                 Polar Palace 500x500) the drawing magic can begin! Canvas allows users to select
                 a context for their project (2d, 3d, etc) depending on complexity levels and
                 performance expectations for users. For Polar Palace, we've chosen to stick with 2d
                 as it is sufficient for the objective of the project.
                </p>
                <img src={CANVASEX} alt="example of canvas API being used in Polar Palace"/>
                <br></br>
                <p>Full documentation for Canvas API can be found <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API"
                rel="noreferrer"
                target="_blank"
                >here
                </a></p>
                <a href="#toc">Back to top</a>
            </div>

            <div className="docs__align">
                <h2 id="socket"> Socket.io </h2>
                <p>
                    Socket.Io is a unqiue tool that allows users to communicate information
                    from the front end of an application to the back end while not storing
                    that information in the database which could cause clogging. Options for 
                    saving information to the database is possible for users who wish to make 
                    that use-case viable. In its simplest form, Socket.io functions by initially
                    establishing a connection using "socket.on("connect", function)" and establishing
                    what happens when a user leaves the domain the sockets are being used by stating
                    socket.on("disconnect", function). With the boring items out of the way, its time 
                    to make socket magic happen! In order for our users to send data to the server, we 
                    must first understand the ebb and flow of "on receipt" and "emit" that socket 
                    bases itself upon. For example's sake, lets say we want a button on our front end 
                    to do something on our back end. We simply go to our button and tell it 
                    "Hey, when I click you, do something" by saying socket.emit("doSomething"). On 
                    the server side we need to listen out for that emission, we do so by simply saying
                    socket.on("doSomething", function) where function is the functionality we'd like 
                    our backend to perform. If we wanted to create a string of chain reactions it is 
                    completely possible for each function in the arguments to also make emissions 
                    for listeners on the other end to pick up and "doSomething" with! This technology 
                    is the core component for many of the various functionalities seen in Polar Palace 
                    and it provides the "multiplayer" aspects brilliantly.
                </p>
                <img src={SOCKETEX} alt="example of socket.io functionality"/>
                <br></br>
                <p>Full documentation for Socket.Io can be found <a
                href="https://socket.io/docs/v4/"
                rel="noreferrer"
                target="_blank"
                >here
                </a></p>
                <a href="#toc">Back to top</a>
            </div>

            <div className="docs__align">
                <h2 id="bcrypt"> Bcrypt </h2>
                <p>
                    Bcrypt is a security API that allows developers to securely store confidential information 
                    in a database through a process called "hashing". By including Bcrypt in Polar Palace the 
                    application is able to safely store user passwords by running the hashing algorithm to jumble
                    the text into a completely nonsensical string of text. For example, the password "pancakesRok"
                    might be translated to "$2b$10$IyqZpDkx1lBmvtv9zIGreWoDUScb5HnuSnOdCR1YzaUDYR/56EBe" then 
                    stored into the database under the encrypted information, ensuring even the developers do 
                    not have access to user's private information. In order for the system to recognize a user's 
                    password for authenticating a log in, the server then decodes the encrypted password and checks 
                    to see if the decoded encryption matches the user's actual password without ever revealing it 
                    and passes either a "true" or "false" response to allow the application to know if the 
                    password does indeed match.
                </p>
                <br></br>
                <p>Full documentation for Bcrypt can be found <a
                href="https://openbase.com/js/bcrypt/documentation"
                rel="noreferrer"
                target="_blank"
                >here
                </a></p>
                <a href="#toc">Back to top</a>
            </div>

            <div className="docs__align">
                <h2 id="apollo"> Apollo </h2>
                <p>
                    Apollo provides a structure for quickly and efficiently quering a database (essentially
                    asking for information and having it received for the user experience). The Apollo documentation 
                    provides clear and concise information on integreations for modern React applications (such 
                    as Polar Palace!) and excellently details the steps required for applying these features. 
                    For Polar Palace specifically, Apollo provides the application with the ability to quickly 
                    search through the database by limiting the pieces of information required to apply a particular
                    effect and by "mutating" the data into something usable for a variety of in-game features. 
                    Most notably, Polar Palace makes use of the Apollo infrastructure for the log-in system by 
                    fetching the user's data (including the encrypted password), applying authentication protocols
                    and then ushering the user to its next step (for instance the Dashboard!). In this particular 
                    instance, Apollo is being used as a gate-keeper of sorts in conjunction with the Bcrypt 
                    infrastructure to ensure user authenticity is maintained.
                </p>
                <br></br>
                <p>
                    The second most notable application for our Apollo service is found in the game application 
                    itself! By quickly acquiring the user's display name, we're able to send that data to the 
                    game client itself and attach it to the relevant socket ID that represents that individual user.
                    This makes identifying which user is currently chatting away in our custom chat box much 
                    simpler than a collection of random letters and numbers (the user's socket id) and instead 
                    gives agency to the user to represent themselves with their chosen name, uniquely identifying 
                    the player as they wish.
                </p>
                <br></br>
                <p>Full documentation for Apollo can be found <a
                href="https://www.apollographql.com/docs/"
                rel="noreferrer"
                target="_blank"
                >here
                </a></p>
                <a href="#toc">Back to top</a>
            </div>

            <div className="docs__align">
                <h2 id="jwt"> JSON Web Token </h2>
                <p>
                    JSON Web Token is a multifaceted product that allows an application's server to securely 
                    store information to be later used. The easiest explanation would be that of a music concert. 
                    Upon purchasing tickets to your favorite music artist's performance, you're handed a wrist-band
                    that the security team is able to easily recognize as being authentication for entry. This 
                    wristband then allows concert-goers to leave and rejoin the venue without hassle and provides 
                    an easy means for security to verify persons who have purchased a ticket and those who have not. 
                    In much the same way, JSON Web Token allows the application to verify if a user has been signed 
                    in and is ready to play the game. Upon signing up or signing in to the application, the server 
                    will issue a JSON Web Token as a metaphoric wrist band that allows users to enter the dashboard 
                    and ultimately the game. A user may leave the game or website for any reason, but the token 
                    will persist for a pre-determined amount of time, allowing the user to easily take a break 
                    and return as needed. Once the token has expired, the user will then be required to sign back 
                    into the game and be issued a new token (or metaphoric wristband) which then proves authenticity 
                    and grants access to the application's features.
                </p>
                <br></br>
                <p>
                    JSON Web Token works in conjunction with our Apollo infrastructure to provide all the 
                    information required for effective gate-keeping. Synchronizing the speed of queries 
                    from Apollo with the security protocols of JSON Web Token allows Polar Palace to quickly and 
                    effectively provide secure means for users to enjoy their favorite snow ball revolution game.
                </p>
                <img src={JWTEX} alt="example of JSON Web Token data"/>
                <br></br>
                <p>Full documentation for JSON Web Token can be found <a
                href="https://jwt.io/introduction"
                rel="noreferrer"
                target="_blank"
                >here
                </a></p>
                <a href="#toc">Back to top</a>
            </div>

            <div className="docs__align">
                <h2 id="login"> Login System </h2>
                <p>
                    The login system for Polar Palace is actually quite simple thanks to the assistance of 
                    the foundations set out by the above technologies. By simply taking the dynamic duo of 
                    Apollo and JSON Web Token (JWT) the system simply must collect user-input information and
                    pass that information securely and reliably to the gate-keeper and the ticket handler that are
                    Apollo and JWT respectively.
                </p>
                <br></br>
                <p>
                    Starting with the basics, upon choosing to sign up you'll be given a simple form requesting
                    your name, your desired name to be displayed to other users (mysteriously described as a 
                    display name. Original!), your email and ultimately a password.  Let us begin with how 
                    the form submission is handled; once the relevant information has been passed into the form,
                    the user will then submit. Before the information can be transferred to the database, Bcrypt 
                    adeptly intercepts the information and begins "hashing" (jumbling) the text to secure the private 
                    information of our user. That hashed (jumbled) information is then tucked away and stored within 
                    the application for later use. The application, in its own clever way, then transfers the new 
                    user to the dashboard to immediately be greeted with instructions on how to play. Neat! But 
                    what if the user already exists?
                </p>
                <br></br>
                <p>
                    A user simply needs to click on the "Login" button at the top of the screen to be greeted with 
                    yet another form (who doesn't enjoy a good bureaucracy?) asking for only the relevant details that 
                    are unique to that individual user. Each individual's email is used as a unique identifier of 
                    their personal information such as display name and matching password. Simply bash in the 
                    email and password and like magic Bcrypt will immediately begin checking the hashed (jumbled) 
                    text against its own algorythm to decode the encryption and verify it with what is stored in 
                    the database. Once the user has been authenticated as truely being that unique individual, 
                    like magic once again JSON Web Token (JWT) will mint off a shiny new token with its own 
                    encryption and set expiry date, combining the unique trifecta of security guard, wristband and 
                    concert as discussed in the previous sections of this documentation.
                </p>
                <a href="#toc">Back to top</a>
            </div>

            <div className="docs__align">
                <h2 id="game"> Game System </h2>
                <p>
                    We've already discussed the technologies and the login system, lets get to the meat and 
                    potatoes- the actual game! Polar Palace's game interface brings the artistic freedom of 
                    Canvas and the communicative properties of Socket.Io together to form another dynamic duo 
                    similar to our Apollo and Bcrypt team. Instead, this time, our game aims to capture information 
                    from the server and the client by establishing communications through Socket.Io and Canvas 
                    attempts to absorb that information to actually draw what is occuring into our game box. 
                    These communications boil down to some simple functionality best described in a "life cycle"
                    so to speak.
                </p>
                <br></br>
                <h2> The Life Cycle </h2>
                <p>
                    Upon first entering the game, Socket.Io creates a unique identifier which is made up of, quite 
                    simply, an absolute mess of letters and numbers. This is where our life cycle begins its exciting 
                    first step into the snowball revolution that is Polar Palace! With a socket ID now generated, 
                    our client side quickly sends information to the server saying "We've generated a new user, 
                    please prepare initiating them to the game." The server receives this message through socket.io 
                    and quickly prepares a package of information called the "initiation package" which contains 
                    a hefty load of important data that can be quite strenuous in terms of load. The fact that 
                    this initial data is so important makes it crucial for the initiation cycle to be maintained, 
                    but it is very unhealthy for the application to constantly be sending that information back and 
                    forth as we'll discuss in the adolescent stage of the lifecycle.
                </p>
                <br></br>
                <p>
                    Now that our rearing baby Penguin/Seal pup or Polar Bear cub has entered the game at a ripe age of 
                    level zero, it becomes a bit of a quandry how to maintain user controls and ensure that all players 
                    in the game are experiencing the same state. Through the magic of Socket.Io this dream is made 
                    reality. As we discussed with the initiation package, we now simply need to send much smaller, 
                    bite-sized packages updating the server of an individual user's going-ons (their movements, 
                    snowball throws and stage in the life cycle). These are done in whats called "update packages"
                    where each individual user sends a packet of data multiple times each second so not a moment is 
                    missed for other players experiencing the game! But all good things must come to an end, and so 
                    the final stage of the life cycle must be brought to the table. Removal.
                </p>
                <br></br>
                <p>
                    No snowball goes without melting, no warrior stays on the battlefield forever. There comes 
                    a time where the snowballs must collide, or miss and join with the endless sea of snow that 
                    litters the Empire of Polaria. Likewise, even brave warriors seek the refuge of a warm fireplace
                    or a steaming cuppa to refresh their spirits before rejoining the fray! So what happens then? 
                    Well, for snowballs in particular there's no easy way to put it. They have a set timer, and 
                    when the time has come- they must emit their "removal packet" which will inform all the clients 
                    of the joyous passing of a snowball that has finished its journey. Likewise, when a player leaves 
                    the arena, a "disconnect" emission is sent through to inform the server another "removal packet" 
                    is needed so other players are unable to bombard the haggard warrior before retreating to 
                    the safety of the revolution lodge and their well deserved cuppa.
                </p>
                <br></br>
                <p>
                    There are many interesting things that happen- mystical mathematics and mysterious functions 
                    that guide the fate of the warriors of Polaria here in Polar Palace. For the wizards and sages 
                    of particular learning in the arts of scripts of Java, a tome of more in-depth knowledge can 
                    be found below. For what its worth, I certainly hope this quick and simple guide on the happenings 
                    of the Polar Palace and the denizens of Polaria have served to ease any doubts and answered any 
                    questions on the curious nature of this application. I hope to see you all on the fields, and 
                    remember, "VIVA LA REVOLUCION!"
                </p>
                <a href="#toc">Back to top</a>
                <br></br>
                <a href="https://github.com/Mattadin/polar-palace/blob/main/TechnicalDocs.md"> Technical Documentation for Polar Palace</a>
            </div>
            </center>
        </main>
    );
};

export default Docs;