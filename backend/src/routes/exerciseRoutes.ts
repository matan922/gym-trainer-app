import express from 'express';
import { deleteExercise, getExercise, getExercises, postExercise, putExercise } from '../controller/exerciseController';


const router = express.Router({ mergeParams: true });

router.get('/', getExercises)
router.get('/:exerciseId', getExercise)
router.post('/', postExercise)
router.put('/:exerciseId', putExercise)
router.delete('/:exerciseId', deleteExercise)

export default router;