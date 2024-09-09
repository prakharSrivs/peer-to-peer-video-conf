import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../providers/SockerProvider'
import { Box, Grid2, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import peer from '../../services/peer'

const RoomPage = () => {

    const socket = useContext(SocketContext);
    const [participants, setParticipants] = useState([]);
    const [localStream, setLocalStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const email = localStorage.getItem("email");

    const checkIfRoomIsValid = async () => {
      try{
        const responseObj = await axios.post(process.env.REACT_APP_BACKEND_URL+'/room/isValid',{roomId: id});
        if( !responseObj?.data?.isValid ) navigate('/lobby');
      }catch(e){
        alert(e.message);
        navigate('/lobby')
      }
    }

    const handleUserUpdate = (data)=>{
      const participantsHashSet = new Set();
      data.forEach((el)=>participantsHashSet.add(el));
      setParticipants(Array.from(participantsHashSet));
    }

    const createLocalStream = async ()=>{
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:true });
      setLocalStream(stream);
    }

    const handleCall = async (socketId) => {
      await createLocalStream();
      console.log(localStream)
      const offer = await peer.getOffer();
      socket.emit("user:call",{ to: socketId, offer })
      console.log("Call Placed with offer ",offer);
    }

    const handleIncomingCall = async({ from, offer })=>{
      await createLocalStream();
      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted",{ to:from, answer });
      setRemoteSocketId(from);
      console.log("Call accepted and replied with answer ",answer);
    }

    const sendStreams = ()=>{
      console.log(localStream);
      console.log(localStream?.getTracks())
      for( const track of localStream?.getTracks() || [] ){
        peer.peer.addTrack(track, localStream);
      }
    }

    const handleCallAccepted = async ({ from, answer })=>{
      await peer.setLocalDescription(answer);
      console.log(localStream);
      sendStreams();
    }

    const handleNegoRequest = async ({ from, offer }) => {
      const answer = await peer.getAnswer(offer);
      socket.emit("nego:complete",{ to: from, answer });
      console.log("Negotiation request recieved and answer sent ",answer);
    }

    const handleFinalNegotiation = async ({ from, answer }) => {
      await peer.setLocalDescription(answer);
      console.log("Negotiation Completed End to End");
    }

    const trackNegotiationNeededCallback = async ()=>{
      const offer = await peer.getOffer();
      socket.emit("nego:needed", { to:remoteSocketId, offer });
    }

    const trackEventListenerCallback = (event)=>{
      console.log("Track added by other peer ");
      const remoteStreams = ev.streams
      console.log(remoteStream);
      setRemoteStream(remoteStreams[0]);
    }

    useEffect(()=>{
      // checkIfRoomIsValid()
    },[])

    useEffect(()=>{
      peer.peer.addEventListener('negotiationneeded', trackNegotiationNeededCallback)
      return ()=>{
        peer.peer.removeEventListener("negotiationneeded", trackNegotiationNeededCallback);
      }
    },[])


    useEffect(()=>{
      peer.peer.addEventListener('track', trackEventListenerCallback)
      return ()=> peer.peer.removeEventListener('track', trackEventListenerCallback);
    },[])

    useEffect(()=>{
      socket.emit("room:join",{ email, roomId: id });
      socket.on("new-user-update", handleUserUpdate);
      socket.on("incoming:call", handleIncomingCall);
      socket.on("call:accepted", handleCallAccepted);
      socket.on("nego:request", handleNegoRequest);
      socket.on("nego:complete:answer", handleFinalNegotiation)
      return () => {
        socket.off("new-user-update", handleUserUpdate);
        socket.off("incoming:call", handleIncomingCall);
        socket.off("call:accepted", handleCallAccepted);
        socket.off("nego:request", handleNegoRequest);
        socket.off("nego:complete:answer", handleFinalNegotiation);
      }
    },[socket])

  return (
    <Grid2>
      <Box>
        <Typography fontSize={"24px"} textAlign={"center"} > Room {id} </Typography>
        {
          participants.length==0 ?
          <Typography fontSize={"18px"} textAlign={"center"}> Only you are in the room </Typography> :
          participants.map((data)=>{
            if(data!==socket.id) return (
              <Typography fontSize={"18px"} textAlign={"center"}> 
                Socket Id - {data} 
              <Button variant='filled' size='large' onClick={()=>handleCall(data)}> Call </Button>
              </Typography>
            )
          })
        }
        {
          localStream && <Button variant='filled' size='large' onClick={sendStreams}>Send Stream</Button>
        }
        {
          localStream &&
          <Grid2>
            <Typography fontSize="24px" textAlign={"center"}> My Local Stream </Typography>
            <ReactPlayer playing muted url={localStream} width={"600px"} height={"800px"} />
          </Grid2>
        }
        {
          remoteStream &&
          <Grid2>
            <Typography fontSize="24px" textAlign={"center"}> Remote User Stream </Typography>
            <ReactPlayer playing muted url={remoteStream} width={"600px"} height={"800px"} />
          </Grid2>
        }
      </Box>
    </Grid2>

  )
}

export default RoomPage