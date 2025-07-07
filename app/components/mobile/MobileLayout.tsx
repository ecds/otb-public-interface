import { ReactNode } from "react";
import MobileNavbar from "./MobileNavbar";

interface Props {
  title: string;
  children: ReactNode;
  showTabs?: boolean;
}

const MobileLayout = ({ title, children, showTabs = false }: Props) => {
  return (
    <div className="h-screen bg-gray-100">
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <MobileNavbar tourTitle={title} />
      </div>

      {/* Content Area */}
      <div 
        className="overflow-y-auto"
        style={{ 
          height: showTabs ? 'calc(100vh - 4rem - 5rem)' : 'calc(100vh - 4rem)',
          marginTop: '4rem',
          marginBottom: showTabs ? '5rem' : '0'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;