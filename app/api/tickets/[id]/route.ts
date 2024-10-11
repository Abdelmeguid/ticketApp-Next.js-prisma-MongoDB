// import { ticketPatchSchema } from "@/ValidationSchemas/ticket";
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/prisma/db";

// interface Props {
//   params: { id: string };
// }

// export async function PATCH(request: NextRequest, { params }: Props) {
//   const body = await request.json();

//   const validation = ticketPatchSchema.safeParse(body);

//   if (!validation.success) {
//     return NextResponse.json(validation.error.format(), { status: 400 });
//   }

//   const ticket = await prisma.ticket.findUnique({
//     where: { id: parseInt(params.id) },
//   });

//   if (!ticket) {
//     return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
//   }

//   if (body?.assignedToUserId) {
//     body.assignedToUserId = parseInt(body.assignedToUserId);
//   }

//   const updateTicket = await prisma.ticket.update({
//     where: { id: ticket.id },
//     data: {
//       ...body,
//     },
//   });

//   return NextResponse.json(updateTicket);
// }

// export async function DELETE(request: NextRequest, { params }: Props) {
//   const ticket = await prisma.ticket.findUnique({
//     where: { id: parseInt(params.id) },
//   });

//   if (!ticket) {
//     return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
//   }

//   await prisma.ticket.delete({
//     where: { id: ticket.id },
//   });

//   return NextResponse.json({ message: "Ticket Deleted" });
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { ticketPatchSchema } from "@/ValidationSchemas/ticket";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

interface Props {
  params: { id: string }; // ObjectId is a string
}



export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();

  const validation = ticketPatchSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // Find the ticket by string-based MongoDB ObjectId
  
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id }, // id is a string (MongoDB ObjectId)
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
  }

  // Ensure assignedToUserId is treated as a string (if present)
  if (body?.assignedToUserId) {
    body.assignedToUserId = body.assignedToUserId.toString();
  }

  // Update the ticket with the new data
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updatedTicket);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // Find the ticket by string-based MongoDB ObjectId
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
  }

  // Delete the ticket
  await prisma.ticket.delete({
    where: { id: ticket.id },
  });

  return NextResponse.json({ message: "Ticket Deleted" });
}
