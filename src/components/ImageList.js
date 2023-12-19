// ImageList.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseInit";
import { doc, onSnapshot } from "firebase/firestore";
import ImageForm from "./ImageForm";

function ImageList({ albumId, onBackClick }) {
  const [album, setAlbum] = useState(null);
  const [showImageForm, setShowImageForm] = useState(false);
  const [editImageData, setEditImageData] = useState(null);

  useEffect(() => {
    const docRef = doc(db, "albums", albumId.toString());

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const albumData = docSnap.data();
        setAlbum(albumData);
        console.log("Album Document data:", albumData);
      } else {
        console.log("No such document!");
        setAlbum(null); // Set album to null if the document doesn't exist
      }
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [albumId]);

  const handleAddImageClick = () => {
    setShowImageForm(true);
    setEditImageData(null);
  };

  const handleEditImageClick = (imageData) => {
    setEditImageData(imageData);
    setShowImageForm(true);
  };

  const handleDeleteImageClick = async (imageId) => {
    try {
      // Delete the image document
      const imageDocRef = doc(db, "images", imageId);
      await imageDocRef.delete();

      // Update the album document by removing the image reference
      const updatedAlbumImages =
        album && album.images
          ? album.images.filter((image) => image.id !== imageId)
          : [];

      const albumDocRef = doc(db, "albums", albumId.toString());
      await albumDocRef.update({ images: updatedAlbumImages });
    } catch (error) {
      console.error("Error deleting image from Firestore:", error.message);
    }
  };

  const handleImageFormClose = () => {
    setShowImageForm(false);
    setEditImageData(null);
  };

  return (
    <>
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Images in Album</h5>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleAddImageClick}
            >
              Add Image
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onBackClick}
            >
              Back to Albums
            </button>
          </div>
        </div>

        {showImageForm && (
          <ImageForm
            albumId={albumId}
            editImageData={editImageData}
            onSubmit={() => {
              setShowImageForm(false);
              // You can add any additional logic after submitting the form
            }}
            onClose={handleImageFormClose}
          />
        )}

        <div className="albumContainer">
          {album && album.images && album.images.length > 0 ? (
            album.images.map((image, index) => (
              <div className="album-item" key={index}>
                <h6 className="albumName">{image.name}</h6>
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="imageFolderIcon"
                />
                {/* <div className="album-options">
                  <button
                    className="btn btn-link"
                    onClick={() => handleEditImageClick(image)}
                  >
                    Edit Image
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteImageClick(image.id)}
                  >
                    Delete Image
                  </button>
                </div> */}


                <div className="album-options">
                <div className="dropdown">
                  <button
                    className="dropdown-toggle btn btn-link"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul className="dropdown-menu">
                    <li>
                      <p
                        className="dropdown-item"
                        onClick={() => handleEditImageClick(image)}
                      >
                        Edit Image
                      </p>
                    </li>
                    <li>
                      <p
                        className="dropdown-item"
                        onClick={() => handleDeleteImageClick(image.id)}
                      >
                        Delete Image
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              </div>
            ))
          ) : (
            <p>No images in this album</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ImageList;
