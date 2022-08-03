import React, { useState, useEffect, useRef }from 'react'
import './chat.css';

function Chat({socket, displayName}) {
  const [ currentMessage, setCurrentMessage ] = useState("");
  const [ messageList,  setmessageList] = useState([]);

  const sendMessage = async () => {
    // Private messaging for future development
    // if(currentMessage[0] === '@') {
    //   // Chat syntax: @displayName, message
    //   const messageData = {
    //     displayName: currentMessage.slice(1, currentMessage.indexOf(',')),
    //     message: currentMessage.slice(currentMessage.indexOf(',') + 1)
    //   }
    //   await socket.emit('sendPmToServer', messageData)
    //   setCurrentMessage("");
    // }
    if(currentMessage !== "") {
      const messageData = {
        displayName: displayName,
        message: currentMessage,
      }
      await socket.emit('sendMessage', messageData);
      setCurrentMessage("");
    }
  };

  const chatRef = useRef(null)

  useEffect(()=> {
    socket.on('receiveMessage', (data) => {
      // console.log('receiveMessage data is: ', data);
      setmessageList((list) => [...list, data]);
    })
  }, [socket])

  useEffect(() => {
    chatRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messageList]);

  return (
    <div>
      <div className="chatBody">
        {messageList.map((messageContent) => {
          return <div><span className="displayName">{messageContent.displayName}</span>:<span className="chatText"> "{messageContent.message}"</span></div>
        })}
        <div ref={chatRef} />
      </div>
          <input
          type="text"
          value={currentMessage}
          placeholder="Add chat here!"
          onChange={(event)=> {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }} />
    </div>
  )
}

export default Chat