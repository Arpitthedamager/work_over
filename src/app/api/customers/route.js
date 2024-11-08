// src/app/api/customers/route.js
import { CustomerList } from "@/app/lib/models";
import { connectToDatabase } from "@/app/lib/util";

export async function GET(req) {
  await connectToDatabase();

  try {
    const email = req.headers.get("x-admin-email");

    if (!email) {
      return new Response(JSON.stringify({ error: "Admin email is required" }), { status: 400 });
    }

    const customerList = await CustomerList.findOne({ email });

    if (!customerList) {
      return new Response(JSON.stringify({ error: "No customer list found for this admin" }), { status: 404 });
    }

    return new Response(JSON.stringify(customerList.customers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch customer data" }), { status: 500 });
  }
}

// DELETE method to delete a customer
export async function DELETE(req) {
  await connectToDatabase();

  try {
    const email = req.headers.get("x-admin-email");
    const { customerId } = await req.json(); // Parse customer ID from the request body

    if (!email) {
      return new Response(JSON.stringify({ error: "Admin email is required" }), { status: 400 });
    }

    // Find and update the customer list by removing the specified customer
    const customerList = await CustomerList.findOneAndUpdate(
      { email },
      { $pull: { customers: { _id: customerId } } }, // Remove customer by ID
      { new: true }
    );

    if (!customerList) {
      return new Response(JSON.stringify({ error: "No customer list found for this admin" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Customer deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete customer" }), { status: 500 });
  }
}
