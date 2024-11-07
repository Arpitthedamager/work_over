import mongoose from 'mongoose';

// User schema remains as it is
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// New Customer schema, using email instead of adminId
const customerSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Email of the admin who adds customers
  customers: [
    {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      instagramId: { type: String, required: false },
      attended: { type: Boolean, default: false },
      orderConfirmed: { type: Boolean, default: false },
    }
  ]
}, { timestamps: true });

const CustomerList = mongoose.models.CustomerList || mongoose.model('CustomerList', customerSchema);

export { User, CustomerList };
