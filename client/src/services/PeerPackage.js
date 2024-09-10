import Peer from "peerjs";

class PeerPackage{
    constructor(socketId){
        if( !this.peer ){
           this.peer = new Peer(socketId) 
        }
    }
}