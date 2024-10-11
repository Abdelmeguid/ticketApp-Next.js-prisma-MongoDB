// import NextAuth, { DefaultSession } from "next-auth/next";
// import { JWT } from "next-auth/jwt";
// import { Role } from "@prisma/client";

// declare module "next-auth" {
//   //Session with capital letter because it intrface or type which related to TS
//   interface Session {
//     user: {
//       username: string;
//       role: string;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     id: number;
//     name: string;
//     username: string;
//     role: Role;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     role?: string;
//   }
// }



// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;  // Make sure the `id` is a string
    role: string;
  }

  interface Session {
    user: {
      id: string;  // Make sure the session has `id` as a string
      role: string;
    };
  }

  interface JWT {
    id: string;  // JWT token also holds `id` as a string
    role: string;
  }
}
