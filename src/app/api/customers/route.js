// src/app/api/customers/route.js
import { CustomerList } from "@/app/lib/models";
import { connectToDatabase } from "@/app/lib/util";

export async function GET(req) {
  await connectToDatabase();

  try {
    // Extract the logged-in admin's email from the session
    const email = req.headers.get("x-admin-email");

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Admin email is required" }),
        { status: 400 }
      );
    }

    // Fetch the customer's list for the specific admin using email
    const customerList = await CustomerList.findOne({ email });

    if (!customerList) {
      return new Response(
        JSON.stringify({ error: "No customer list found for this admin" }),
        { status: 404 }
      );
    }

    // Return the customers array for the admin
    return new Response(JSON.stringify(customerList.customers), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch customer data" }),
      { status: 500 }
    );
  }
}
