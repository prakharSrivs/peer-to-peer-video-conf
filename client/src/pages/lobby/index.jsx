import React, { useContext, useState } from 'react'
import { SocketContext } from '../../providers/SockerProvider'
import { Box, Button, Grid, Grid2, Input, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const styles = {
  rootContainer:{
    height:"100%",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  inputBoxForm:{
    height:"100%",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column",
    gap:"20px"
  }
}

const LobbyScreen = () => {

  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const handleCreateRoom = ()=>{
    socket.emit("room:join",{ email, roomId });
    navigate(`/room/${roomId}`);
  }

  return (
    <Grid2 sx={styles.rootContainer}>
      <Box sx={styles.inputBoxForm}>
        <TextField 
          sx={styles.inputEl} 
          type='email' 
          onChange={(e)=>setEmail(e.target.value)} 
          value={email} 
          label='Email' 
        />
        <TextField 
          sx={styles.inputEl} 
          type='text' 
          onChange={(e)=>setRoomId(e.target.value)} 
          value={roomId} 
          label='Room Id'   
        />
        <Button 
          size='large' 
          variant='contained'
          disabled={email.length==0 || roomId.length == 0 }
          onClick={handleCreateRoom}
        >
          Create Room
        </Button>
      </Box>
    </Grid2>
  )
}

export default LobbyScreen