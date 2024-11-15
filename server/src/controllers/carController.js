import { Car } from "../models/car.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";


export const addCar = async (req, res) => {
    try {
        const { owner, carName, carDescription, carType, carPrice } = req.body;

        if (!owner || !carName || !carDescription || !carType || !carPrice) return res.status(400).json({ message: "Please complete the fields" });
        let carImages = [];

        console.log('hiii');

        if (req.files) {
            if (req.files?.carImages && req.files?.carImages.length > 0) {
                carImages = await Promise.all(req.files.carImages.map(async (file) => {
                    if (file.fieldname === "carImages") {
                        return await uploadFileToCloudinary(file.path);
                    }
                }));
            }
        }


        const addCar = await Car.create({
            owner,
            carName,
            carDescription,
            carType,
            carPrice,
            carImages
        });

        if (!addCar) return res.status(500).json({ message: "Error occured while creating property" });


        return res.status(200).json(addCar);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const getAllCars = async (req, res) => {

    try {
        const cars = await Car.find().lean();

        if (!cars) return res.status(404).json({ message: "No properties found" });

        return res.status(200).json(cars);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}


export const getMyCars = async (req, res) => {
    try {
        const { owner } = req.query;
        if (!owner) return res.status(400).json({ message: "Owner ID required" });

        const cars = await Car.find({ owner }).lean();

        if (!cars) return res.status(404).json({ message: "No properties found" });

        return res.status(200).json(cars);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}

export const updateCarDetails = async (req, res) => {

    try {
        const { carId, details } = req.body;

        console.log(carId, details);

        if (!carId || !details) return res.status(400).json({ message: "Please fill all the fields" });

        const updatedCar = await Car.findByIdAndUpdate({ _id: carId }, details, { new: true }).lean();

        if (!updatedCar) return res.status(500).json({ message: "Error occured while updating property status" });

        return res.status(200).json({ message: "Car details updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const deleteCar = async (req, res) => {
    try {
        const { carId } = req.body;

        if (!carId) return res.status(400).json({ message: "Please provide required fields" });

        const carToBeDeleted = await Car.findById(carId);
        console.log('reqqq', req.user);
        if (!carToBeDeleted) return res.status(404).json({ message: "Car not found" });

        if (carToBeDeleted.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Invalid user access" });

        const deletedCar = await Car.deleteOne({ _id: carId });

        return res.status(200).json({ message: "Car delelted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
