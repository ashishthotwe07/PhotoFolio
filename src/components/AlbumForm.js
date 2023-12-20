// AlbumForm.js
import React, { useState } from "react";
import { db } from "../firebaseInit";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

// AlbumForm component handles the creation and editing of albums
function AlbumForm({ onSubmit, editAlbumData, onClose }) {
  // State to manage the album name input
  const [albumName, setAlbumName] = useState(
    editAlbumData ? editAlbumData.name : ""
  );

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Reference to the 'albums' collection in Firestore
      const albumsCollection = collection(db, "albums");

      // Display an alert if the album name is empty
      if (!albumName.trim()) {
        alert("Please enter a name for the album");
        return;
      }

      if (editAlbumData) {
        // If editing an existing album, update the Firestore document
        const albumDoc = doc(albumsCollection, editAlbumData.id);
        await updateDoc(albumDoc, {
          name: albumName,
        });
      } else {
        // If creating a new album, add a new document to Firestore
        await addDoc(albumsCollection, {
          name: albumName,
          images: {
            name: "",
            url: "",
          },
          timestamp: serverTimestamp(),
        });
      }

      // Clear the input field after submission
      setAlbumName("");

      // Notify the parent component that the form has been submitted
      onSubmit();
    } catch (error) {
      console.error("Error adding/updating album to Firestore:", error.message);
    }
  };

  // Clear the album name input
  const handleClear = () => {
    setAlbumName("");
  };

  return (
    <>
      {/* Album form container */}
      <div className="container albumform">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Form header based on whether it's an edit or create operation */}
          <h5>{editAlbumData ? "Edit Album" : "Create an Album"}</h5>
          {/* Close button */}
          <button type="button" className="btn " onClick={onClose}>
            <i className="fa-solid fa-circle-xmark fa-2x"></i>
          </button>
        </div>
        {/* Album form */}
        <form>
          <div className="mb-3">
            {/* Album name input field */}
            <input
              type="text"
              className="form-control"
              id="albumName"
              placeholder="Enter album name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            {/* Clear and submit buttons */}
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {/* Button label based on whether it's an edit or create operation */}
              {editAlbumData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AlbumForm;
