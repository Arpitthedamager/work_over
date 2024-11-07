import { CustomerList } from '@/app/lib/models';
import { connectToDatabase } from '@/app/lib/util';

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json(); // Parse the incoming request body
    const { email, name, phoneNumber, instagramId } = body;

    // Validate required fields
    if (!email || !name || !phoneNumber || !instagramId) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    // Check if a customer list exists for the admin's email
    let customerList = await CustomerList.findOne({ email });

    if (!customerList) {
      // If no list exists, create a new one with the first customer
      customerList = await CustomerList.create({
        email,
        customers: [{ name, phoneNumber, instagramId }],
      });
    } else {
      // Check if the customer with the same phone number already exists
      const isDuplicate = customerList.customers.some(
        (customer) => customer.phoneNumber === phoneNumber
      );

      if (isDuplicate) {
        return new Response(
          JSON.stringify({ error: 'Customer with this phone number already exists.' }),
          { status: 409 } // Conflict status code
        );
      }

      // If not a duplicate, add the new customer to the array
      customerList.customers.push({ name, phoneNumber, instagramId });
      await customerList.save();
    }

    return new Response(JSON.stringify({ message: 'Customer added successfully!' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to add customer' }), { status: 500 });
  }
}
