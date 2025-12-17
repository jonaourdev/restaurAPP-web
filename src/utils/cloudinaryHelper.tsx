import axios from "axios";

// Reemplaza con tus credenciales reales si cambian
const CLOUD_NAME = "dtprjmqch"; 
const UPLOAD_PRESET = "restaurapp_uploads";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  created_at: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post<CloudinaryResponse>(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error subiendo a Cloudinary", error);
    throw new Error("Error al subir imagen");
  }
};