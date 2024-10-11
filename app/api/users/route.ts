// Import necessary modules and libraries
import { userSchema } from "@/ValidationSchemas/users"; // User validation schema
import { NextRequest, NextResponse } from "next/server"; // Next.js request and response types
import prisma from "@/prisma/db"; // Prisma client instance
import bcrypt from "bcryptjs"; // Library for hashing passwords
import { getServerSession } from "next-auth"; // NextAuth session management
import options from "../auth/[...nextauth]/options"; // NextAuth options for session

// POST request handler for creating a new user
export async function POST(request: NextRequest) {
  // Get the session to verify if the user is authenticated
  const session = await getServerSession(options);

  // Check if the session exists (user is authenticated)
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if the authenticated user has ADMIN role
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Admin." }, { status: 401 });
  }

  // Parse the request body to get user data
  const body = await request.json();
  console.log(body); // Log the body for debugging
  const validation = userSchema.safeParse(body); // Validate the input against the schema

  // Return validation errors if any
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // Check for duplicate username
  const duplicateUsername = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  // If a duplicate username exists, return an error
  if (duplicateUsername) {
    return NextResponse.json(
      { message: "Duplicate Username" },
      { status: 409 }
    );
  }

  // Check for duplicate email if provided
  if (body.email) {
    const duplicateEmail = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // If a duplicate email exists, return an error
    if (duplicateEmail) {
      return NextResponse.json(
        { message: "Duplicate Email" },
        { status: 409 }
      );
    }
  }

  // Hash the user's password before storing it in the database
  const hashPassword = await bcrypt.hash(body.password, 10);
  body.password = hashPassword; // Assign the hashed password back to the body

  try {
    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        name: body.name,
        password: body.password,
        role: body.role, // Include other fields as necessary
        email: body.email, // Optional email field
      },
    });

    // Return the newly created user
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    // Handle unique constraint violations (e.g., duplicate username)
    if (error.code === 'P2002') {
      console.error("Username already exists");
      return NextResponse.json({ message: "Username already exists" }, { status: 409 });
    } else {
      // Handle any unexpected errors
      console.error("An unexpected error occurred:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }
}
