// import React from "react";
// import prisma from "@/prisma/db";
// import DashRecentTickets from "@/components/DashRecentTickets";
// import DashChart from "@/components/DashChart";

// const Dashboard = async () => {
//   const tickets = await prisma.ticket.findMany({
//     where: {
//       NOT: [{ status: "CLOSED" }],
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//     skip: 0,
//     take: 5,
//     include: {
//       assignedToUser: true,
//     },
//   });

//   const groupTicket = await prisma.ticket.groupBy({
//     by: ["status"],
//     _count: {
//       id: true,
//     },
//   });

//   const data = groupTicket.map((item) => {
//     return {
//       name: item.status,
//       total: item._count.id,
//     };
//   });

//   return (
//     <div>
//       <div className="grid gap-4 md:grid-cols-2 px-2 ">
//         <div>
//           <DashRecentTickets tickets={tickets} />
//         </div>
//         <div>
//           <DashChart data={data} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React from "react";
import prisma from "@/prisma/db";
import DashRecentTickets from "@/components/DashRecentTickets";
import DashChart from "@/components/DashChart";

const Dashboard = async () => {
  // Fetch recent tickets, default to an empty array if no tickets found
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: [{ status: "CLOSED" }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: 0,
    take: 5,
    include: {
      assignedToUser: true,
    },
  }) || [];  // Default to empty array if no results

  // Fetch ticket status grouping, default to an empty array if no tickets found
  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  }) || [];  // Default to empty array if no results

  // Prepare data for the chart, fallback to empty array if no data
  const data = groupTicket.length > 0 ? groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  }) : [];  // Default to empty array if no status groups found

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 px-2">
        {/* Display recent tickets */}
        <div>
          {tickets.length > 0 ? (
            <DashRecentTickets tickets={tickets} />
          ) : (
            <p>No recent tickets found.</p>
          )}
        </div>
        
        {/* Display chart */}
        <div>
          {data.length > 0 ? (
            <DashChart data={data} />
          ) : (
            <p>No ticket data available for the chart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

