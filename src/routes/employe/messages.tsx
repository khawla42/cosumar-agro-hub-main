import { createFileRoute } from "@tanstack/react-router";
import { MessagesView } from "@/components/MessagesView";

export const Route = createFileRoute("/employe/messages")({
  head: () => ({ meta: [{ title: "Messages — Employé COSUMAR" }] }),
  component: EmployeMessagesPage,
});

function EmployeMessagesPage() {
  console.log("Rendering EmployeMessagesPage");
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Messages (Employé)</h1>
      <MessagesView />
    </div>
  );
}
