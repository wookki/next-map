import { ReactNode } from "react";
import NavBar from "@/component/NavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
