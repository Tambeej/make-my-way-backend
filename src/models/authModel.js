import User from './User.js';
import bcrypt from 'bcryptjs';

const authModel = {
  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return null; // Invalid email return error msg?
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return null; // Invalid passwordreturn error msg?
      }

      const { passwordHash, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err) {
      throw new Error('Login error');
    }
  },

  async register(name, email, password) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const passwordHash = await bcrypt.hash(password, 12); 
      const user = new User({
        name,
        email,
        passwordHash,
        preferences: { activities: [], food: [] }, // Default empty
        sharedTrips: [],
      });
      await user.save();
      const { passwordHash: _, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err) {
      throw new Error(err.message || 'Registration error');
    }
  },
};

export default authModel;