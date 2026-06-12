import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Our encryption tool

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true // No two users can have the same email
    },
    password: { 
      type: String, 
      required: true 
    },
    isAdmin: { 
      type: Boolean, 
      required: true, 
      default: false // Regular users are NOT admins by default
    },
  },
  { 
    timestamps: true 
  }
);

// --- SECURITY METHODS ---

// 1. A method to compare a typed password with the encrypted one in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. A "Pre-Save Hook" -> This runs automatically right BEFORE a user is saved to the database
userSchema.pre('save', async function (next) {
  // If the password hasn't been changed, move on
  if (!this.isModified('password')) {
    next();
  }

  // Otherwise, scramble (hash) the password!
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;