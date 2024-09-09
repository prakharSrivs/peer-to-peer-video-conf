import React, { useContext, useState } from 'react'
import { SocketContext } from '../../providers/SockerProvider'
import { Box, Button, Grid, Grid2, Input, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const handleCreateRoom = async ()=>{
    try{
      const response = await axios.get(process?.env?.REACT_APP_BACKEND_URL+"/room/create");
      navigate('/join/'+response.data);
      localStorage.setItem("email",email);
    }catch(e){
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <Grid2 sx={styles.rootContainer}>
      <Box sx={styles.inputBoxForm}>
        <Typography 
          fontSize={"24px"}
        >
          Join a meeting
        </Typography>
        <TextField 
          sx={styles.inputEl} 
          type='email' 
          onChange={(e)=>setEmail(e.target.value)} 
          value={email} 
          label='Email' 
        />
        <Button 
          size='large' 
          variant='contained'
          disabled={email.length==0 }
          onClick={handleCreateRoom}
        >
          Create Room
        </Button>
      </Box>
    </Grid2>
  )
}

export default LobbyScreen