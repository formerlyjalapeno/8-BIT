import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MainMenu from "./pages/MainMenu";
import Redirect from "./pages/Redirect";
import Credits from "./pages/Credits";
import Room from "./pages/Room";
import Epilogue from "./pages/Epilogue";

function App() {
  const getTime = () => {
    const date = new Date();
    // Format the time as HH:mm
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    console.log(`${hours}:${minutes}`);
    return `${hours}:${minutes}`;
  };

  getTime();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<MainMenu />} />
          <Route path="/loading" element={<Redirect />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/room" element={<Room />} />
          <Route path="/epilogue" element={<Epilogue/>} />
          <Route path="/" element="" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
