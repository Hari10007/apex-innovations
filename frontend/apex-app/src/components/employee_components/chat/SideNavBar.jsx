import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    boxShadow: 'none',
  }
}));


function SideNavBar() {
  
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const chatSocket = new WebSocket(
      "ws://127.0.0.1:8000/ws/chat/" + roomName + "/"
    );

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      setChat([...chat, data.message]);
    };

    return () => {
      chatSocket.close();
    };
  }, [roomName]);

  const sendMessage = () => {
    const chatSocket = new WebSocket(
      "ws://" + window.location.host +
      "/ws/chat/" + roomName + "/"
    );

    chatSocket.onopen = function (e) {
      chatSocket.send(JSON.stringify({
        message: message,
        username: username
      }));
      setMessage("");
    };

    return () => {
      chatSocket.close();
    };
  };

  return (
    <div className="App">
      <div className="chat-container">
        <h1>Chat Room: {roomName}</h1>
        <div className="chat-box">
          {chat.map((msg, idx) => (
            <div key={idx}>
              <span>{msg.username}: </span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
export default SideNavBar

