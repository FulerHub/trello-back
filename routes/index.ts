import express, {Router} from 'express';
import cards from "./cards";

const router:Router = express.Router();

router.use('/cards', cards);

export default router;