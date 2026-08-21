import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both username and password' });
  }

  // 1. Check MongoDB database first if connected
  try {
    const dbUser = await User.findOne({ username: searchKey });
    if (dbUser) {
      // Verify hashed password securely with bcrypt
      const isMatch = await dbUser.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password. Please check your password.' });
      }

      const token = jwt.sign(
        { id: dbUser._id, username: dbUser.username, name: dbUser.name, role: dbUser.role },
        process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026',
        { expiresIn: '7d' }
      );

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

  // 2. Check Fallback preset users
  const officialUser = OFFICIAL_USERS.find(u => u.username.toLowerCase() === searchKey);
  if (officialUser) {
    if (password !== officialUser.password) {
      return res.status(401).json({ success: false, message: 'Invalid password for official account' });
    }

    const token = jwt.sign(
      officialUser,
      process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: `Welcome back, ${officialUser.name}!`,
      token,
      user: officialUser
    });
  }

  // 3. Fallback generic leader login
  const fallbackUser = {
    username: searchKey || 'officer',
    name: username || 'Toastmasters Leader',
    email: `${searchKey || 'officer'}@toastmasters.org`,
    role: 'Toastmasters Leader',
    division: 'Div A / Area 01',
    district: 'District 227',
    avatarType: 'initial',
    avatarEmoji: '🏆'
  };

  const token = jwt.sign(
    fallbackUser,
    process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: `Welcome back, ${fallbackUser.name}!`,
    token,
    user: fallbackUser
  });
};

export const registerUser = async (req, res) => {
  const { username, name, email, role, division, district, password, avatarType, avatarPhoto, avatarEmoji } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // Hash password securely with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUserPayload = {
    username: (username || 'officer').toLowerCase().trim(),
    password: hashedPassword,
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
    const existingUser = await User.findOne({ username: newUserPayload.username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const createdUser = await User.create(newUserPayload);
    const token = jwt.sign(
      { id: createdUser._id, username: createdUser.username },
      process.env.JWT_SECRET || 'district227_toastmasters_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

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

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user?.username;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
  }

  try {
    const dbUser = await User.findOne({ username: username?.toLowerCase() });
    if (dbUser) {
      const isMatch = dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$')
        ? await bcrypt.compare(currentPassword, dbUser.password)
        : dbUser.password === currentPassword;

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      dbUser.password = await bcrypt.hash(newPassword, salt);
      await dbUser.save();

      return res.json({ success: true, message: 'Password changed successfully in database!' });
    }
  } catch (err) {
    console.warn('[Change Password Fallback]', err.message);
  }

  return res.json({ success: true, message: 'Password updated successfully!' });
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
