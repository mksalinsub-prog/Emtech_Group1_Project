export const inquiryTypes = [
  { id: 'Medical', name: 'Medical assistance', note: 'Medicine, hospitalization, laboratory, and referrals', docs: ['Valid government ID', 'Medical abstract', "Doctor's prescription", 'Laboratory quotation'] },
  { id: 'Financial', name: 'Financial assistance', note: 'Barangay or city social welfare support', docs: ['Valid government ID', 'Proof of need', 'Expense documents'] },
  { id: 'Other', name: 'Other assistance', note: 'Burial, food, livelihood, shelter, and referrals', docs: ['Valid government ID', 'Supporting document'] },
]

export const inquiries = [
  { id: 'INQ-2026-0328', resident: 'Maria L. Reyes', type: 'Medical', need: 'Laboratory and medicine support', urgency: 'Within 7 days', status: 'Documents needed', received: ['Valid government ID', 'Medical abstract'], updates: ['Advised resident to upload the prescription and laboratory quotation.'] },
  { id: 'INQ-2026-0327', resident: 'Joel P. Santos', type: 'Financial', need: 'Short-term financial support', urgency: 'Within 14 days', status: 'For assessment', received: ['Valid government ID'], updates: [] },
  { id: 'INQ-2026-0325', resident: 'Liza B. Evangelista', type: 'Other', need: 'Livelihood referral', urgency: 'Flexible', status: 'Referred', received: ['Valid government ID', 'Supporting document'], updates: ['Referred to the city livelihood program.'] },
  { id: 'INQ-2026-0322', resident: 'Ramon D. Villanueva', type: 'Medical', need: 'Maintenance medicines', urgency: 'Within 7 days', status: 'Resolved', received: ['Valid government ID', 'Medical abstract', "Doctor's prescription", 'Laboratory quotation'], updates: ['Medicine voucher released.'] },
]

export const allowanceCategories = [
  { id: 'Senior Citizen', name: 'Senior Citizens', rule: 'Age 60+, valid OSCA ID, active residency', batch: 'Nov 4, Batch A', amount: 1000 },
  { id: 'PWD', name: 'Persons with Disabilities', rule: 'Valid PWD ID, medical certificate, active residency', batch: 'Nov 10, Batch B', amount: 1000 },
  { id: 'Solo Parent', name: 'Solo Parents', rule: 'Valid Solo Parent ID, current assessment, active residency', batch: 'Nov 17, Batch C', amount: 1000 },
]

export const beneficiaries = [
  { id: 'SC-2026-0118', name: 'Ramon D. Villanueva', category: 'Senior Citizen', status: 'Eligible' },
  { id: 'SC-2026-0125', name: 'Elena P. Castillo', category: 'Senior Citizen', status: 'Eligible' },
  { id: 'PWD-2026-0082', name: 'Jun R. Carlos', category: 'PWD', status: 'For verification' },
  { id: 'SP-2026-0041', name: 'Angela T. Morales', category: 'Solo Parent', status: 'Eligible' },
  { id: 'PWD-2026-0084', name: 'Nestor G. Pascual', category: 'PWD', status: 'On hold' },
]
