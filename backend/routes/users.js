import { Router } from 'express';
import User from '../models/user.model.js';

const router = Router();

router.get('/', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add', (req, res) => {
  const { username, password, email } = req.body;
  const newUser = new User({ username, password, email });

  newUser.save()
    .then(() => res.json('User added!', { user: newUser }))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.password !== password) return res.status(400).json({ message: 'Incorrect password' });
    
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'User already exists' });

    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: 'User added!', user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default router;