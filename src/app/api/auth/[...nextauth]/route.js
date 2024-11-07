import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Add your other providers here if necessary

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Here you can fetch your user data from a database or other source
        const user = { id: 1, name: 'Admin User', role: 'admin' }; // Example user data

        if (user && credentials.username === 'admin' && credentials.password === 'password') {
          return user;
        }

        // If the login is invalid, return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.role = user.role; // Add role to session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add role to token
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
