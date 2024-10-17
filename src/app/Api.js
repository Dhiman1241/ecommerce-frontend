import moment from "moment";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { projectStorage } from "../../firebaseconfig";

const Api = {
  async uploadImage(file) {
    let response = null;
    const filePath = `uploads/${moment().valueOf()}/${file.name}`;
    const storageRef = ref(projectStorage, filePath); // Use `ref` from firebase/storage

    try {
      const uploadTask = await uploadBytes(storageRef, file); // Use `uploadBytes` for uploading
      const url = await getDownloadURL(storageRef); // Get the download URL after the upload
      response = {
        status: 200,
        url: url,
      };
      console.log("File URL: ", url);
    } catch (err) {
      console.error("Upload Error: ", err);
      response = {
        status: 500,
        error: err.message,
      };
    }

    return response;
  },

  async deleteImage(imageUrl) {
    let response = null;
  
    try {
      // Create a reference to the file to delete based on the URL
      const storageRef = ref(projectStorage, imageUrl);
  
      // Delete the file
      await deleteObject(storageRef);
  
      response = {
        status: 200,
        message: "Image deleted successfully",
      };
      console.log("Image deleted successfully");
    } catch (err) {
      console.error("Delete Error: ", err);
      response = {
        status: 500,
        error: err.message,
      };
    }
  
    return response;
  }
};

export default Api;
