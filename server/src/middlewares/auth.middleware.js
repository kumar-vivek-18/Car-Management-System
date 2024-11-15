import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';



export const protectRoute = async (req, res, next) => {
    try {


        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("token", token);
        if (!token) return res.status(401).json({ message: "Unauthorized request" });

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // console.log('decodedToken', decodedToken);

        const user = await User.findById(decodedToken?._id).select("_id userName");

        if (!user) return res.status(401).json({ message: "Invalid access Token" });
        // console.log('user', user);
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid request" });
    }
}