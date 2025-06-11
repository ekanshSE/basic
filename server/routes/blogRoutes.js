import express from 'express';
import { createProject, getAllProjects, getProject, updateProject, deleteProject } from '../controllers/blogController.js';

const router = express.Router();

router.post('/blog/create', createProject);
router.get('/blog/all', getAllProjects);
router.get('/blog/:id', getProject);
router.put('/blog/edit/:id', updateProject);
router.delete('/blog/delete/:id', deleteProject);

export default router;
