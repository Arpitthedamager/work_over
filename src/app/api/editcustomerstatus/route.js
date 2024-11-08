// /app/api/editcustomerstatus/route.js
import { connectToDatabase } from '@/app/lib/util';
import { CustomerList } from '@/app/lib/models';

export async function PUT(req) {
  try {
    // Log the request method for debugging
    console.log('Received PUT request');

    // Connect to the database
    await connectToDatabase();

    // Get the request body
    const { phoneNumber, attended, orderConfirmed } = await req.json();

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

    // Return response based on whether the customer was updated or not
    if (updatedCustomer.modifiedCount > 0) {
      return new Response(JSON.stringify({ message: 'Customer updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ message: 'Customer not found or no changes made' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    // Catch errors and return a server error response
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
