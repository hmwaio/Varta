import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/Auth.js";

import RootPage from "../pages/RootPage.js";
import Login from "../pages/auth/Login.js";
import Signup from "../pages/auth/Signup.js";

import AppLayout from "../components/layout/Applayout.js";
import Spinner from "../components/ui/Spinner";
import NotFound from "../pages/NotFound";
import ChatPage from "../pages/app/ChatPage.js";
import DMChatList from "../pages/app/DMChatList.js";
import GroupChatList from "../pages/app/GroupChatList.js";
import GroupChatPage from "../pages/app/GroupChatPage.js";
import Home from "../pages/app/Home.js";
import SearchPage from "../pages/app/SearchPage.js";
import Calls from "../pages/app/calls/CallsList.js";
import AccountSettings from "../pages/app/profile/Account.js";
import MyProfile from "../pages/app/profile/MyProfile.js";
import ProfileSettings from "../pages/app/profile/Settings.js";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/chat" replace /> : <>{children}</>;
}

export default function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <RootPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Private - App */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* <Route index element={<Navigate to="chats" replace />} /> */}
          {/* <Route path="chats" element={<DMChatList />} /> */}
          <Route path="chats" element={<Home />} />
          {/* <Route index element={<Home />} /> */}
          <Route path="chat/:targetId" element={<ChatPage />} />
          {/* <Route path="updates" element={<GroupChatList />} /> */}
          <Route path="updates" element={<Home />} />
          <Route path="updates/:conversationId" element={<GroupChatPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="calls" element={<Calls />} />

          <Route path="me" element={<MyProfile />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="account" element={<AccountSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
