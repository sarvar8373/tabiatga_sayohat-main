import { useEffect } from "react";
import Customers from "./pages/customer";
import Home from "./pages/home";
import Region from "./pages/region";
import District from "./pages/district";
import Bussiness from "./pages/bussiness";
import { useSelector } from "react-redux";

export default function HomeAll() {
  const { user } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   getUserDetails()
  //     .then((result) => {
  //       if (result.data.Status) {
  //         setUserDetails(result.data);
  //         console.log(result.data);
  //       } else {
  //         console.error(result.data.Error);
  //         console.log(result.data.Error);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       // Additional error handling if needed
  //     });
  // }, []);
  return (
    <div>
      {" "}
      {user.role === "admin" ? (
        <Home />
      ) : user.role === "region" ? (
        <Region />
      ) : user.role === "district" ? (
        <District />
      ) : user.role === "user" ? (
        <Bussiness />
      ) : (
        <Customers />
      )}
    </div>
  );
}
