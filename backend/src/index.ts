import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rootRouter from './routes/index';

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

app.use('/api/v1', rootRouter);

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

app.listen(3000, () => {
  console.log(`server started at port 3000`);
});
