import {Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GuestPage from "./pages/GuestPage";

function App() {
  return (
    <>
      <LandingPage></LandingPage>
      <Routes>
        <Route path="/guestPage" element={<GuestPage></GuestPage>}></Route>
      </Routes>
    </>
  );
}

export default App;
