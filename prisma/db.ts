import { PrismaClient } from "@prisma/client";

// Declare the global variable for Prisma client
declare global {
  var prisma: PrismaClient | undefined; // Specify the type of the global variable
}

// Initialize the Prisma Client
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(); // Initialize Prisma only once
  }
  prisma = global.prisma; // Use the global instance
}

export default prisma; // Export the Prisma client instance
