// src/app/api/users/route.js
import { User } from "@/app/lib/models";
import { connectToDatabase } from "@/app/lib/util";



// Named export for the GET method (for fetching users)
export async function GET(req) {
  try {
    await connectToDatabase();
    const users = await User.find({}); // Fetch all users
    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
    try {
      // Get the email from the query string using URL constructor
      const url = new URL(req.url);
      const email = url.searchParams.get('email');
  
      if (!email) {
        return new Response(
          JSON.stringify({ message: "User email is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      await connectToDatabase();
  
      // Find and delete the user by email
      const deletedUser = await User.findOneAndDelete({ email });
  
      if (!deletedUser) {
        return new Response(
          JSON.stringify({ message: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      return new Response(
        JSON.stringify({ message: "User deleted successfully", user: deletedUser }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response(
        JSON.stringify({ message: "Failed to delete user" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } 