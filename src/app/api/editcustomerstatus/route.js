// /pages/api/customers/edit-by-phone.js
import { connectToDatabase } from '@/app/lib/util';
import { CustomerList } from '@/app/lib/models';


export default async function handler(req, res) {
  const { method } = req;

  if (method === 'PUT') {
    try {
      await connectToDatabase();

      const { phoneNumber, attended, orderConfirmed } = req.body;

      // Update customer by phone number
      const updatedCustomer = await CustomerList.updateOne(
        { "customers.phoneNumber": phoneNumber },  // Find by phoneNumber
        {
          $set: {
            "customers.$.attended": attended,
            "customers.$.orderConfirmed": orderConfirmed
          }
        }
      );

      if (updatedCustomer.modifiedCount > 0) {
        return res.status(200).json({ message: 'Customer updated successfully' });
      } else {
        return res.status(404).json({ message: 'Customer not found or no changes made' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
