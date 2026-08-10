// src/shared/workers/search.worker.ts

export interface SearchItem {
  id: string;
  title: string;
  path: string;
  type: 'screen' | 'tenant' | 'invoice' | 'log';
  subtitle?: string;
  badge?: string;
}

// Bounded Min-Heap implementation (holds up to 10 items)
class MinHeap {
  private heap: { item: SearchItem; score: number }[] = [];
  private limit = 10;

  public insert(item: SearchItem, score: number) {
    if (this.heap.length < this.limit) {
      this.heap.push({ item, score });
      this.bubbleUp(this.heap.length - 1);
    } else if (score > this.heap[0].score) {
      this.heap[0] = { item, score };
      this.sinkDown(0);
    }
  }

  public getSortedResults(): { item: SearchItem; score: number }[] {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }

  private bubbleUp(n: number) {
    const element = this.heap[n];
    while (n > 0) {
      const parentN = Math.floor((n + 1) / 2) - 1;
      const parent = this.heap[parentN];
      if (element.score >= parent.score) break;
      this.heap[parentN] = element;
      this.heap[n] = parent;
      n = parentN;
    }
  }

  private sinkDown(n: number) {
    const length = this.heap.length;
    const element = this.heap[n];

    while (true) {
      let child2N = (n + 1) * 2;
      let child1N = child2N - 1;
      let swap = null;

      if (child1N < length) {
        let child1 = this.heap[child1N];
        if (child1.score < element.score) {
          swap = child1N;
        }
      }
      if (child2N < length) {
        let child2 = this.heap[child2N];
        if (
          (swap === null && child2.score < element.score) ||
          (swap !== null && child2.score < this.heap[swap].score)
        ) {
          swap = child2N;
        }
      }

      if (swap === null) break;
      this.heap[n] = this.heap[swap];
      this.heap[swap] = element;
      n = swap;
    }
  }
}

// Trie Node Definition
interface TrieNode {
  children: { [key: string]: TrieNode };
  itemIds: Set<string>;
}

// Trie Class
class PrefixTrie {
  root: TrieNode = { children: {}, itemIds: new Set() };

  insert(word: string, itemId: string) {
    let node = this.root;
    const cleanWord = word.toLowerCase().trim();
    for (const char of cleanWord) {
      if (!node.children[char]) {
        node.children[char] = { children: {}, itemIds: new Set() };
      }
      node = node.children[char];
      node.itemIds.add(itemId);
    }
  }

  searchPrefix(prefix: string): Set<string> {
    let node = this.root;
    const cleanPrefix = prefix.toLowerCase().trim();
    for (const char of cleanPrefix) {
      if (!node.children[char]) {
        return new Set();
      }
      node = node.children[char];
    }
    return node.itemIds;
  }
}

// Bitap algorithm for typo-tolerant fuzzy matching (up to 2 errors)
function bitapSearch(text: string, pattern: string, maxErrors = 2): boolean {
  const m = pattern.length;
  if (m === 0) return true;
  if (m > 31) return text.toLowerCase().includes(pattern.toLowerCase());

  const patternMask: { [char: string]: number } = {};
  for (let i = 0; i < m; i++) {
    const char = pattern[i].toLowerCase();
    patternMask[char] = (patternMask[char] || 0) | (1 << i);
  }

  const R: number[] = [];
  for (let d = 0; d <= maxErrors; d++) {
    R[d] = ~1; // 11111110
  }

  const textLower = text.toLowerCase();
  for (let i = 0; i < textLower.length; i++) {
    const char = textLower[i];
    const mask = patternMask[char] || 0;

    let prevOld = R[0];
    R[0] = ((R[0] << 1) | ~mask);

    for (let d = 1; d <= maxErrors; d++) {
      const old = R[d];
      const insert = prevOld << 1;
      const del = prevOld;
      const sub = prevOld << 1;
      const match = (R[d] << 1) | ~mask;

      R[d] = (match & insert & del & sub);
      prevOld = old;
    }

    if ((R[maxErrors] & (1 << (m - 1))) === 0) {
      return true;
    }
  }

  return false;
}

// Memory index & structures
const itemsMap = new Map<string, SearchItem>();
const trie = new PrefixTrie();

// Initialize index with mock items + static screens (total ~95 screens/entities)
function initializeIndex() {
  const items: SearchItem[] = [
    // Static Modules & Submodules (From Navigation Config)
    { id: '1', title: 'Dashboard Overview', path: '/', type: 'screen', subtitle: 'Main analytics console and system status' },
    { id: '2', title: 'All Tenants', path: '/tenants', type: 'screen', subtitle: 'List and search platform customer accounts' },
    { id: '3', title: 'Create Tenant', path: '/tenants/create', type: 'screen', subtitle: 'Onboard a new organization or system customer' },
    { id: '4', title: 'Tenant Activity Logs', path: '/tenants/activity', type: 'screen', subtitle: 'Real-time telemetry and API operations' },
    { id: '5', title: 'Tenant Audit Trail', path: '/tenants/audit', type: 'screen', subtitle: 'Security and configuration access logs' },
    { id: '6', title: 'Billing Plans', path: '/billing/plans', type: 'screen', subtitle: 'Create and configure product tiers' },
    { id: '7', title: 'Plan Comparison', path: '/billing/comparison', type: 'screen', subtitle: 'Feature matrices and pricing tiers table' },
    { id: '8', title: 'Coupons & Discounts', path: '/billing/coupons', type: 'screen', subtitle: 'Manage promo codes and customer credits' },
    { id: '9', title: 'Taxes & Compliance', path: '/billing/taxes', type: 'screen', subtitle: 'State and national tax configuration' },
    { id: '10', title: 'Subscriptions List', path: '/billing/subscriptions', type: 'screen', subtitle: 'Active customer billing cycles and renewals' },
    { id: '11', title: 'Invoices', path: '/billing/invoices', type: 'screen', subtitle: 'Invoice history, states, and PDF exports' },
    { id: '12', title: 'Payments History', path: '/billing/payments', type: 'screen', subtitle: 'Transaction logs, gateways, and settlements' },
    { id: '13', title: 'Refunds Management', path: '/billing/refunds', type: 'screen', subtitle: 'Process user chargebacks and subscription reversals' },
    { id: '14', title: 'Revenue Dashboard', path: '/billing/dashboard', type: 'screen', subtitle: 'MRR, ARR, and financial metrics' },
    { id: '15', title: 'Revenue Reports', path: '/billing/reports', type: 'screen', subtitle: 'Detailed accounting reports and summaries' },
    { id: '16', title: 'Feature Modules', path: '/features/modules', type: 'screen', subtitle: 'Define dynamic core bundles for licensing' },
    { id: '17', title: 'Feature Flags', path: '/features/flags', type: 'screen', subtitle: 'Toggle dark launches and beta controls' },
    { id: '18', title: 'Tenant Overrides', path: '/features/overrides', type: 'screen', subtitle: 'Custom module overrides for strategic accounts' },
    { id: '19', title: 'Plan Feature Mapping', path: '/features/plans', type: 'screen', subtitle: 'Associate feature toggles with billing plans' },
    { id: '20', title: 'Release Management', path: '/features/releases', type: 'screen', subtitle: 'Track feature rollouts and deployment versions' },
    { id: '21', title: 'Platform Users List', path: '/users', type: 'screen', subtitle: 'Manage workspace access and personnel' },
    { id: '22', title: 'User Roles', path: '/users/roles', type: 'screen', subtitle: 'RBAC controls, root permissions, and policy mappings' },
    { id: '23', title: 'Permission Groups', path: '/users/permission-groups', type: 'screen', subtitle: 'Group policies for departamental structures' },
    { id: '24', title: 'Granular Permissions', path: '/users/permissions', type: 'screen', subtitle: 'System-wide action keys and resource tags' },
    { id: '25', title: 'Role Assignment Wizard', path: '/users/role-assignment', type: 'screen', subtitle: 'Assign roles dynamically to identities' },
    { id: '26', title: 'Security Policies', path: '/users/security-policies', type: 'screen', subtitle: 'IP whitelists, password rules, and session limits' },
    { id: '27', title: 'Support Dashboard', path: '/support/dashboard', type: 'screen', subtitle: 'Customer service metrics and response queues' },
    { id: '28', title: 'Support Tickets', path: '/support/tickets', type: 'screen', subtitle: 'Active customer requests and service desk' },
    { id: '29', title: 'Bug Reports', path: '/support/bugs', type: 'screen', subtitle: 'Track and triage application issues' },
    { id: '30', title: 'Feature Requests', path: '/support/features', type: 'screen', subtitle: 'Triage customer suggestions and enhancements' },
    { id: '31', title: 'Customer Requests', path: '/support/customer-requests', type: 'screen', subtitle: 'Custom development requests and SLAs' },
    { id: '32', title: 'Announcements Editor', path: '/support/announcements', type: 'screen', subtitle: 'Publish release banners and system broadcasts' },
    { id: '33', title: 'Knowledge Base Articles', path: '/support/knowledge', type: 'screen', subtitle: 'Self-service documentation editor' },
    { id: '34', title: 'System Monitoring Logs', path: '/monitoring', type: 'screen', subtitle: 'System metrics, telemetry, and uptime graphs' },
    { id: '35', title: 'Security & Access Keys', path: '/security', type: 'screen', subtitle: 'Manage API tokens and platform credentials' },
    { id: '36', title: 'AI Configurations', path: '/ai', type: 'screen', subtitle: 'LLM parameters, vector databases, and system models' },
    { id: '37', title: 'Third Party Integrations', path: '/integrations', type: 'screen', subtitle: 'Connect Stripe, Slack, HubSpot, and GitHub' },
    { id: '38', title: 'General Settings', path: '/settings', type: 'screen', subtitle: 'System preferences and tenant profile configuration' },
  ];

  // Generate mock Tenants (~20 items)
  const tenantNames = [
    'Acme Corporation', 'Stark Industries', 'Wayne Enterprises', 'Globex Corporation',
    'Umbrella Corp', 'Initech LLC', 'Cyberdyne Systems', 'Hooli Inc', 'Veerdyne Solutions',
    'Soylent Corp', 'Tyrell Corporation', 'Virtucon Group', 'Reynholm Industries',
    'Dunder Mifflin', 'Pied Piper', 'Aperture Science', 'Black Mesa', 'Abstergo Industries',
    'Delos Inc', 'Oscorp Technologies'
  ];
  tenantNames.forEach((name, idx) => {
    items.push({
      id: `tenant-${idx}`,
      title: name,
      path: `/tenants?search=${encodeURIComponent(name)}`,
      type: 'tenant',
      subtitle: `Active Enterprise Tenant • ID: tenant-0${idx + 1}`,
      badge: idx % 3 === 0 ? 'SLA Platinum' : 'SLA Standard'
    });
  });

  // Generate mock Invoices (~20 items)
  const invoiceTemplates = [
    { num: 'INV-2026-001', amount: '$15,400.00', tenant: 'Stark Industries' },
    { num: 'INV-2026-002', amount: '$8,250.00', tenant: 'Wayne Enterprises' },
    { num: 'INV-2026-003', amount: '$420.00', tenant: 'Initech LLC' },
    { num: 'INV-2026-004', amount: '$24,900.00', tenant: 'Cyberdyne Systems' },
    { num: 'INV-2026-005', amount: '$9,120.00', tenant: 'Hooli Inc' },
    { num: 'INV-2026-006', amount: '$35,000.00', tenant: 'Tyrell Corporation' },
    { num: 'INV-2026-007', amount: '$1,200.00', tenant: 'Dunder Mifflin' },
    { num: 'INV-2026-008', amount: '$12,800.00', tenant: 'Pied Piper' },
    { num: 'INV-2026-009', amount: '$6,450.00', tenant: 'Globex Corporation' },
    { num: 'INV-2026-010', amount: '$4,300.00', tenant: 'Acme Corporation' },
    { num: 'INV-2026-011', amount: '$18,600.00', tenant: 'Reynholm Industries' },
    { num: 'INV-2026-012', amount: '$2,750.00', tenant: 'Umbrella Corp' },
    { num: 'INV-2026-013', amount: '$5,900.00', tenant: 'Oscorp Technologies' },
    { num: 'INV-2026-014', amount: '$7,250.00', tenant: 'Aperture Science' },
    { num: 'INV-2026-015', amount: '$11,000.00', tenant: 'Black Mesa' },
    { num: 'INV-2026-016', amount: '$14,500.00', tenant: 'Abstergo Industries' },
    { num: 'INV-2026-017', amount: '$950.00', tenant: 'Delos Inc' },
    { num: 'INV-2026-018', amount: '$31,000.00', tenant: 'Veerdyne Solutions' },
    { num: 'INV-2026-019', amount: '$850.00', tenant: 'Soylent Corp' },
    { num: 'INV-2026-020', amount: '$22,400.00', tenant: 'Virtucon Group' }
  ];
  invoiceTemplates.forEach((inv, idx) => {
    items.push({
      id: `invoice-${idx}`,
      title: `${inv.num} • ${inv.tenant}`,
      path: `/billing/invoices?id=${inv.num}`,
      type: 'invoice',
      subtitle: `Invoice of ${inv.amount} • Issued for ${inv.tenant}`,
      badge: idx % 4 === 0 ? 'Overdue' : 'Paid'
    });
  });

  // Generate mock Logs (~20 items)
  const logsList = [
    { title: 'SLA Breach detected', sub: 'Critical response threshold exceeded for Stark Industries' },
    { title: 'MFA Configuration Override', sub: 'User admin@cyberdyne.com disabled two-factor authentication' },
    { title: 'API Limit Exceeded', sub: 'Slack webhook connection closed after 15,000 requests/min' },
    { title: 'Database Replica Lag', sub: 'Postgres read replica-02 reports lag of 8.4 seconds' },
    { title: 'Failed Payment Retries', sub: 'Stripe card declined for billing subscription sub-9812' },
    { title: 'New Role Authorization', sub: 'Ada Turing promoted User to Platform Owner' },
    { title: 'Webhook Timeout Error', sub: 'HubSpot Sync webhook failed with status code 504 Gateway Timeout' },
    { title: 'Security Alert: IP anomaly', sub: 'SSH request from unknown range 198.51.100.42 blocked' },
    { title: 'Agent Prompt Updated', sub: 'AI Support bot prompt modified for ticket triage flow' },
    { title: 'High CPU Utilization', sub: 'VM-Instance cluster ops-prod-01 spiked to 94.2% usage' },
    { title: 'Tenant Provisioning Success', sub: 'Pied Piper container stack deployed in cluster us-west-2' },
    { title: 'SLA Warning: 10m left', sub: 'Support Ticket #2938 is nearing priority resolution limit' },
    { title: 'OOM Crash Event', sub: 'Node service process crashed on worker-04 (Out Of Memory)' },
    { title: 'SSL Certificate Renewal', sub: 'Let\'s Encrypt certificate auto-renewed for api.internalops.net' },
    { title: 'Malicious Query Blocked', sub: 'SQL Injection signature detected and blocked in search parameter' },
    { title: 'Rate Limiter Active', sub: 'Client IP rate-limited on route /api/v1/auth/login' },
    { title: 'Stripe Webhook Verified', sub: 'Received charge.succeeded event for $15,400.00' },
    { title: 'LDAP Sync Completed', sub: 'Active Directory synchronized 482 active employee users' },
    { title: 'GitLab Registry Deploy', sub: 'Container version tag v4.3.3-rc2 deployed by pipeline #94' },
    { title: 'Audit Trail Exported', sub: 'Admin logs downloaded as CSV by audit-bot account' }
  ];
  logsList.forEach((log, idx) => {
    items.push({
      id: `log-${idx}`,
      title: log.title,
      path: `/tenants/activity?filter=${encodeURIComponent(log.title)}`,
      type: 'log',
      subtitle: log.sub,
      badge: log.title.toLowerCase().includes('breach') || log.title.toLowerCase().includes('crash') || log.title.toLowerCase().includes('fail') ? 'Alert' : 'Info'
    });
  });

  // Load into structure
  items.forEach((item) => {
    itemsMap.set(item.id, item);

    // Split words from fields to build the prefix trie
    const tokens = [
      ...item.title.split(/[\s•/\-_]+/),
      ...item.type.split(/[\s•/\-_]+/),
      ...(item.subtitle ? item.subtitle.split(/[\s•/\-_]+/) : [])
    ];

    tokens.forEach((token) => {
      if (token.length >= 2) {
        trie.insert(token, item.id);
      }
    });
  });
}

// Perform search pipeline
function executeSearch(query: string): SearchItem[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const heap = new MinHeap();
  const matchedIds = new Set<string>();

  // 1. Trie exact prefix matching
  const trieMatches = trie.searchPrefix(cleanQuery);
  trieMatches.forEach((id) => {
    matchedIds.add(id);
    const item = itemsMap.get(id);
    if (item) {
      // Score based on item matching relevance (prefix gets high score base: 100)
      let score = 100;
      if (item.title.toLowerCase().startsWith(cleanQuery)) score += 50;
      heap.insert(item, score);
    }
  });

  // 2. Fallback / supplementary Bitap fuzzy matching for typo tolerance
  // We evaluate other items only if they haven't been matched yet
  itemsMap.forEach((item, id) => {
    if (matchedIds.has(id)) return;

    // Check title, type, subtitle
    const textToMatch = `${item.title} ${item.subtitle || ''} ${item.type}`;
    if (bitapSearch(textToMatch, cleanQuery, 2)) {
      // Fuzzy matches get lower base score (e.g. 50 minus distance estimation or simply 50)
      let score = 50;
      if (item.title.toLowerCase().includes(cleanQuery)) score += 20;
      heap.insert(item, score);
    }
  });

  // Return the top 10 items
  return heap.getSortedResults().map((res) => res.item);
}

// Setup message listener
self.onmessage = (event: MessageEvent) => {
  const { type, query } = event.data;

  if (type === 'INIT') {
    initializeIndex();
    self.postMessage({ type: 'INIT_DONE' });
  } else if (type === 'SEARCH') {
    const results = executeSearch(query);
    self.postMessage({ type: 'RESULTS', results, query });
  }
};
