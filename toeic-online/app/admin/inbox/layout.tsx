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
    <div className="max-h-screen max-w-[1210px] mx-auto   bg-white">
      <header className="mb-8 px-6">
        <h1 className="text-xl text-zinc-700 font-extrabold mt-6 mb-2">Inbox</h1>
        <p className="text-sm text-zinc-500">
          View and manage your latest messages and stay updated.
        </p>
      </header>
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full px-6"
      >
        {/* Sidebar */}
        <ResizablePanel
          defaultSize={25}
          minSize={15} // Allow smaller resizing
          maxSize={40} // Allow larger resizing
          className="bg-slate-50 rounded-lg "
        >
          <SideBarChat />
        </ResizablePanel>

        {/* Resizable Divider */}
        <ResizableHandle className="bg-gray-300 w-[2px] cursor-col-resize" />

        {/* Main Content */}
        <ResizablePanel defaultSize={75} className="">
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
