// // /pages/api/auth/[...nextauth].js
// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: { label: 'Username', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       authorize(credentials) {
//         const adminUser = { id: 1, name: 'admin', email: 'admin@example.com', role: 'admin' };
//         const normalUser = { id: 2, name: 'user', email: 'user@example.com', role: 'user' };

//         if (credentials.username === 'admin' && credentials.password === 'password') {
//           return adminUser;  // Admin user
//         } else if (credentials.username === 'user' && credentials.password === 'password') {
//           return normalUser;  // Normal user
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/auth/signin',
//   },
//   callbacks: {
//     async session({ session, token, user }) {
//       if (token) {
//         session.user.role = token.role;  // Add role to session
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;  // Add role to token
//       }
//       return token;
//     },
//   },
// });
