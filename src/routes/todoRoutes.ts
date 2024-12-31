import {Router } from 'express';
import { top,createTodo, updateTodo, deleteTodo } from '../controllers/todoController';

const router = Router();

router.get('/',top);
router.get('/createTask',(req,res) => res.render('createTask'));

router.post('/create',createTodo);
router.post('/update/:id',updateTodo)
router.post('/delete/:id', deleteTodo);

export default router;
