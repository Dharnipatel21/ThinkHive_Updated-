import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F1A]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
