import { Routes, Route } from "react-router-dom"
import LobbyScreen from "./pages/lobby"
import RoomPage from "./pages/Room"

function  App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/room/:id" element={<RoomPage />} />
      </Routes>
    </div>
  )
}

export default App
