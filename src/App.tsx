import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";

function App() {
  return (
    <div className="my-10 mx-8">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
