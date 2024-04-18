import z from 'zod';

export const signupBody = z.object({
  fname: z.string(),
  lname: z.string(),
  email: z.string().email(),
  password: z.string(),
  address: z.string(),
});

export const signinBody = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});
export const donationBody = z.object({
  name: z.string(),
  dose: z.string(),
  quantity: z.number(),
  mfgDate: z.date(),
  expdate: z.date(),
});

export const medIdType = z.string();
