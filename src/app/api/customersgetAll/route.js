// /pages/api/customers/getAll.js
import { connectToDatabase } from "@/app/lib/util";
import { CustomerList } from "@/app/lib/models";


// Define the GET method explicitly
export async function GET(req) {
    try {
      // Connect to the database
      await connectToDatabase();
  
      // Find all CustomerList documents and return only the customers array
      const allCustomerLists = await CustomerList.find({}, { customers: 1 });
  
      // Reduce all customer arrays into one
      const allCustomers = allCustomerLists.reduce((acc, customerList) => {
        return acc.concat(customerList.customers);
      }, []);
  
      // Return the aggregated customer list as the response
      return new Response(JSON.stringify(allCustomers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Error fetching customers', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }