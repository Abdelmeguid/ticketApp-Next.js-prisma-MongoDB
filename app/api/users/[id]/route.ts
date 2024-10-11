import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // Use `params.id` directly, assuming it is already a string
  const user = await prisma.user.findUnique({
    where: { id: params.id }, // No need to parse to int, use it as a string
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found" }, { status: 404 });
  }

  if (body?.password && body.password !== "") {
    const hashPassword = await bcrypt.hash(body.password, 10);
    body.password = hashPassword;
  } else {
    delete body.password;
  }

  if (user.username !== body.username) {
    const duplicateUsername = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (duplicateUsername) {
      return NextResponse.json(
        { message: "Duplicate Username" },
        { status: 409 }
      );
    }
  }

  const updateUser = await prisma.user.update({
    where: { id: user.id }, // Assuming `user.id` is a string
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateUser);
}
