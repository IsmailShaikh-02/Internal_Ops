import { create } from "zustand";
import type { SupportTicket, BugReport, FeatureRequest, CustomerRequest, Announcement, KnowledgeArticle, Comment } from "../types";
import {
  mockTickets,
  mockBugs,
  mockFeatureRequests,
  mockCustomerRequests,
  mockAnnouncements,
  mockArticles
} from "../data/mockData";

interface SupportStore {
  tickets: SupportTicket[];
  bugs: BugReport[];
  featureRequests: FeatureRequest[];
  customerRequests: CustomerRequest[];
  announcements: Announcement[];
  articles: KnowledgeArticle[];

  // Ticket actions
  addTicket: (ticket: Omit<SupportTicket, "id" | "ticketNumber" | "createdDate" | "comments" | "slaBreached">) => void;
  updateTicketStatus: (id: string, status: SupportTicket["status"]) => void;
  assignTicket: (id: string, agent: string) => void;
  addComment: (ticketId: string, comment: Omit<Comment, "id" | "createdDate">) => void;
  escalateTicket: (id: string) => void;

  // Bug actions
  addBug: (bug: Omit<BugReport, "id" | "createdDate" | "status">) => void;
  assignDeveloper: (id: string, dev: string) => void;
  updateBugStatus: (id: string, status: BugReport["status"]) => void;
  updateBugSeverity: (id: string, severity: BugReport["severity"]) => void;

  // Feature actions
  addFeatureRequest: (req: Omit<FeatureRequest, "id" | "votes" | "createdDate" | "votedBy" | "status">) => void;
  voteFeatureRequest: (id: string, userName: string) => void;
  updateFeatureStatus: (id: string, status: FeatureRequest["status"], plannedRelease?: string) => void;

  // Customer request actions
  addCustomerRequest: (req: Omit<CustomerRequest, "id" | "createdDate" | "status">) => void;
  updateCustomerRequestStatus: (id: string, status: CustomerRequest["status"]) => void;
  assignCustomerRequestOwner: (id: string, owner: string) => void;

  // Announcement actions
  addAnnouncement: (ann: Omit<Announcement, "id" | "createdDate" | "status">) => void;

  // Article actions
  addArticle: (art: Omit<KnowledgeArticle, "id" | "version" | "history" | "lastUpdated" | "readTime">) => void;
  updateArticle: (id: string, title: string, content: string, category: KnowledgeArticle["category"], notes: string, updatedBy: string) => void;
  archiveArticle: (id: string) => void;
}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: mockTickets,
  bugs: mockBugs,
  featureRequests: mockFeatureRequests,
  customerRequests: mockCustomerRequests,
  announcements: mockAnnouncements,
  articles: mockArticles,

  // Ticket actions
  addTicket: (newTicket) =>
    set((state) => {
      const ticketId = `ticket-${Date.now()}`;
      const ticketNumber = `TIC-${Math.floor(1000 + Math.random() * 9000)}`;
      const createdDate = new Date().toISOString().split("T")[0];
      const ticket: SupportTicket = {
        ...newTicket,
        id: ticketId,
        ticketNumber,
        createdDate,
        comments: [],
        slaBreached: false
      };
      return { tickets: [ticket, ...state.tickets] };
    }),

  updateTicketStatus: (id, status) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),

  assignTicket: (id, agent) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, assignedAgent: agent, status: t.status === "open" ? "assigned" : t.status } : t
      ),
    })),

  addComment: (ticketId, comment) =>
    set((state) => ({
      tickets: state.tickets.map((t) => {
        if (t.id !== ticketId) return t;
        const newComment: Comment = {
          ...comment,
          id: `comment-${Date.now()}`,
          createdDate: new Date().toISOString(),
        };
        return {
          ...t,
          comments: [...t.comments, newComment],
        };
      }),
    })),

  escalateTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.map((t) => {
        if (t.id !== id) return t;
        const escComment: Comment = {
          id: `comment-${Date.now()}`,
          author: "System Bot",
          role: "Automated Service",
          content: "Ticket has been escalated to CRITICAL priority due to operational urgency.",
          createdDate: new Date().toISOString(),
          isInternal: true,
        };
        return {
          ...t,
          priority: "critical",
          status: "investigation",
          comments: [...t.comments, escComment],
        };
      }),
    })),

  // Bug actions
  addBug: (newBug) =>
    set((state) => {
      const bug: BugReport = {
        ...newBug,
        id: `bug-${Date.now()}`,
        createdDate: new Date().toISOString().split("T")[0],
        status: "new"
      };
      return { bugs: [bug, ...state.bugs] };
    }),

  assignDeveloper: (id, dev) =>
    set((state) => ({
      bugs: state.bugs.map((b) =>
        b.id === id ? { ...b, assignedDeveloper: dev, status: b.status === "new" ? "assigned" : b.status } : b
      ),
    })),

  updateBugStatus: (id, status) =>
    set((state) => ({
      bugs: state.bugs.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    })),

  updateBugSeverity: (id, severity) =>
    set((state) => ({
      bugs: state.bugs.map((b) =>
        b.id === id ? { ...b, severity } : b
      ),
    })),

  // Feature actions
  addFeatureRequest: (newFeat) =>
    set((state) => {
      const feat: FeatureRequest = {
        ...newFeat,
        id: `feat-${Date.now()}`,
        votes: 1,
        createdDate: new Date().toISOString().split("T")[0],
        votedBy: [newFeat.createdBy],
        status: "new"
      };
      return { featureRequests: [feat, ...state.featureRequests] };
    }),

  voteFeatureRequest: (id, userName) =>
    set((state) => ({
      featureRequests: state.featureRequests.map((f) => {
        if (f.id !== id) return f;
        if (f.votedBy.includes(userName)) {
          // Remove vote
          return {
            ...f,
            votes: f.votes - 1,
            votedBy: f.votedBy.filter((v) => v !== userName)
          };
        } else {
          // Add vote
          return {
            ...f,
            votes: f.votes + 1,
            votedBy: [...f.votedBy, userName]
          };
        }
      }),
    })),

  updateFeatureStatus: (id, status, plannedRelease) =>
    set((state) => ({
      featureRequests: state.featureRequests.map((f) =>
        f.id === id ? { ...f, status, ...(plannedRelease ? { plannedRelease } : {}) } : f
      ),
    })),

  // Customer requests
  addCustomerRequest: (newReq) =>
    set((state) => {
      const req: CustomerRequest = {
        ...newReq,
        id: `cust-${Date.now()}`,
        createdDate: new Date().toISOString().split("T")[0],
        status: "new"
      };
      return { customerRequests: [req, ...state.customerRequests] };
    }),

  updateCustomerRequestStatus: (id, status) =>
    set((state) => ({
      customerRequests: state.customerRequests.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    })),

  assignCustomerRequestOwner: (id, owner) =>
    set((state) => ({
      customerRequests: state.customerRequests.map((r) =>
        r.id === id ? { ...r, assignedOwner: owner, status: r.status === "new" ? "in_progress" : r.status } : r
      ),
    })),

  // Announcements
  addAnnouncement: (newAnn) =>
    set((state) => {
      const scheduled = newAnn.scheduledDate;
      const now = new Date();
      let status: Announcement["status"] = "published";
      if (scheduled && new Date(scheduled) > now) {
        status = "scheduled";
      }
      const ann: Announcement = {
        ...newAnn,
        id: `ann-${Date.now()}`,
        status,
        createdDate: new Date().toISOString().split("T")[0]
      };
      return { announcements: [ann, ...state.announcements] };
    }),

  // Articles
  addArticle: (newArt) =>
    set((state) => {
      const art: KnowledgeArticle = {
        ...newArt,
        id: `art-${Date.now()}`,
        version: 1,
        history: [],
        lastUpdated: "Just now",
        readTime: "5 min read"
      };
      return { articles: [art, ...state.articles] };
    }),

  updateArticle: (id, title, content, category, notes, updatedBy) =>
    set((state) => ({
      articles: state.articles.map((art) => {
        if (art.id !== id) return art;
        const currentVersionData = {
          version: art.version,
          updatedBy: art.author,
          date: new Date().toISOString().split("T")[0],
          notes: notes || "Updated article content",
          content: art.content,
          title: art.title
        };
        return {
          ...art,
          title,
          content,
          category,
          author: updatedBy,
          version: art.version + 1,
          lastUpdated: "Just now",
          history: [currentVersionData, ...art.history]
        };
      })
    })),

  archiveArticle: (id) =>
    set((state) => ({
      articles: state.articles.map((art) =>
        art.id === id ? { ...art, status: "archived" } : art
      )
    }))
}));
