import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists, please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        const accessToken = newUser.generateAccessToken();
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        return res.status(201).cookie("accessToken", accessToken, options).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: "Error occurred while creating user", error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // console.log(user, isPasswordValid);
        const accessToken = user.generateAccessToken();
        const { password: _, ...userWithoutPassword } = user.toObject();
        // console.log(userWithoutPassword, accessToken);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        return res.status(200).cookie("accessToken", accessToken, options).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
