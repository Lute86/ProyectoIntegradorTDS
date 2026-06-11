import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import useThemeStyles from "../../../hooks/useThemeStyles";
import { useSiteConfigStore } from "../../../stores/siteConfigStore";

export default function PublicLayout() {
  useThemeStyles()
  const layout = useSiteConfigStore((s) => s.config.layout)

  return (
    <div className={`flex flex-col min-h-screen w-full ${layout === "boxed" ? "layout-boxed" : "layout-full"}`}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
