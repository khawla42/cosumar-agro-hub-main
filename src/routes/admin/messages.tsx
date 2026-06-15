import { createFileRoute } from "@tanstack/react-router";
import { MessagesView } from "@/components/MessagesView";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Admin COSUMAR" }] }),
  component: AdminMessagesPage,
});

function AdminMessagesPage() {
  return (
    <div className="p-4">
      <MessagesView />
    </div>
  );
}
