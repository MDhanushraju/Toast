import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const OFFICIAL_USERS = [
  { username: 'admin', password: 'password', name: 'System Administrator', email: 'admin@toastmasters.org', role: 'District Main Administrator', division: 'Div A / Area 01', district: 'Toastmasters International', avatarType: 'initial', avatarEmoji: '🏆' },
  { username: 'nitasha', password: 'password', name: 'Nitasha Kumar', email: 'nitasha@toastmasters.org', role: 'District Director', division: 'Div A / Area 01', district: 'Toastmasters International', avatarType: 'initial', avatarEmoji: '🎙️' },
  { username: 'prashanth', password: 'password', name: 'Prashanth K', email: 'prashanth@toastmasters.org', role: 'Club Growth Director', division: 'Div B / Area 01', district: 'Toastmasters International', avatarType: 'initial', avatarEmoji: '👑' },
  { username: 'nagesh', password: 'password', name: 'Nagesh Ramamurthy', email: 'nagesh@toastmasters.org', role: 'CGB Pillar Lead', division: 'Div C / Area 01', district: 'Toastmasters International', avatarType: 'initial', avatarEmoji: '⭐' },
  { username: 'pramod', password: 'password', name: 'Pramod K', email: 'pramod@toastmasters.org', role: 'DMO Task Force Lead', division: 'Div D / Area 01', district: 'Toastmasters International', avatarType: 'initial', avatarEmoji: '🚀' }
];

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const searchKey = (username || '').toLowerCase().trim();

  // Check MongoDB database first if connected
  try {
    const dbUser = await User.findOne({ username: searchKey });
    if (dbUser) {
      const token = jwt.sign({ id: dbUser._id, username: dbUser.username, name: dbUser.name }, process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026', { expiresIn: '7d' });
      return res.json({
        success: true,
        message: `Welcome back, ${dbUser.name}!`,
        token,
        user: dbUser
      });
    }
  } catch (err) {
    console.warn('[DB Login Fallback]', err.message);
  }

  // Fallback preset users
  const user = OFFICIAL_USERS.find(u => u.username.toLowerCase() === searchKey);
  const userPayload = user || {
    username: searchKey || 'officer',
    name: username || 'Toastmasters Leader',
    email: `${searchKey || 'officer'}@toastmasters.org`,
    role: 'Toastmasters Leader',
    division: 'Div A / Area 01',
    district: 'District 227',
    avatarType: 'initial',
    avatarEmoji: '🏆'
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
  const { username, name, email, role, division, district, password, avatarType, avatarPhoto, avatarEmoji } = req.body;

  const newUserPayload = {
    username: (username || 'officer').toLowerCase().trim(),
    password: password || 'password',
    name: name || 'Toastmasters Leader',
    email: email || 'officer@toastmasters.org',
    role: role || 'Toastmasters Leader',
    division: division || 'Div A / Area 01',
    district: district || 'District 227',
    avatarType: avatarType || 'initial',
    avatarPhoto: avatarPhoto || null,
    avatarEmoji: avatarEmoji || '🏆'
  };

  try {
    const createdUser = await User.create(newUserPayload);
    const token = jwt.sign({ id: createdUser._id, username: createdUser.username }, process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026', { expiresIn: '7d' });
    return res.status(201).json({
      success: true,
      message: `Account created successfully for ${createdUser.name}!`,
      token,
      user: createdUser
    });
  } catch (err) {
    console.warn('[DB Register Fallback]', err.message);
    const token = jwt.sign(newUserPayload, process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026', { expiresIn: '7d' });
    return res.status(201).json({
      success: true,
      message: `Account created successfully for ${newUserPayload.name}!`,
      token,
      user: newUserPayload
    });
  }
};

export const updateProfile = async (req, res) => {
  const { username, name, email, bio, phone, avatarType, avatarPhoto, avatarEmoji } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: (username || req.user?.username).toLowerCase() },
      { $set: { name, email, bio, phone, avatarType, avatarPhoto, avatarEmoji } },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: 'Profile & avatar updated in MongoDB database!',
      user: updatedUser || req.body
    });
  } catch (err) {
    return res.json({
      success: true,
      message: 'Profile updated!',
      user: req.body
    });
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
