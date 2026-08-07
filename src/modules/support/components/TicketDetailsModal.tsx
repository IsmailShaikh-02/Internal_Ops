import { useState } from "react";
import { Modal } from "./Modal";
import type { SupportTicket } from "../types";
import { useSupportStore } from "../hooks/useSupportState";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { ShieldAlert, User, Clock, AlertTriangle, Send, CheckCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket;
}

export function TicketDetailsModal({ isOpen, onClose, ticket }: TicketDetailsModalProps) {
  const { updateTicketStatus, assignTicket, addComment, escalateTicket } = useSupportStore();
  const [replyText, setReplyText] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addComment(ticket.id, {
      author: "Ada Turing",
      role: isInternal ? "Support Admin" : "Platform Owner",
      content: replyText,
      isInternal
    });

    toast.success(isInternal ? "Internal note added." : "Reply sent to customer.");
    setReplyText("");
  };

  const getPriorityBadgeVariant = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "critical": return "critical";
      case "high": return "warning";
      case "medium": return "info";
      default: return "neutral";
    }
  };

  const getStatusBadgeVariant = (status: SupportTicket["status"]) => {
    switch (status) {
      case "closed": return "neutral";
      case "resolved": return "success";
      case "investigation": return "warning";
      case "internal_discussion": return "info";
      default: return "info";
    }
  };

  const handleStatusChange = (status: SupportTicket["status"]) => {
    updateTicketStatus(ticket.id, status);
    toast.success(`Ticket status updated to ${status.replace("_", " ")}`);
  };

  const handleAgentChange = (agent: string) => {
    assignTicket(ticket.id, agent);
    toast.success(`Ticket assigned to ${agent}`);
  };

  const handleEscalate = () => {
    escalateTicket(ticket.id);
    toast.success("Ticket escalated to critical priority");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ticket Details - ${ticket.ticketNumber}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Side: Ticket Metadata */}
        <div className="md:col-span-5 space-y-4 border-r border-slate-100 pr-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</span>
            <h4 className="text-base font-bold text-slate-800 leading-snug mt-1">{ticket.subject}</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tenant</span>
              <span className="text-sm font-semibold text-slate-700">{ticket.tenant}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
              <span className="text-sm font-semibold text-slate-700">{ticket.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</span>
              <div className="mt-1">
                <StatusBadge variant={getPriorityBadgeVariant(ticket.priority)}>
                  {ticket.priority.toUpperCase()}
                </StatusBadge>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
              <div className="mt-1">
                <StatusBadge variant={getStatusBadgeVariant(ticket.status)}>
                  {ticket.status.replace("_", " ").toUpperCase()}
                </StatusBadge>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Agent</span>
            <select
              value={ticket.assignedAgent}
              onChange={(e) => handleAgentChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Unassigned">Unassigned</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="Alex Mercer">Alex Mercer</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Clock className="h-4 w-4" />
            <span>Created: {ticket.createdDate}</span>
            <span className="mx-1">•</span>
            <span>Due: {ticket.dueDate}</span>
          </div>

          {ticket.slaBreached && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>SLA Target Breached ({ticket.resolutionTime} hrs elapsed)</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Actions</span>
            <div className="grid grid-cols-2 gap-2">
              {ticket.status !== "resolved" && ticket.status !== "closed" ? (
                <Button
                  onClick={() => handleStatusChange("resolved")}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer font-bold"
                >
                  <CheckCircle className="h-3 w-3" />
                  Resolve
                </Button>
              ) : null}

              {ticket.status !== "closed" ? (
                <Button
                  onClick={() => handleStatusChange("closed")}
                  variant="outline"
                  className="rounded-xl text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer font-bold border-red-200 text-red-700 hover:bg-red-50"
                >
                  Close Ticket
                </Button>
              ) : (
                <Button
                  onClick={() => handleStatusChange("open")}
                  variant="outline"
                  className="rounded-xl text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer font-bold border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reopen
                </Button>
              )}

              {ticket.priority !== "critical" && (
                <Button
                  onClick={handleEscalate}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer font-bold col-span-2"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Escalate to Critical
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Communication Thread */}
        <div className="md:col-span-7 flex flex-col h-[500px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Communication History</span>

          {/* Timeline Scroll Container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
            {ticket.comments.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold italic">
                No history. Send a reply or note below.
              </div>
            ) : (
              ticket.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                    comment.isInternal
                      ? "bg-amber-50/70 border-amber-200 text-amber-900"
                      : "bg-slate-50 border-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {comment.author} ({comment.role})
                    </span>
                    {comment.isInternal && (
                      <span className="text-[9px] bg-amber-200 text-amber-800 px-1 rounded-sm uppercase tracking-wide">
                        Internal Note
                      </span>
                    )}
                  </div>
                  <p>{comment.content}</p>
                  <div className="text-[10px] text-slate-400 text-right">
                    {new Date(comment.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handlePostReply} className="border-t border-slate-100 pt-3 space-y-2 shrink-0">
            <div className="flex items-center gap-4 text-xs font-bold">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={!isInternal}
                  onChange={() => setIsInternal(false)}
                  className="text-slate-900 focus:ring-0"
                />
                Public Customer Reply
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-amber-700">
                <input
                  type="radio"
                  checked={isInternal}
                  onChange={() => setIsInternal(true)}
                  className="text-amber-600 focus:ring-0"
                />
                Internal Support Note
              </label>
            </div>

            <div className="flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternal ? "Type private team note..." : "Reply to customer..."}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 flex items-center justify-center cursor-pointer">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
