// ImageForm.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseInit";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

function ImageForm({ onSubmit, albumId, editImageData, onClose }) {
  const [imageName, setImageName] = useState(
    editImageData ? editImageData.name : ""
  );
  const [imageUrl, setImageUrl] = useState(
    editImageData ? editImageData.url : ""
  );

  useEffect(() => {
    async function fetchAlbum() {
      const docRef = doc(db, "albums", albumId.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Album Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    }

    fetchAlbum();
  }, [albumId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const imagesCollection = collection(db, "images");

      if (editImageData) {
        const imageDoc = doc(imagesCollection, editImageData.id);
        await updateDoc(imageDoc, {
          name: imageName,
          url: imageUrl,
        });
      } else {
        const newImageRef = await addDoc(imagesCollection, {
          name: imageName,
          url: imageUrl,
          timestamp: serverTimestamp(),
          albumId: albumId,
        });

        // After adding a new image, update the album document with the new image
        const albumDocRef = doc(db, "albums", albumId.toString());
        await updateDoc(albumDocRef, {
          images: arrayUnion({ name: imageName, url: imageUrl }),
        });

        console.log("New image added with ID: ", newImageRef.id);
      }

      // Clear the input fields
      setImageName("");
      setImageUrl("");

      // Call the onSubmit callback to notify the parent component
      onSubmit();
    } catch (error) {
      console.error("Error adding/updating image to Firestore:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (editImageData) {
        const imageDoc = doc(db, "images", editImageData.id);
        await deleteDoc(imageDoc);

        // After deleting the image, update the album document by removing the image reference
        const albumDocRef = doc(db, "albums", albumId.toString());
        await updateDoc(albumDocRef, {
          images: arrayRemove({
            name: editImageData.name,
            url: editImageData.url,
          }),
        });

        // Call the onSubmit callback to notify the parent component
        onSubmit();
      }
    } catch (error) {
      console.error("Error deleting image from Firestore:", error.message);
    }
  };

  const handleClear = () => {
    setImageName("");
    setImageUrl("");
  };

  return (
    <>
      <div className="container imageform">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>{editImageData ? "Edit Image" : "Add an Image"}</h5>
          <button type="button" className="btn " onClick={onClose}>
            <i className="fa-solid fa-circle-xmark fa-2x"></i>
          </button>
        </div>
        <form>
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
            {editImageData && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default ImageForm;
