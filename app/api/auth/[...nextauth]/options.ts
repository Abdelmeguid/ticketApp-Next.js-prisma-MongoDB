// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "@/prisma/db";
// import bcrypt from "bcryptjs";

// const options: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       //below line the password is not related to password of the user it distingush the credential provider that it use password 
//       // not google authentication or facebook authentication CGPT 
//       id: "password",
//       name: "Username and Password",
//       credentials: {
//         username: {
//           label: "Username",
//           type: "text",
//           placeholder: "Username...",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         const user = await prisma.user.findUnique({
//           where: { username: credentials!.username },
//         });

//         if (!user) {
//           return null;
//         }

//         const match = await bcrypt.compare(
//           credentials!.password,
//           user.password
//         );

//         if (match) {
//           return user;
//         }

//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     //account is in middel between user data in DB and token CGPT
//     //account represent data which i intered and accepted by DB (i think this )
//     //user: Contains information about the authenticated user, typically retrieved from the database. CGPT
//     async jwt({ token, account, user }) {
//       //If account is present (meaning the user has just logged in) CGPT
//       if (account) {
//         token.role = user.role;
//       }
//       return token;
//     },
//     session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role || "USER";
//       }
//       return session;
//     },
//   },
// };

// export default options;

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "password",
      name: "Username and Password",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username..." },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { username: credentials!.username },
        });

        if (!user) {
          return null;
        }

        const match = await bcrypt.compare(credentials!.password, user.password);

        if (match) {
          // Return the user with `id` as a string
          return {
            id: String(user.id),  // Ensure `id` is a string
            name: user.name,
            username: user.username,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.role = user.role || "USER";  // Ensure `role` exists or defaults to "USER"
        token.id = String(user.id);  // Ensure `id` is a string
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === 'string' ? token.role : "USER";  // Ensure `role` is a string
        session.user.id = String(token.id);  // Ensure `id` is a string
      }
      return session;
    },
  },
};

export default options;
