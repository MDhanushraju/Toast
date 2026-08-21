let contactsStore = [
  { id: '1', name: 'Nitasha Kumar', role: 'District Director', division: 'Division A', area: 'Area 01', phone: '+1 (555) 227-0100', email: 'nitasha@toastmasters.org', club: 'District Leadership Club' },
  { id: '2', name: 'Prashanth K', role: 'Club Growth Director', division: 'Division B', area: 'Area 01', phone: '+1 (555) 227-0200', email: 'prashanth@toastmasters.org', club: 'Pioneer Toastmasters' },
  { id: '3', name: 'Nagesh Ramamurthy', role: 'CGB Pillar Lead', division: 'Division C', area: 'Area 01', phone: '+1 (555) 227-0300', email: 'nagesh@toastmasters.org', club: 'Corporate Elite' }
];

export const getContacts = async (req, res) => {
  return res.json({ success: true, count: contactsStore.length, data: contactsStore });
};

export const createContact = async (req, res) => {
  const newContact = { id: `c-${Date.now()}`, ...req.body };
  contactsStore.push(newContact);
  return res.status(201).json({ success: true, message: 'Contact added', data: newContact });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  contactsStore = contactsStore.filter(c => c.id !== id);
  return res.json({ success: true, message: 'Contact deleted' });
};
