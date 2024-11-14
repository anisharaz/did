import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.registrar.create({
    data: {
      name: "Registrar 1",
      email: "test@gmail.com",
      password: "test@123",
      address: "Address 1",
      phone: "1234567890",
      pub_key: "EBttrpZzjfGwRz39F6NRxWmcWP2FJi7KyfzwozJdPida",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
