import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import Reader from "@/pages/Reader";
import Speed from "@/pages/Speed";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="reader" element={<Reader />} />
          <Route index element={<Home />} />
          <Route path="speed" element={<Speed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
