import mongoose from 'mongoose';

// User schema remains as it is
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  name: { type: String, required: true },
  number: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Email of the admin who adds customers
  customers: [
    {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      instagramId: { type: String, required: false },
      attended: { type: Boolean, default: false },
      attendedUpdatedBy: { type: String, default: null }, // Empty by default
      attendedUpdatedAt: { type: Date, default: null },   // Empty by default
      orderConfirmed: { type: Boolean, default: false },
      orderConfirmedUpdatedBy: { type: String, default: null }, // Empty by default
      orderConfirmedUpdatedAt: { type: Date, default: null },   // Empty by default
      declined: { type: Boolean, default: false },
      declinedUpdatedBy: { type: String, default: null }, // Empty by default
      declinedUpdatedAt: { type: Date, default: null },   // Empty by default
    }
  ]
}, { timestamps: true });

const CustomerList = mongoose.models.CustomerList || mongoose.model('CustomerList', customerSchema);

export { User, CustomerList };
