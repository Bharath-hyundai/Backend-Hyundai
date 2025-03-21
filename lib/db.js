import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

if (typeof globalThis.prismaGlobal === 'undefined') {
  globalThis.prismaGlobal = prismaClientSingleton();
}

const db = globalThis.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}

export { db };
