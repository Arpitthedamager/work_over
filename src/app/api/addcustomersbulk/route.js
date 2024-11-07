import { CustomerList } from '@/app/lib/models';
import { connectToDatabase } from '@/app/lib/util';

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json(); // Parse incoming request body
    const { email, customers } = body; // email: admin's email, customers: array of customer objects

    if (!email || !Array.isArray(customers) || customers.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid data. Must include email and an array of customers.' }), { status: 400 });
    }

    // Check if a customer list exists for the admin's email
    let customerList = await CustomerList.findOne({ email });

    if (!customerList) {
      // If no list exists, create a new one with the bulk customer data
      customerList = await CustomerList.create({
        email,
        customers, // Add the bulk customers
      });
    } else {
      // Ensure that there are no duplicate phone numbers before adding customers
      const existingPhoneNumbers = customerList.customers.map(cust => cust.phoneNumber);

      const newCustomers = customers.filter(cust => !existingPhoneNumbers.includes(cust.phoneNumber));

      if (newCustomers.length === 0) {
        return new Response(
          JSON.stringify({ error: 'All customers already exist in the list based on phone number.' }),
          { status: 409 }
        );
      }

      // Add the new customers to the list
      customerList.customers.push(...newCustomers);
      await customerList.save();
    }

    return new Response(JSON.stringify({ message: 'Bulk customers added successfully!' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to add bulk customers' }), { status: 500 });
  }
}
