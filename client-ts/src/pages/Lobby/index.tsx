import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"
import { Box, Button, TextField, Typography } from '@mui/material';

const styles = {
    rootContainer:{
        background:"#397FF1",

    },
    loginBox:{
        border:"2px solid white",
        padding:"50px",
        maxWidth:"400px",
        paddingTop:"30px"
    }
}

interface ReqBody {
    roomId : string
}

const Lobby = () => {

    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [roomId, setRoomId] = useState("");
    const { type } = useParams();

    const handleCreateRoom = async ()=>{
        if( email.length == 0 ) return;
        try{
            const response = await axios.get(import.meta.env.VITE_APP_BACKEND_URL+"/room/create");
            navigate('/join/'+response.data); 
        }catch(e){
            console.log(e);
            alert(e.message);
        }
    }
    
    const handleJoinRoom = async()=>{
        if( roomId.length==0 || email.length==0 ) return; 
        try{
            const data: ReqBody = {
                roomId: roomId
            }
            const response = await axios.post(import.meta.env.VITE_APP_BACKEND_URL+"/room/isValid",data);
            if( response?.data?.isValid ) navigate(`/join/${roomId}`);
            else alert("Room does not exist")

        }catch(e){
            console.log(e.message);
        }
    }

    const handleClick = async ()=>{
        localStorage.setItem("email",email);
        switch(type){
            case "join":
                return handleJoinRoom();
            case "create":
                return handleCreateRoom();
            default:
                alert("Invalid Link");
                navigate('/')
        }
    }

  return (
    <div 
        className='w-screen h-screen overflow-hidden p-20 flex flex-col justify-start items-center'
        style={styles.rootContainer}
    >
        <Typography variant="h3" m={"20px"}  fontWeight={700} fontFamily={"Honk"} color="initial">
            Peer Chat 📹
        </Typography>
        <Box 
            className="flex flex-col justify-center gap-5 rounded-lg bg-white items-center joinCard" 
            sx={styles.loginBox}
        >
            <Typography 
                fontSize={"24px"}
            >
                { type==="join" ? "Join " : "Create " } Meeting
            </Typography>
            <TextField 
            type='email' 
            onChange={(e)=>setEmail(e.target.value)} 
            value={email} 
            label='Email' 
            variant='outlined'
            />
            {
                type==='join' &&
                <TextField 
                    type='text'
                    onChange={(e)=>setRoomId(e.target.value)}
                    variant='outlined'
                    label="Room Id"
                />
            }
            <Button variant='contained' size='large' color='primary' onClick={handleClick}>
                { type==='join' ? "Join" : "Create" } Room
            </Button>
        </Box>
    </div>
  )
}

export default Lobby