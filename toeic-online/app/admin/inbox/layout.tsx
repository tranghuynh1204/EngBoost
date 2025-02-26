import { SideBarChat } from "@/components/chat/side-bar-chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-h-screen max-w-[1210px] mx-auto mt-6 rounded-lg shadow-md border border-gray-200 bg-white">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full rounded-lg bg-gray-50"
      >
        {/* Sidebar */}
        <ResizablePanel
          defaultSize={25}
          minSize={15} // Allow smaller resizing
          maxSize={40} // Allow larger resizing
          className="bg-gray-100 border-r border-gray-300"
        >
          <SideBarChat />
        </ResizablePanel>

        {/* Resizable Divider */}
        <ResizableHandle className="bg-gray-300 w-[4px] cursor-col-resize" />

        {/* Main Content */}
        <ResizablePanel defaultSize={75} className="p-4">
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
