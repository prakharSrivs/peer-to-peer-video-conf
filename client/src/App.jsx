import { Routes, Route } from "react-router-dom"
import LobbyScreen from "./pages/lobby"
import RoomPage from "./pages/Room"
import CreateRoom from "./pages/CreateRoom"

function  App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/join/:id" element={<RoomPage />} />
        <Route path="/" element={<CreateRoom />} />
      </Routes>
    </div>
  )
}

export default App
