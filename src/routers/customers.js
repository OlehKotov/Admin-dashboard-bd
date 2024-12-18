import { Router } from "express";
import { getCustomerByIdController, getCustomersController } from "../controllers/customers.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getCustomersController));
router.get('/:customerId', ctrlWrapper(getCustomerByIdController));


export default router;
