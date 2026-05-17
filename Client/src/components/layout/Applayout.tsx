import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import ActiveCall from "../../pages/app/calls/ActiveCall";
import IncomingCall from "../../pages/app/calls/IncomingCall";
import ChatFooter from "./Footer";
import LeftSidebar from "./LeftSidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
  const { targetId } = useParams();
  const [localSearch, setLocalSearch] = useState<string>("");
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* ✅ Sticky Navbar */}
      <div className="h-[8%] flex justify-center w-full sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main Layout */}
      <div className="h-[calc(93vh-5.5rem)] md:h-[calc(92vh-5.5rem)] w-[99.50%] flex fixed top-15 ustify-center items-center gap-0.5">
        {/* LEFT SIDEBAR - Desktop */}
        <aside
          className={`
              h-full overflow-y-auto
              ${targetId ? "hidden md:block md:w-2/6" : "block w-full md:w-2/6"}
            `}
        >
          <LeftSidebar
            onLocalSearch={setLocalSearch}
            localSearch={localSearch}
          />
        </aside>

        {/* CENTER FEED */}
        <main
          className={`
            h-full overflow-y-auto
            ${targetId ? "block w-full md:w-4/6" : "hidden md:block md:w-4/6"}
          `}
        >
          <Outlet />
        </main>
      </div>

      {/* ✅ Sticky Footer */}
      <div className="flex justify-center items-center h-[10%] w-[99.50%] bottom-0 fixed z-50">
        <ChatFooter />
      </div>
      <IncomingCall />
      <ActiveCall />
    </div>
  );
}
