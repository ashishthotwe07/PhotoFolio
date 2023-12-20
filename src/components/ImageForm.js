// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { db } from "../firebaseInit";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  getDoc,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

// ImageForm component for adding/editing images
function ImageForm({ onSubmit, albumId, editImageData, onClose }) {
  // State variables for image name and URL
  const [imageName, setImageName] = useState(
    editImageData ? editImageData.name : ""
  );
  const [imageUrl, setImageUrl] = useState(
    editImageData ? editImageData.url : ""
  );

  // Fetch the album data when the component mounts
  useEffect(() => {
    // Asynchronous function to fetch album data
    async function fetchAlbum() {
      const docRef = doc(db, "albums", albumId.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // You can perform any additional logic based on the album data
      } else {
        console.log("No such document!");
      }
    }

    // Call the asynchronous function
    fetchAlbum();
  }, [albumId]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const imagesCollection = collection(db, "images");

      // Validate input fields
      if (!imageName.trim() || !imageUrl.trim()) {
        // Display an alert if either field is empty
        alert("Please enter both image name and URL");
        return;
      }

      if (editImageData) {
        // If editImageData is present, update the existing image
        const imageDoc = doc(imagesCollection, editImageData.id);
        await updateDoc(imageDoc, {
          name: imageName,
          url: imageUrl,
        });
      } else {
        // If editImageData is not present, add a new image
        const newImageRef = await addDoc(imagesCollection, {
          name: imageName,
          url: imageUrl,
          timestamp: serverTimestamp(),
          albumId: albumId,
        });

        // Update the album document with the new image reference
        const albumDocRef = doc(db, "albums", albumId.toString());
        await updateDoc(albumDocRef, {
          images: arrayUnion({
            name: imageName,
            url: imageUrl,
            id: newImageRef.id,
          }),
        });
      }

      // Clear the input fields after submission
      setImageName("");
      setImageUrl("");

      // Trigger the onSubmit callback
      onSubmit();
    } catch (error) {
      console.error("Error adding/updating image to Firestore:", error.message);
    }
  };

  // Handle clearing the input fields without submitting the form
  const handleClear = () => {
    setImageName("");
    setImageUrl("");
  };

  // JSX structure for rendering the component
  return (
    <>
      {/* Container for the image form */}
      <div className="container imageform">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Heading based on whether it's an edit or add operation */}
          <h5>{editImageData ? "Edit Image" : "Add an Image"}</h5>
          {/* Close button */}
          <button type="button" className="btn " onClick={onClose}>
            <i className="fa-solid fa-circle-xmark fa-2x"></i>
          </button>
        </div>
        {/* Form for image input */}
        <form>
          {/* Input for image name */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="imageName"
              placeholder="Enter image name"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
            />
          </div>

          {/* Input for image URL */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="imageUrl"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {/* Buttons for clearing and submitting the form */}
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={handleSubmit}
            >
              {editImageData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// Export the ImageForm component
export default ImageForm;
