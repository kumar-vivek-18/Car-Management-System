import express from 'express';
import { addCar, deleteCar, getAllCars, getMyCars, updateCarDetails } from '../controllers/carController.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.route('/add-car').post(protectRoute, upload, addCar);
router.route('/all-cars').get(protectRoute, getAllCars);
router.route('/my-cars').get(protectRoute, getMyCars);
router.route('/update-car').patch(protectRoute, updateCarDetails);
router.route('/delete-car').delete(protectRoute, deleteCar);

export default router;