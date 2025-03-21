import { db } from '@/lib/db';

export const getLeads = async () => {
  try {
    const data = await db.interest.findMany();
    return data;
  } catch (error) {
    console.log(error);
  }
};
