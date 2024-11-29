import { Routes, Route } from "react-router-dom";
import React  from "react";
import Login from "./auth/Login";
import VideoList from "./Membership/VideoList";
import Cart from "./Membership/Cart";
import Payment from "./Membership/Payment";
import MyCourses from "./Membership/Mycourse";
import { IdProvider } from "./idContext";
import Singlecart from "./Membership/Singlecart";
import Contact from "./Membership/Contact";
import Dasbord from "./Membership/Dasbord";
import Profile from "./Membership/Profile";
function App() {
  return (
    <IdProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dasbord />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/mycourses" element={<MyCourses />} />
        <Route path="/video" element={<VideoList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/single" element={<Singlecart />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </IdProvider>
  );
}

export default App;
