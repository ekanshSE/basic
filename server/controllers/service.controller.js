import { Service } from "../models/service.model.js";
import { User } from "../models/User.js";
import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js";


export const createService = async (req, res) => {
    try {

        const { heading, short_desc, desc } = req.body;
        const  image  = req.file;
        // const { id } = req.user;

        if (!heading) return res.status(400).json({ success: false, message: 'image required' })
        if (!short_desc) return res.status(400).json({ success: false, message: 'Quick Lines are required' });

        if (!image) return res.status(400).json({ success: false, message: 'Image is requried' });

        // const currentUser = await User.findById(id);
        // if (!currentUser) return res.status(400).json({ success: false, message: 'No user found' })
        // if (currentUser?.role !== 'admin') return res.status(400).json({ success: false, message: 'Only Admin can add.' })

        const optimizedImageBuffer = await sharp(image.buffer)
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const service = await Service.create({
            heading,
            image: cloudResponse.secure_url,
            short_desc,
            // author: id,
            desc
        })

        return res.status(201).json({
            success: true,
            message: `${heading} has been created`,
            service
        })

    } catch (error) {
        console.log(`Error: controller/service_controller/createService: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Maybe image format is not accepted.'
        });
    }
}

export const allService = async (req, res) => {
    try {

        const services = await Service.find()
            .populate('author');
        
        return res.status(200).json({
            success: true,
            services
        })

    } catch (error) {
        console.log(`Error: controller/service_controller/allService: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Maybe image format is not accepted.'
        });
    }
}

export const getService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id).populate('author');
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        return res.status(200).json({ success: true, service });
    } catch (error) {
        console.log(`Error: controller/service_controller/getService: ${error}`);
        return res.status(500).json({ success: false, message: 'Failed to fetch service' });
    }
}

export const editService = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, short_desc, desc } = req.body;
        let updateData = { heading, short_desc, desc };

        // If image is provided (e.g., via multer), handle image update
        if (req.file) {
            const optimizedImageBuffer = await sharp(req.file.buffer)
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            updateData.image = cloudResponse.secure_url;
        }

        const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedService) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        return res.status(200).json({ success: true, message: 'Service updated', service: updatedService });
    } catch (error) {
        console.log(`Error: controller/service_controller/editService: ${error}`);
        return res.status(500).json({ success: false, message: 'Failed to update service' });
    }
}

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        // Extract public_id from the image URL
        const imageUrl = service.image;
        let publicId = null;
        if (imageUrl) {
            // Cloudinary URLs are like: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
            // We need to extract <public_id> (without extension)
            const parts = imageUrl.split('/');
            const fileWithExt = parts[parts.length - 1];
            publicId = fileWithExt.split('.')[0];
            // If your upload folder is set, you may need to prepend the folder name
            if (parts.length > 7) {
                // e.g., .../upload/v1234567890/foldername/filename.jpg
                publicId = parts.slice(7, parts.length - 1).concat(publicId).join('/');
            }
        }
        // Delete from Cloudinary if publicId found
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
        await Service.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Service deleted' });
    } catch (error) {
        console.log(`Error: controller/service_controller/deleteService: ${error}`);
        return res.status(500).json({ success: false, message: 'Failed to delete service' });
    }
}