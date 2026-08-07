import type { SupportTicket, BugReport, FeatureRequest, CustomerRequest, Announcement, KnowledgeArticle } from "../types";

export const mockTickets: SupportTicket[] = [
  {
    id: "ticket-1",
    ticketNumber: "TIC-8012",
    tenant: "Acme Corp",
    subject: "SSO Login failure on European cluster",
    category: "Security",
    priority: "critical",
    assignedAgent: "Sarah Jenkins",
    createdDate: "2026-08-05",
    dueDate: "2026-08-06",
    status: "investigation",
    comments: [
      {
        id: "c-1",
        author: "John Doe",
        role: "Tenant Admin",
        content: "We are getting a 500 error when clicking the SSO login button from our custom domain.",
        createdDate: "2026-08-05T09:00:00Z",
        isInternal: false
      },
      {
        id: "c-2",
        author: "Sarah Jenkins",
        role: "Support Executive",
        content: "Checking the authentication server logs. It seems client ID verification is timing out.",
        createdDate: "2026-08-05T09:30:00Z",
        isInternal: true
      }
    ],
    attachments: ["auth_error_logs.txt"],
    slaBreached: true,
    resolutionTime: 24
  },
  {
    id: "ticket-2",
    ticketNumber: "TIC-7945",
    tenant: "Stark Industries",
    subject: "API Rate limit upgrade request",
    category: "Billing",
    priority: "medium",
    assignedAgent: "Alex Mercer",
    createdDate: "2026-08-06",
    dueDate: "2026-08-09",
    status: "assigned",
    comments: [
      {
        id: "c-3",
        author: "Pepper Potts",
        role: "Tenant Owner",
        content: "We are launching a batch processing run next week and need temporary rate limit relief.",
        createdDate: "2026-08-06T11:00:00Z",
        isInternal: false
      }
    ],
    attachments: [],
    slaBreached: false
  },
  {
    id: "ticket-3",
    ticketNumber: "TIC-7891",
    tenant: "Wayne Enterprises",
    subject: "Custom branding logo is truncated on mobile viewports",
    category: "Integrations",
    priority: "low",
    assignedAgent: "Unassigned",
    createdDate: "2026-08-07",
    dueDate: "2026-08-14",
    status: "open",
    comments: [],
    attachments: ["screenshot.png"],
    slaBreached: false
  },
  {
    id: "ticket-4",
    ticketNumber: "TIC-7501",
    tenant: "Oscorp",
    subject: "Unable to export compliance PDF for Q2 audit",
    category: "HRMS",
    priority: "high",
    assignedAgent: "Sarah Jenkins",
    createdDate: "2026-08-01",
    dueDate: "2026-08-03",
    status: "resolved",
    comments: [
      {
        id: "c-4",
        author: "Norman Osborn",
        role: "Tenant Admin",
        content: "The loader spins indefinitely when choosing date ranges.",
        createdDate: "2026-08-01T14:00:00Z",
        isInternal: false
      },
      {
        id: "c-5",
        author: "Sarah Jenkins",
        role: "Support Executive",
        content: "Resolved. Cleaned up cache on the PDF generator instance.",
        createdDate: "2026-08-02T10:00:00Z",
        isInternal: false
      }
    ],
    attachments: [],
    slaBreached: false,
    resolutionTime: 20
  },
  {
    id: "ticket-5",
    ticketNumber: "TIC-7430",
    tenant: "Tyrell Corp",
    subject: "Database latency spikes during peak hours",
    category: "Troubleshooting",
    priority: "high",
    assignedAgent: "Alex Mercer",
    createdDate: "2026-08-02",
    dueDate: "2026-08-04",
    status: "closed",
    comments: [],
    attachments: [],
    slaBreached: false,
    resolutionTime: 8
  }
];

export const mockBugs: BugReport[] = [
  {
    id: "bug-1",
    title: "SQL injection vulnerability in tenant search query",
    description: "Input parameter 'query' is not sanitized correctly before concatenating into database transaction.",
    severity: "critical",
    status: "in_progress",
    assignedDeveloper: "Diana Prince",
    screenshots: [],
    releaseVersion: "v2.4.1-rc1",
    tenant: "Internal Security",
    createdDate: "2026-08-06"
  },
  {
    id: "bug-2",
    title: "Invoice PDF total calculation rounding error",
    description: "For sub-cent tax rates, rounding causes a 1 cent mismatch compared to Stripe balances.",
    severity: "medium",
    status: "new",
    assignedDeveloper: "Unassigned",
    screenshots: ["rounding_error.png"],
    tenant: "Acme Corp",
    createdDate: "2026-08-07"
  },
  {
    id: "bug-3",
    title: "Mobile menu drawer crashes when rotating device",
    description: "Orientation change event listener triggers a re-render loop leading to call stack limit error.",
    severity: "low",
    status: "testing",
    assignedDeveloper: "Bruce Wayne",
    screenshots: [],
    releaseVersion: "v2.4.0",
    tenant: "Globex",
    createdDate: "2026-08-04"
  }
];

export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: "feat-1",
    title: "SAML 2.0 Identity Provider configuration via self-service dashboard",
    description: "Allow tenant administrators to configure custom metadata XML and map user attributes without contacting support.",
    category: "Security",
    votes: 42,
    status: "approved",
    createdBy: "Stark Industries",
    createdDate: "2026-07-28",
    votedBy: ["Stark Industries", "Acme Corp", "Wayne Enterprises"]
  },
  {
    id: "feat-2",
    title: "Slack Notification Integration for critical security alerts",
    description: "Direct webhook connection to post critical logs directly into a specific Slack channel.",
    category: "Integrations",
    votes: 18,
    status: "planned",
    plannedRelease: "v2.5.0",
    createdBy: "Wayne Enterprises",
    createdDate: "2026-08-02",
    votedBy: ["Wayne Enterprises", "Oscorp"]
  },
  {
    id: "feat-3",
    title: "Custom branding colors for client invoices",
    description: "Let tenants customize CSS variables or HEX codes on invoices generated from the subscription page.",
    category: "Billing",
    votes: 9,
    status: "new",
    createdBy: "Acme Corp",
    createdDate: "2026-08-06",
    votedBy: ["Acme Corp"]
  }
];

export const mockCustomerRequests: CustomerRequest[] = [
  {
    id: "cust-1",
    type: "account_upgrade",
    tenant: "Umbrella Corp",
    subject: "Upgrade to Enterprise Tier",
    assignedOwner: "Clark Kent",
    status: "in_progress",
    createdDate: "2026-08-06",
    details: "Requested custom service agreement with 99.99% uptime guarantee."
  },
  {
    id: "cust-2",
    type: "data_export",
    tenant: "Cyberdyne Systems",
    subject: "Full database schema and file export",
    assignedOwner: "Lois Lane",
    status: "new",
    createdDate: "2026-08-07",
    details: "GDPR compliance data package request containing all logs from past 3 years."
  },
  {
    id: "cust-3",
    type: "custom_branding",
    tenant: "Initech",
    subject: "Custom CSS theme mapping",
    assignedOwner: "Clark Kent",
    status: "completed",
    createdDate: "2026-08-03",
    details: "Requested white-labeled portal URL mapping to portal.initech.com."
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Scheduled DB Maintenance on Sunday 2 AM UTC",
    content: "We will be upgrading our master database cluster to increase write throughput. Expect brief interruptions in service of up to 5 minutes.",
    type: "maintenance",
    scheduledDate: "2026-08-09T02:00:00Z",
    expiryDate: "2026-08-09T03:00:00Z",
    targetTenants: ["all"],
    status: "published",
    createdDate: "2026-08-07"
  },
  {
    id: "ann-2",
    title: "New AI Log Analysis Tools Released",
    content: "Tenants on premium plans can now enable auto-categorization of security audits using our new Gemini integration.",
    type: "new_feature",
    targetTenants: ["all"],
    status: "published",
    createdDate: "2026-08-05"
  },
  {
    id: "ann-3",
    title: "Acme Corp Private beta deployment complete",
    content: "Your private gateway proxy feature is now live on proxy-beta-acme.net.",
    type: "product_update",
    targetTenants: ["Acme Corp"],
    status: "published",
    createdDate: "2026-08-07"
  }
];

export const mockArticles: KnowledgeArticle[] = [
  {
    id: "art-1",
    title: "Getting started with SSO",
    content: "Single Sign-On (SSO) enables your users to log in using your company Identity Provider (IdP). This article guides you through configuring SAML 2.0 credentials and domain mapping inside the Security policy tab.",
    category: "getting_started",
    status: "published",
    author: "Ada Turing",
    lastUpdated: "4 days ago",
    readTime: "12 min read",
    version: 1,
    history: [
      {
        version: 1,
        updatedBy: "Ada Turing",
        date: "2026-08-03",
        notes: "Initial publication of getting started with SSO mapping rules.",
        content: "Single Sign-On (SSO) enables your users to log in using your company Identity Provider (IdP). This article guides you through configuring SAML 2.0 credentials and domain mapping inside the Security policy tab.",
        title: "Getting started with SSO"
      }
    ]
  },
  {
    id: "art-2",
    title: "Configuring webhooks",
    content: "Configure real-time webhooks to push event payloads to your servers. We support notifications for invoices, subscription lifecycle changes, user logins, and critical audit breaches.",
    category: "integrations",
    status: "published",
    author: "Ada Turing",
    lastUpdated: "4 days ago",
    readTime: "12 min read",
    version: 1,
    history: []
  },
  {
    id: "art-3",
    title: "Understanding audit logs",
    content: "Compliance and auditing are simple. Learn how to export activity logs in CSV or JSON formats, configure streaming endpoints for SIEM pipelines, and read platform events.",
    category: "security",
    status: "published",
    author: "Ada Turing",
    lastUpdated: "4 days ago",
    readTime: "12 min read",
    version: 1,
    history: []
  },
  {
    id: "art-4",
    title: "Data residency in eu-west",
    content: "Learn how to pin your tenant databases to European regions (eu-west-1) to fulfill GDPR guidelines and ensure data never crosses jurisdictional borders.",
    category: "security",
    status: "published",
    author: "Ada Turing",
    lastUpdated: "4 days ago",
    readTime: "12 min read",
    version: 1,
    history: []
  },
  {
    id: "art-5",
    title: "Rotating API keys",
    content: "Step-by-step instructions on performing zero-downtime key rotation for your API server integrations. Learn how to generate secondary keys and test headers.",
    category: "security",
    status: "published",
    author: "Ada Turing",
    lastUpdated: "4 days ago",
    readTime: "12 min read",
    version: 1,
    history: []
  },
  {
    id: "art-6",
    title: "Migrating storage to R2",
    content: "Follow this checklist to move your asset attachments from AWS S3 buckets to Cloudflare R2 bucket. Reduce bandwidth fees and latency with local caches.",
    category: "billing",
    status: "published",
    author: "Ada Turing",
    lastUpdated: "4 days ago",
    readTime: "12 min read",
    version: 1,
    history: []
  }
];
