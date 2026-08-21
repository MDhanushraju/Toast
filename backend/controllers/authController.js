import jwt from 'jsonwebtoken';

const OFFICIAL_USERS = [
  { username: 'admin', password: 'password', name: 'System Administrator', email: 'admin@toastmasters.org', role: 'District Main Administrator', division: 'Div A / Area 01', district: 'Toastmasters International' },
  { username: 'nitasha', password: 'password', name: 'Nitasha Kumar', email: 'nitasha@toastmasters.org', role: 'District Director', division: 'Div A / Area 01', district: 'Toastmasters International' },
  { username: 'prashanth', password: 'password', name: 'Prashanth K', email: 'prashanth@toastmasters.org', role: 'Club Growth Director', division: 'Div B / Area 01', district: 'Toastmasters International' },
  { username: 'nagesh', password: 'password', name: 'Nagesh Ramamurthy', email: 'nagesh@toastmasters.org', role: 'CGB Pillar Lead', division: 'Div C / Area 01', district: 'Toastmasters International' },
  { username: 'pramod', password: 'password', name: 'Pramod K', email: 'pramod@toastmasters.org', role: 'DMO Task Force Lead', division: 'Div D / Area 01', district: 'Toastmasters International' }
];

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const searchKey = (username || '').toLowerCase().trim();

  const user = OFFICIAL_USERS.find(u => u.username.toLowerCase() === searchKey);
  const userPayload = user || {
    username: searchKey || 'officer',
    name: username || 'Toastmasters Leader',
    email: `${searchKey || 'officer'}@toastmasters.org`,
    role: 'Toastmasters Leader',
    division: 'Div A / Area 01',
    district: 'District 227'
  };

  const token = jwt.sign(userPayload, process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026', { expiresIn: '7d' });

  return res.json({
    success: true,
    message: `Welcome back, ${userPayload.name}!`,
    token,
    user: userPayload
  });
};

export const registerUser = async (req, res) => {
  const { username, name, email, role, division, district, password } = req.body;

  const newUser = {
    username: (username || 'officer').toLowerCase().trim(),
    name: name || 'Toastmasters Leader',
    email: email || 'officer@toastmasters.org',
    role: role || 'Toastmasters Leader',
    division: division || 'Div A / Area 01',
    district: district || 'District 227'
  };

  const token = jwt.sign(newUser, process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026', { expiresIn: '7d' });

  return res.status(201).json({
    success: true,
    message: `Account created successfully for ${newUser.name}!`,
    token,
    user: newUser
  });
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
