import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/db/db.js';
import colors from 'colors';
import userRoutes from './src/routes/userRoutes.js';
import carRoutes from './src/routes/carRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config({ path: '.env' });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
}))
app.get('/', (req, res) => {
    return res.send("Welcome to Spyne.ai");
})

app.use('/uploads', express.static('uploads'));

app.use('/apis/user', userRoutes);
app.use('/apis/car', carRoutes);
// app.use('/apis/docs', swaggerUiSetup.serve, swaggerUiSetup.setup(swaggerDocs));
connectDB()
    .then(() => {
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        })
    })
    .catch((error) => {
        console.error("Error occured while starting server");
    })
