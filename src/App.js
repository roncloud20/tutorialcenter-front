import { Route, Routes } from "react-router-dom";
import Home from "./pages/public/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<div className="text-red-300">Test Page</div>} />
      </Routes>
    </>
  );
}

export default App;
