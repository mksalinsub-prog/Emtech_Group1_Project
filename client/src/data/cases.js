export const incidents = [
  { id: 'INC-2026-0081', title: 'Minor road collision', location: 'Mabini Ave. corner Rosal Rd.', date: 'Oct 1, 8:35 AM', status: 'Under review', category: 'Road incident' },
  { id: 'INC-2026-0080', title: 'Noise disturbance', location: 'Purok 5 covered court', date: 'Sep 30, 10:18 PM', status: 'Resolved', category: 'Peace and order' },
  { id: 'INC-2026-0079', title: 'Fallen electrical line', location: 'Narra Lane, Purok 4', date: 'Sep 30, 4:42 PM', status: 'Referred', category: 'Public safety' },
  { id: 'INC-2026-0078', title: 'Missing property report', location: 'Barangay public market', date: 'Sep 28, 2:15 PM', status: 'Open', category: 'Theft or loss' },
  { id: 'INC-2026-0077', title: 'Stray dog concern', location: 'Sampaguita St., Purok 3', date: 'Sep 28, 9:05 AM', status: 'Resolved', category: 'Animal concern' },
]

export const complaints = [
  {
    id: 'CMP-2026-0226', subject: 'Blocked drainage near residence', resident: 'Joel P. Santos', purok: 2,
    category: 'Public works / drainage', committee: 'Public Works & Sanitation', status: 'Pending',
    description: 'Drainage along Mabini Avenue has remained blocked after recent rain, causing water to collect near several homes.',
    updates: [
      { text: 'Complaint received', time: 'Oct 1, 10:08 AM' },
      { text: 'Assigned to Public Works & Sanitation Committee', time: 'Oct 1, 10:24 AM' },
    ],
  },
  {
    id: 'CMP-2026-0227', subject: 'Recurring late-night noise', resident: 'Andrea M. Cruz', purok: 5,
    category: 'Peace and order', committee: 'Peace and Order Committee', status: 'In progress',
    description: 'Loud music past 11 PM on weeknights near Rosal Road.',
    updates: [{ text: 'Complaint received', time: 'Sep 29, 9:10 AM' }, { text: 'Tanod sent to monitor', time: 'Sep 30, 10:40 PM' }],
  },
  {
    id: 'CMP-2026-0224', subject: 'Boundary clarification request', resident: 'Ramon D. Villanueva', purok: 1,
    category: 'Land and boundary', committee: 'Lupong Tagapamayapa', status: 'In progress',
    description: 'Resident asks for clarification of the lot boundary beside Rizal Extension.',
    updates: [{ text: 'Complaint received', time: 'Sep 25, 2:00 PM' }, { text: 'Scheduled for mediation', time: 'Sep 27, 11:15 AM' }],
  },
  {
    id: 'CMP-2026-0225', subject: 'Uncollected waste concern', resident: 'Liza B. Evangelista', purok: 4,
    category: 'Sanitation', committee: 'Public Works & Sanitation', status: 'Resolved',
    description: 'Garbage was not collected for three days along Narra Lane.',
    updates: [{ text: 'Complaint received', time: 'Sep 26, 8:30 AM' }, { text: 'Collection resumed', time: 'Sep 28, 7:00 AM' }],
  },
]
