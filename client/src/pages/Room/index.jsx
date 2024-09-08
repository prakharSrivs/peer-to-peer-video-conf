import React, { useContext } from 'react'
import { SocketContext } from '../../providers/SockerProvider'

const RoomPage = () => {

    const socket = useContext(SocketContext);

    useEffect(()=>{
        socket.on("room:joined",(data)=>{
            console.log(data);
        })
    },[socket])

  return (
    <div>RoomPage</div>
  )
}

export default RoomPage