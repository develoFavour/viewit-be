import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'viewit/images';
    let resource_type = 'image';

    if (file.originalname.endsWith('.glb')) {
      folder = 'viewit/models';
      resource_type = 'raw'; // GLB files should be uploaded as raw/auto
    }

    return {
      folder: folder,
      resource_type: resource_type,
      public_id: `${Date.now()}-${file.originalname}`
    };
  },
});

const upload = multer({ storage: storage });

export default upload;
