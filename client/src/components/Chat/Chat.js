import React, { useState, useEffect }from 'react'

function Chat({socket, displayName}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [ messageList,  setmessageList] = useState([]);

  const sendMessage = async () => {
    if(currentMessage[0] === '@') {
      // Chat syntax: @displayName, message
      const messageData = {
        displayName: currentMessage.slice(1, currentMessage.indexOf(',')),
        message: currentMessage.slice(currentMessage.indexOf(',') + 1)
      }
      await socket.emit('sendPmToServer', messageData)
      setCurrentMessage("");
    }
    if(currentMessage !== "") {
      const messageData = {
        displayName: displayName,
        message: currentMessage,
      }
      await socket.emit('sendMessage', messageData);
      setCurrentMessage("");
    }
  };

  useEffect(()=> {
    socket.on('receiveMessage', (data) => {
      // console.log('receiveMessage data is: ', data);
      setmessageList((list) => [...list, data]);
    })
  }, [socket])

  return (
    <div>
      <div className="chatBody">
        {messageList.map((messageContent) => {
          return <div>{messageContent.displayName}: "{messageContent.message}"</div>
        })}
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