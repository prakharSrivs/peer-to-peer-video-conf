import Peer from 'peerjs';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import ReactPlayer from 'react-player';

const RoomPage = () => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia 
    || navigator.webkitGetUserMedia 
    || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      setLocalStream(mediaStream);
      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (currRemoteStream) => {
        setRemoteStream(currRemoteStream);
      });
    });
  }

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia 
      || navigator.webkitGetUserMedia 
      || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        setLocalStream(mediaStream);
        call.answer(mediaStream)
        call.on('stream', function(currRemoteStream) {
          setRemoteStream(currRemoteStream);
        });
      });
    })
  peerInstance.current = peer;
  }, [])

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <ReactPlayer playing muted height={"200px"} url={remoteStream} />
      <ReactPlayer playing muted height={"200px"} url={localStream} />
    </div>
  )
}

export default RoomPage