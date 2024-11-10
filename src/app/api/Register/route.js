import { connectToDatabase } from "@/app/lib/util";
import { User } from "@/app/lib/models";
export async function POST(req) {
  const { email, password, role, name, number } = await req.json();

  // Validate input
  if (!email || !password || !name || !number) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Check if the user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    // Create the new user
    const newUser = new User({
      email,
      password,
      role,
      name,
      number,
    });

    // Save the user to the database
    await newUser.save();

    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
