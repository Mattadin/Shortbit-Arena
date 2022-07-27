import React, { useState, useEffect }from 'react'

function Chat({socket, displayName}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [ messageList,  setmessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        displayName: displayName,
        message: currentMessage,
      };

      await socket.emit('sendMessage', messageData);
      setmessageList((list) => [...list, messageData]);
    }
  };

  const handleChatSubmit = async (event)=> {
    event.preventDefault();
    await sendMessage();
    event.target.reset();   
  }

  useEffect(()=> {
    socket.on('receiveMessage', (data) => {
      console.log(data);
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
      <form id="chatForm" onSubmit={handleChatSubmit}>
          <input
          type="text"
          placeholder="Add chat here!"
          onChange={(event)=> {
            setCurrentMessage(event.target.value);
          }} />
      </form>
    </div>
  )
}

export default Chat