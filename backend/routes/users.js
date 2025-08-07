import { Router } from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add', (req, res) => {
  const { username, password, email} = req.body;
  const newUser = new User({ username, password, email, isAdmin });

  newUser.save()
    .then(() => res.json('User added!', { user: newUser }))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
    
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ message: "Login successful", user,token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = username === "admin";
    const newUser = new User({ username, password: hashedPassword, email, isAdmin});
    await newUser.save();
    res.status(201).json({ message: 'User added!', user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default router;