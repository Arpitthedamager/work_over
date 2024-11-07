import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/app/lib/models';
import bcrypt from 'bcryptjs'; // For comparing the hashed passwords
import { connectToDatabase } from '@/app/lib/util';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Credentials received:', credentials);
        connectToDatabase();

        // Find user by email (username)
        const user = await User.findOne({ email: credentials.username });

        if (user) {
          // Compare the entered password with the stored hashed password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordValid) {
            console.log('User authorized:', user);
            return { id: user._id, name: user.email, role: user.role }; // Return user data with role
          } else {
            console.log('Invalid password');
            return null; // Return null if password doesn't match
          }
        } else {
          console.log('User not found');
          return null; // Return null if user is not found
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        console.log('Session updated with role:', session.user.role);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        console.log('JWT updated with role:', token.role);
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
