import { Project } from '../models/blog.js';

export const createProject = async (req, res) => {
    try {
        const { title, location, description, type, services, plotArea, builtUpArea, completedYear } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        const project = await Project.create({
            title,
            location,
            description,
            type,
            services,
            plotArea,
            builtUpArea,
            completedYear
        });
        return res.status(201).json({ success: true, message: 'Project created', project });
    } catch (error) {
        console.log('Error: controller/blogController/createProject:', error);
        return res.status(500).json({ success: false, message: 'Failed to create project' });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        return res.status(200).json({ success: true, projects });
    } catch (error) {
        console.log('Error: controller/blogController/getAllProjects:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
};

export const getProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        return res.status(200).json({ success: true, project });
    } catch (error) {
        console.log('Error: controller/blogController/getProject:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch project' });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
        return res.status(200).json({ success: true, message: 'Project updated', project: updated });
    } catch (error) {
        console.log('Error: controller/blogController/updateProject:', error);
        return res.status(500).json({ success: false, message: 'Failed to update project' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Project.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
        return res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (error) {
        console.log('Error: controller/blogController/deleteProject:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
};
