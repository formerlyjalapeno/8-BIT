import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Welcome from "./pages/Welcome"

function App() {
  const getTime = () => {
    const date = new Date();
    // Format the time as HH:mm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    console.log(`${hours}:${minutes}`);
    return `${hours}:${minutes}`;
  };

  getTime();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Welcome/>} />
          <Route path="/start" element={<Start/>} />
          <Route path="/" element="" />
          <Route path="/" element="" />
          <Route path="/" element="" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
