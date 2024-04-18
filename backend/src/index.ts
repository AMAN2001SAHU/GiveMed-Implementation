import express from 'express';
import cors from 'cors';
import z from 'zod';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import rootRouter from './routes/index';

const app = express();
const JWT_SECRET = 'mysupersecret';

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

const prisma = new PrismaClient();

const signupBody = z.object({
  fname: z.string(),
  lname: z.string(),
  email: z.string().email(),
  password: z.string(),
  address: z.string(),
});

app.use('/api/v1', rootRouter);

app.post('/user/signup', async (req, res) => {
  const body = req.body;
  const parseBody = signupBody.safeParse(body);

  if (!parseBody.success) {
    return res.status(403).json({ error: 'The inputs are invalid' });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return res.status(403).json({ message: 'User already existes' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        fname: body.fname,
        lname: body.lname,
        address: body.address,
      },
    });

    if (newUser) {
      const token = jwt.sign(newUser.id, JWT_SECRET);
      res.cookie('token', token);
      return res.json({ message: 'Signed Up' });
    } else {
      return res.status(404).json({ error: 'some error occured' });
    }
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: 'some error occured' });
  }
});

const signinBody = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

app.post('/user/signin', async (req, res) => {
  const body = req.body;
  const parseBody = signinBody.safeParse(body);

  if (!parseBody.success) {
    return res.status(403).json({ error: 'Invalid Email or Password' });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return res.status(403).json({ message: 'User does not exist' });
  }

  const token = jwt.sign(user.id, JWT_SECRET);
  res.cookie('token', token);
  return res.json({ message: 'Logged in' });
});

// app.use((req, res, next) => {
//   const token = req.cookies.token;
//   if (token) {
//     const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
//     next();
//   } else {
//     return res.status(403).json({
//       error: 'Unauthorized',
//     });
//   }
// });

app.get('/medicine', async (req, res) => {
  const medicineData = await prisma.medicines.findMany();

  return res.json({ medicineData });
});

// const medIdObj = z.string();

app.get('/medicine/:id', async (req, res) => {
  const medId = req.params.id;
  // const parseParams = medIdObj.safeParse(medId);

  // if (!parseParams.success) {
  //   return res.status(403).json({
  //     error: 'Invalid params',
  //   });
  // }

  try {
    const medicineData = await prisma.medicines.findUnique({
      where: {
        id: parseInt(medId),
      },
    });

    return res.json({
      medicineData,
    });
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      error: 'Some error occured while fetching the details',
    });
  }
});

const donationBody = z.object({
  name: z.string(),
  dose: z.string(),
  quantity: z.number(),
  mfgDate: z.date(),
  expdate: z.date(),
});

app.post('/user/donation', async (req, res) => {
  const body = req.body;
  const token = req.cookies.token;

  const { success } = donationBody.safeParse(body);

  if (!success) {
    return res.status(403).json({ error: 'Invalid Inputs' });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  await prisma.donation.create({
    data: {
      name: body.name,
      dose: body.does,
      quantity: body.quantity,
      mfgDate: body.mfgDate,
      expDate: body.expDate,
      donator: decoded.id,
    },
  });

  return res.json({
    message: 'Donation created successfully',
  });
});

app.post('/user/donation/:id', async (req, res) => {
  try {
    const donationId = req.params.id;

    const donation = await prisma.donation.findUnique({
      where: {
        id: parseInt(donationId),
      },
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const medicines = await prisma.medicines.findMany({
      where: {
        name: {
          contains: donation.name,
        },
      },
    });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json({ medicines });
  } catch (e) {
    console.error('Error: ', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log(`server started at port 3000`);
});
