import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout__div">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;