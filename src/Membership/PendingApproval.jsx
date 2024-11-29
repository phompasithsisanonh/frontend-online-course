import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PendingApproval() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkApprovalStatus = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_URL}/checkPaymentStatus`,
  //         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  //       );

  //       if (response.data.statusAccess === "approved") {
  //         navigate("/cart"); // Redirect to cart if approved
  //       }
  //     } catch (error) {
  //       console.log("Error checking payment status:", error);
  //     }
  //   };

  //   // const intervalId = setInterval(checkApprovalStatus, 5000); // Check every 5 seconds

  //   // return () => clearInterval(intervalId);
  // }, [navigate]);

  return <div>Pending approval, please wait...</div>;
}

export default PendingApproval;
