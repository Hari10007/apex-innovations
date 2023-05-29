import React, { useEffect, useRef, useState } from 'react'
import {
    MDBTypography,
    MDBCardHeader,
    MDBCol,
  } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft,
    } 
from '@fortawesome/free-solid-svg-icons';
  
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux-toolkit/userSlice';
import useAxios from '../../../utilis/useAxios';
import moment from 'moment';
import { Button } from '@material-ui/core';
import InputEmoji from "react-input-emoji";
import "../../css/Chat.css"
import { baseURL, socketUrl } from '../../../utilis/baseUrl';

function ChatLog() {
    const params = useParams();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [roomName , setRoomName] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const employee1 = useSelector(selectUser);
    const employee2 = parseInt(params?.id)
    const api = useAxios();
    const messagesEndRef = useRef(null);
    const [socketOpen, setSocketOpen] = useState(false);
    const navigate = useNavigate();
    const [employeeExists, setEmployeeExists] = useState(false);
    const [receiverEmployee, setReceiverEmployee] = useState('');

    const fetchMessages = async (room_name) => {
        const response = await api.get(`chat/messages/?room=${room_name}`);
        if(response.status === 200){
            setMessages(response.data);
        }
    };

    const checkEmployee = async (employee2) => {
        try {
          const response = await api.get(`check_employee/?employee_id=${employee2}`);
          if (response.status === 200){
            setEmployeeExists(true);
            setReceiverEmployee(response.data);
          }
        } catch (error) {
            console.log(error)
            navigate('/chat/list')
        }
      }

    useEffect(() =>{
        if (employee2) {
            checkEmployee(employee2);
        }else{
            setEmployeeExists(false);
        }
    },[employee2])
    

    useEffect(() => {
        if (employeeExists) {
            const room_name = `chat_${Math.min(employee1?.id, employee2)}_${Math.max(employee1?.id, employee2)}`;

            const new_socket = new WebSocket(`${socketUrl}/ws/chat/${room_name}/`);
            setRoomName(room_name);
        
            new_socket.onopen = () => {
                console.log('WebSocket connection opened');
                setSocketOpen(true);
                fetchMessages(room_name);
            }

            new_socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
            };

            new_socket.onclose = () => {
                console.log('WebSocket connection closed');
                setSocketOpen(false);
            }
        
            setSocket(new_socket);
        
            return () => new_socket.close();
        }
    }, [employee1?.id, employee2, employeeExists]);


    useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);


    const handleInputChange = (value) => {
        setInputMessage(value);
    };


    
    const handleSubmitMessage = () => {

        const messageObject = {
            sender_id: employee1.id,
            receiver_id: employee2,
            message: inputMessage,
            room_name: roomName,
        };
    

        socket.send(JSON.stringify(messageObject));
    
        setInputMessage('');
    };

  return (
    <> 
      {socketOpen && (
        <MDBCol md="6" lg="7" xl="8">
            {employee2 &&
                <>
                    <MDBCardHeader
                        className="d-flex justify-content-start align-items-center p-2"
                        style={{ borderTop: "4px solid #ffa900" }}> 
                        <FontAwesomeIcon 
                            icon={faArrowLeft}  
                            onClick={() => navigate('/chat')}
                            style={{ fontSize: "24px", marginRight: "10px", marginLeft: "10px", cursor: "pointer" }}/>
                        <img
                            src={`${receiverEmployee?.image ? baseURL + receiverEmployee?.image : "https://bootdey.com/img/Content/avatar/avatar7.png"}`}
                            alt="avatar"
                            className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                            width="60"
                            />
                        <h5 className="mb-0">{ receiverEmployee?.name }</h5>
                    </MDBCardHeader>

                    <MDBTypography tag="div" listUnStyled ref={messagesEndRef}
                        style={{
                            height: "450px",
                            overflowX: "hidden",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                        >
                        {messages.map((message,index) =>(
                            (employee1?.email === message?.sender?.email ?
                            (
                                <>
                                    <div className="d-flex flex-row justify-content-end mb-4 pt-1" key={index}>
                                        <div  style={{ whiteSpace: "pre-wrap", maxWidth: "80%" }}>
                                            <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-warning text-start" style={{ wordWrap: "break-word" }}>
                                                {message?.content}
                                            </p>
                                            <div className="d-flex flex-row justify-content-end ms-auto">
                                                <p className="small mb-1 me-3 text-muted">{moment.utc(message?.created_at).local().format('hh:mm A')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                                :
                                (
                                <>
                                    <div className="d-flex flex-row justify-content-start" key={index}>
                                        <div style={{ whiteSpace: "pre-wrap", maxWidth: "80%" }}>
                                            <p
                                            className="small p-2 ms-3 mb-3 rounded-3 text-start"
                                            style={{ backgroundColor: "#f5f6f7" , wordWrap: "break-word"}}
                                            >
                                                {message?.content}
                                            </p>
                                            <div className="d-flex flex-row justify-content-start ms-auto">
                                                <p className="small mb-1 ms-3 text-muted">{moment.utc(message?.created_at).local().format('hh:mm A')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                )
                            )
                        ))}
                        
                    </MDBTypography>
                    
                    <div className="row">
                        <div className="col-9">
                            <InputEmoji
                            value={inputMessage}
                            onChange={handleInputChange}
                            cleanOnEnter
                            style={{ maxHeight: '50px', overflowY: 'auto', wordWrap: 'break-word' }}
                            className="input-emoji"
                            />
                        </div>
                        <div className="col-1 d-flex align-items-center justify-content-center">
                            <Button
                            color="success"
                            variant="contained"
                            rounded="true"
                            onClick={handleSubmitMessage}
                            className="send-button"
                            >
                            Send
                            </Button>
                        </div>
                    </div>

            </>
            }
        </MDBCol>
        )}
    </>
  )
}

export default ChatLog
