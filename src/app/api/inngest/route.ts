// // app/api/inngest/route.ts
// import { serve } from "inngest/next";
// import { inngest } from "../../../lib/inngest"; // klijent koji kreiraš
// import { userCreatedFunction } from "../../../inngest/functions/userCreated"; // primjer

// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   functions: [
//     userCreatedFunction, // ovdje dodaješ sve svoje funkcije
//   ],
// });