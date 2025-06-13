import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRoutes from "./routes";
import { PrismaClient } from "./generated/prisma";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app: Express = express();

app.use(express.json());

app.use("/api", rootRoutes);
app.use(errorMiddleware);

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          state: true,
          pincode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo} - ${addr.city}, ${addr.state}-${addr.pincode}`;
        },
      },
    },
  },
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
