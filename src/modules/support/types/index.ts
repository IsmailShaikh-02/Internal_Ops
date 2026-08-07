export interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  createdDate: string;
  isInternal: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  tenant: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAgent: string;
  createdDate: string;
  dueDate: string;
  status: 'open' | 'assigned' | 'investigation' | 'internal_discussion' | 'resolved' | 'closed';
  comments: Comment[];
  attachments: string[];
  slaBreached: boolean;
  resolutionTime?: number; // in hours
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'assigned' | 'in_progress' | 'testing' | 'fixed' | 'closed';
  assignedDeveloper: string;
  screenshots: string[];
  releaseVersion?: string;
  tenant: string;
  createdDate: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  status: 'new' | 'under_review' | 'approved' | 'planned' | 'in_development' | 'released' | 'rejected';
  plannedRelease?: string;
  createdBy: string;
  createdDate: string;
  votedBy: string[]; // names of voters
}

export interface CustomerRequest {
  id: string;
  type: 'account_upgrade' | 'data_export' | 'additional_storage' | 'custom_branding' | 'integration' | 'training';
  tenant: string;
  subject: string;
  assignedOwner: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  createdDate: string;
  details: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'maintenance' | 'product_update' | 'new_feature' | 'downtime' | 'security_alert' | 'general';
  scheduledDate?: string;
  expiryDate?: string;
  targetTenants: string[]; // 'all' or specific tenant IDs
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  createdDate: string;
}

export interface ArticleVersion {
  version: number;
  updatedBy: string;
  date: string;
  notes: string;
  content: string;
  title: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: 'getting_started' | 'hrms' | 'billing' | 'security' | 'integrations' | 'troubleshooting' | 'faqs';
  status: 'draft' | 'published' | 'archived';
  author: string;
  lastUpdated: string;
  readTime: string;
  version: number;
  history: ArticleVersion[];
}
