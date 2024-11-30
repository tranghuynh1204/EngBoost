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
    <div className="max-h-screen max-w-[1210px]">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-screen rounded-lg border"
      >
        <ResizablePanel defaultSize={5} className="min-w-[55px] max-w-[450px]">
          <SideBarChat />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={95}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
