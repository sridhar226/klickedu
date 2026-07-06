// ============================================================
// Local Storage Mock API
// Replaces json-server for static hosting (Vercel/GitHub Pages)
// All data persists in the browser's localStorage
// ============================================================

// ── Seed Data ────────────────────────────────────────────────
const SEED_LEADS = [
  {
    id: '1',
    name: 'John Doe',
    mobile: '1234567890',
    email: 'john.doe@example.com',
    address: '123 Main St, New York, NY',
    courseInterested: 'React Masterclass',
    leadSource: 'Website',
    status: 'New',
    assignedEmployeeId: '1',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    mobile: '9876543210',
    email: 'jane.smith@example.com',
    address: '456 Oak St, Los Angeles, CA',
    courseInterested: 'Advanced Node.js',
    leadSource: 'Referral',
    status: 'Contacted',
    assignedEmployeeId: '2',
    createdDate: '2024-02-10',
  },
  {
    id: '3',
    name: 'Sridhar K',
    mobile: '8754674567',
    email: 'sridhar@example.com',
    address: 'Coimbatore, Tamil Nadu',
    courseInterested: 'MCA',
    leadSource: 'LinkedIn',
    status: 'Contacted',
    assignedEmployeeId: '1',
    createdDate: '2024-03-05',
  },
  {
    id: '4',
    name: 'Priya Rajan',
    mobile: '9988776655',
    email: 'priya.rajan@example.com',
    address: 'Chennai, Tamil Nadu',
    courseInterested: 'Data Science',
    leadSource: 'Social Media',
    status: 'Qualified',
    assignedEmployeeId: '2',
    createdDate: '2024-04-20',
  },
  {
    id: '5',
    name: 'Arjun Mehta',
    mobile: '7766554433',
    email: 'arjun.mehta@example.com',
    address: 'Mumbai, Maharashtra',
    courseInterested: 'Full Stack Development',
    leadSource: 'Website',
    status: 'New',
    assignedEmployeeId: '1',
    createdDate: '2024-05-01',
  },
  {
    id: '6',
    name: 'Deepa Nair',
    mobile: '8899001122',
    email: 'deepa.nair@example.com',
    address: 'Bangalore, Karnataka',
    courseInterested: 'UI/UX Design',
    leadSource: 'Referral',
    status: 'Lost',
    assignedEmployeeId: '2',
    createdDate: '2024-05-18',
  },
];

const SEED_NOTES = [
  {
    id: '1',
    leadId: '1',
    note: 'Called him today — very interested in the React course. Will follow up next week.',
    createdDate: '2024-01-16T10:00:00Z',
    createdBy: 'Alice Johnson',
  },
  {
    id: '2',
    leadId: '1',
    note: 'Sent course brochure via email. Awaiting response.',
    createdDate: '2024-01-20T14:30:00Z',
    createdBy: 'Alice Johnson',
  },
  {
    id: '3',
    leadId: '2',
    note: 'Had a demo call. She wants to enroll in Node.js batch starting next month.',
    createdDate: '2024-02-12T09:00:00Z',
    createdBy: 'Bob Williams',
  },
  {
    id: '4',
    leadId: '3',
    note: 'Initial contact made. Interested in MCA program details.',
    createdDate: '2024-03-06T11:00:00Z',
    createdBy: 'Alice Johnson',
  },
];

const SEED_EMPLOYEES = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Williams' },
];

// ── Storage Keys ──────────────────────────────────────────────
const KEYS = {
  leads: 'erp_leads',
  notes: 'erp_notes',
  employees: 'erp_employees',
  seeded: 'erp_seeded',
};

// ── Init: seed only once ──────────────────────────────────────
const initStorage = () => {
  if (!localStorage.getItem(KEYS.seeded)) {
    localStorage.setItem(KEYS.leads, JSON.stringify(SEED_LEADS));
    localStorage.setItem(KEYS.notes, JSON.stringify(SEED_NOTES));
    localStorage.setItem(KEYS.employees, JSON.stringify(SEED_EMPLOYEES));
    localStorage.setItem(KEYS.seeded, 'true');
  }
};

// ── Helpers ───────────────────────────────────────────────────
const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// Simulates async axios response shape: { data: ... }
const respond = (data) => Promise.resolve({ data });

// ── Lead API ──────────────────────────────────────────────────
export const getLeads = () => {
  initStorage();
  return respond(read(KEYS.leads));
};

export const getLeadById = (id) => {
  initStorage();
  const lead = read(KEYS.leads).find((l) => l.id === String(id));
  if (!lead) return Promise.reject(new Error('Lead not found'));
  return respond(lead);
};

export const createLead = (data) => {
  initStorage();
  const leads = read(KEYS.leads);
  const newLead = { ...data, id: generateId() };
  write(KEYS.leads, [...leads, newLead]);
  return respond(newLead);
};

export const updateLead = (id, data) => {
  initStorage();
  const leads = read(KEYS.leads).map((l) =>
    l.id === String(id) ? { ...l, ...data, id: String(id) } : l
  );
  write(KEYS.leads, leads);
  return respond(data);
};

export const deleteLead = (id) => {
  initStorage();
  write(KEYS.leads, read(KEYS.leads).filter((l) => l.id !== String(id)));
  return respond({});
};

// ── Notes API ─────────────────────────────────────────────────
export const getNotes = (leadId) => {
  initStorage();
  const notes = read(KEYS.notes).filter((n) => n.leadId === String(leadId));
  return respond(notes);
};

export const createNote = (data) => {
  initStorage();
  const notes = read(KEYS.notes);
  const newNote = { ...data, id: generateId() };
  write(KEYS.notes, [...notes, newNote]);
  return respond(newNote);
};

export const updateNote = (id, data) => {
  initStorage();
  const notes = read(KEYS.notes).map((n) =>
    n.id === String(id) ? { ...n, ...data } : n
  );
  write(KEYS.notes, notes);
  return respond(data);
};

export const deleteNote = (id) => {
  initStorage();
  write(KEYS.notes, read(KEYS.notes).filter((n) => n.id !== String(id)));
  return respond({});
};

// ── Employees API ─────────────────────────────────────────────
export const getEmployees = () => {
  initStorage();
  return respond(read(KEYS.employees));
};

export default { getLeads, getLeadById, createLead, updateLead, deleteLead, getNotes, createNote, updateNote, deleteNote, getEmployees };
