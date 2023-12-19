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

function AlbumForm({ onSubmit, editAlbumData, onClose }) {
  const [albumName, setAlbumName] = useState(
    editAlbumData ? editAlbumData.name : ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const albumsCollection = collection(db, "albums");

      if (editAlbumData) {
        // If editAlbumData is provided, update the existing album
        const albumDoc = doc(albumsCollection, editAlbumData.id);
        await updateDoc(albumDoc, {
          name: albumName,
        });
      } else {
        // Otherwise, add a new album
        await addDoc(albumsCollection, {
          name: albumName,
          images: {
            name: "",
            url: "",
          },
          timestamp: serverTimestamp(),
        });
      }

      // Clear the input field
      setAlbumName("");

      // Call the onSubmit callback to notify the parent component
      onSubmit();
    } catch (error) {
      console.error("Error adding/updating album to Firestore:", error.message);
    }
  };

  const handleClear = () => {
    setAlbumName("");
  };

  return (
    <>
      <div className="container albumform">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>{editAlbumData ? "Edit Album" : "Create an Album"}</h5>
          <button type="button" className="btn " onClick={onClose}>
          <i class="fa-solid fa-circle-xmark fa-2x"></i>
          </button>
        </div>
        <form>
          <div className="mb-3">
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
              {editAlbumData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AlbumForm;
