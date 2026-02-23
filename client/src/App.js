import { Routes, Route, Navigate } from "react-router-dom";

import { Contact } from "./pages/contact/contact";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "./helpers/persistans";
import AuthService from "./service/usersApi";
import { useEffect } from "react";
import {
  authFailure,
  authStart,
  authSuccess,
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  logout,
} from "./slice/auth";
import ProtectedRoute from "./store/ProtectedRoute";
import Preloader from "./components/Preloader";
import {
  About,
  AddPosts,
  Adobe,
  AdobeList,
  Adventure,
  Cart,
  Category,
  Dashboard,
  Detail,
  Directions,
  Ekosentr,
  Embers,
  Error,
  Gorges,
  Home,
  HomeAll,
  Lakes,
  Login,
  Notification,
  Order,
  OrganizationAdd,
  OrganizationList,
  Post,
  Posts,
  Profile,
  Register,
  SinglePost,
  UserAdd,
  UsersList,
  Waterfalls,
} from "./pages";

function App() {
  const dispatch = useDispatch();
  const { loggedIn, user, isLoading } = useSelector((state) => state.auth);
  const token = getItem("token");
  const getUsers = async () => {
    dispatch(getUsersStart());
    try {
      const data = await AuthService.getUsers();
      dispatch(getUsersSuccess(data.Result));
    } catch (error) {
      dispatch(getUsersFailure(error));
    }
  };
  useEffect(() => {
    const token = getItem("token");
    dispatch(authStart());
    if (token) {
      AuthService.getUser()
        .then((res) => {
          dispatch(authSuccess({ user: res.user, token: token }));
        })
        .catch(() => {
          dispatch(authFailure());
          dispatch(logout());
        });
    }
    getUsers();
  }, [dispatch]);

  if (token && !user) {
    return <Preloader />;
  }
  return (
    <>
      {isLoading && <Preloader />}
      <Routes>
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard/*"
          element={loggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
        >
          <Route index element={<HomeAll />} />

          <Route
            path="organization-add"
            element={
              <ProtectedRoute
                requiredRole={["admin", "user"]}
                element={<OrganizationAdd />}
              />
            }
          />
          <Route path="notification" element={<Notification />} />
          <Route
            path="organization-list"
            element={
              <ProtectedRoute
                requiredRole={["admin", "region", "district", "user"]}
                element={<OrganizationList />}
              />
            }
          />
          <Route
            path="post-add"
            element={
              <ProtectedRoute requiredRole={["admin"]} element={<AddPosts />} />
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route
            path="adobe"
            element={
              <ProtectedRoute
                requiredRole={["admin", "user", "region", "district"]}
                element={<Adobe />}
              />
            }
          />
          <Route
            path="adobe-list"
            element={
              <ProtectedRoute
                requiredRole={["admin", "user", "region", "district"]}
                element={<AdobeList />}
              />
            }
          />
          <Route path="order" element={<Order />} />
          <Route
            path="user-add"
            element={
              <ProtectedRoute requiredRole={["admin"]} element={<UserAdd />} />
            }
          />
          <Route
            path="users-list"
            element={
              <ProtectedRoute
                requiredRole={["admin", "region", "district"]}
                element={<UsersList />}
              />
            }
          />
          <Route
            path="category"
            element={
              <ProtectedRoute requiredRole={["admin"]} element={<Category />} />
            }
          />
          <Route
            path="posts"
            element={
              <ProtectedRoute requiredRole={["admin"]} element={<Posts />} />
            }
          />
        </Route>
        <Route path="/unauthorized" element={<Error />} />
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Error />} />
        <Route path="/embers" element={<Embers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<Post />} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="/connection" element={<Contact />} />
        <Route path="/waterfalls" element={<Waterfalls />} />
        <Route path="/gorges" element={<Gorges />} />
        <Route path="/lakes" element={<Lakes />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/adventure" element={<Adventure />} />
        <Route path="/ecocenter" element={<Ekosentr />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/directions" element={<Directions />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
