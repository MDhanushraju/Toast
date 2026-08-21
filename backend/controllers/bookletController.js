// In-memory initial booklets array for REST server
let bookletsStore = [
  {
    id: "district-demo-2026",
    title: "District 227 Toastmasters Demo Meeting",
    districtName: "District 227",
    createdBy: "admin",
    status: "ongoing",
    completedPercent: 35,
    page3: {
      date: "2026-08-12",
      time: "11:00 AM",
      hostOrganization: "Corporation Beta",
      venue: "Auditorium A",
      meetingTheme: "Aim for Excellence",
      wordOfDay: "Aspiration",
      wordMeaning: "A strong desire to achieve high goals"
    },
    createdAt: new Date().toISOString()
  }
];

export const getBooklets = async (req, res) => {
  return res.json({
    success: true,
    count: bookletsStore.length,
    data: bookletsStore
  });
};

export const getBookletById = async (req, res) => {
  const { id } = req.params;
  const booklet = bookletsStore.find(b => b.id === id);
  if (!booklet) {
    return res.status(404).json({ success: false, error: 'Booklet not found' });
  }
  return res.json({ success: true, data: booklet });
};

export const createBooklet = async (req, res) => {
  const { title, initialData } = req.body;
  const newBooklet = {
    id: `booklet-${Date.now()}`,
    title: title || 'District Meeting Booklet',
    districtName: 'District 227',
    createdBy: req.user?.username || 'admin',
    status: 'ongoing',
    completedPercent: 0,
    page3: initialData?.page3 || {},
    page4: initialData?.page4 || {},
    page5: initialData?.page5 || {},
    page6: initialData?.page6 || {},
    page7: initialData?.page7 || {},
    page8: initialData?.page8 || {},
    createdAt: new Date().toISOString()
  };

  bookletsStore.unshift(newBooklet);
  return res.status(201).json({ success: true, message: 'Booklet created successfully', data: newBooklet });
};

export const updateBooklet = async (req, res) => {
  const { id } = req.params;
  const index = bookletsStore.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Booklet not found' });
  }

  bookletsStore[index] = {
    ...bookletsStore[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  return res.json({ success: true, message: 'Booklet updated successfully', data: bookletsStore[index] });
};

export const deleteBooklet = async (req, res) => {
  const { id } = req.params;
  bookletsStore = bookletsStore.filter(b => b.id !== id);
  return res.json({ success: true, message: `Booklet ${id} deleted successfully` });
};
