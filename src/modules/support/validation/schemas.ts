import { z } from "zod";

export const ticketSchema = z.object({
  tenant: z.string().min(1, "Tenant name is required"),
  subject: z.string().min(1, "Subject is mandatory"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high", "critical"], {
    message: "Priority must be selected",
  }),
  assignedAgent: z.string().min(1, "Assigned agent must exist"),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().min(5, "Initial description must be at least 5 characters long"),
});

export const bugSchema = z.object({
  title: z.string().min(1, "Bug title is required"),
  description: z.string().min(5, "Detailed description is required"),
  severity: z.enum(["critical", "high", "medium", "low"], {
    message: "Severity must be selected",
  }),
  assignedDeveloper: z.string().min(1, "Assigned developer is required"),
  tenant: z.string().min(1, "Reporting tenant is required"),
  releaseVersion: z.string().optional(),
});

export const featureSchema = z.object({
  title: z.string().min(1, "Feature request title is required"),
  description: z.string().min(5, "Detailed description is required"),
  category: z.string().min(1, "Category is required"),
  createdBy: z.string().min(1, "Creator tenant name is required"),
});

export const customerRequestSchema = z.object({
  type: z.enum(["account_upgrade", "data_export", "additional_storage", "custom_branding", "integration", "training"]),
  tenant: z.string().min(1, "Tenant name is required"),
  subject: z.string().min(1, "Subject is required"),
  assignedOwner: z.string().min(1, "Owner is required"),
  details: z.string().min(5, "Details must be at least 5 characters"),
});

export const announcementSchema = z.object({
  title: z.string().min(1, "Announcement title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["maintenance", "product_update", "new_feature", "downtime", "security_alert", "general"]),
  scheduledDate: z.string().optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
  targetTenants: z.array(z.string()).min(1, "Select at least one target tenant"),
}).refine((data) => {
  if (data.scheduledDate) {
    const sDate = new Date(data.scheduledDate);
    const now = new Date();
    return sDate > now;
  }
  return true;
}, {
  message: "Scheduled announcements require a future date",
  path: ["scheduledDate"],
});

export const articleSchema = z.object({
  title: z.string().min(1, "Article title cannot be empty"),
  content: z.string().min(1, "Article content is required"),
  category: z.enum(["getting_started", "hrms", "billing", "security", "integrations", "troubleshooting", "faqs"]),
  status: z.enum(["draft", "published", "archived"]),
  notes: z.string().optional(), // for version history comments
});
