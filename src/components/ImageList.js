// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { db } from "../firebaseInit";
import { doc, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import ImageForm from "./ImageForm";

// ImageList component for managing images in an album
function ImageList({ albumId, onBackClick }) {
  const [album, setAlbum] = useState(null);
  const [showImageForm, setShowImageForm] = useState(false);
  const [editImageData, setEditImageData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Fetch album data when the component mounts
  useEffect(() => {
    const docRef = doc(db, "albums", albumId.toString());

    // Subscribe to changes in the album document
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const albumData = docSnap.data();
        setAlbum(albumData);
      } else {
        setAlbum(null);
      }
      setLoading(false);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [albumId]);

  // Handle click to add a new image
  const handleAddImageClick = () => {
    setShowImageForm(true);
    setEditImageData(null);
  };

  // Handle click to edit an existing image
  const handleEditImageClick = (imageData) => {
    setEditImageData(imageData);
    setShowImageForm(true);
  };

  // Handle click to delete an image
  const handleDeleteImageClick = async (imageId) => {
    try {
      // Delete the image document
      const imageDocRef = doc(db, "images", imageId);
      await deleteDoc(imageDocRef);

      // Update the album document by removing the image reference
      const updatedAlbumImages =
        album && album.images
          ? album.images.filter((image) => image && image.id !== imageId)
          : [];

      const albumDocRef = doc(db, "albums", albumId.toString());
      await updateDoc(albumDocRef, { images: updatedAlbumImages });

      // No need to call onSubmit here; it can be done elsewhere based on your logic
    } catch (error) {
      console.error("Error deleting image from Firestore:", error.message);
    }
  };

  // Handle closing the image form
  const handleImageFormClose = () => {
    setShowImageForm(false);
    setEditImageData(null);
  };

  // Handle click on an image in the list
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  // Handle closing the image carousel
  const handleCloseCarousel = () => {
    setSelectedImageIndex(null);
  };

  // JSX structure for rendering the component
  return (
    <>
      {/* Render the ImageForm component when showImageForm is true */}
      {showImageForm && (
        <ImageForm
          albumId={albumId}
          editImageData={editImageData}
          onSubmit={() => {
            setShowImageForm(false);
          }}
          onClose={handleImageFormClose}
        />
      )}

      {/* Container for the image list */}
      <div className="container my-5">
        {/* Header with title and buttons */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Images List</h5>
          <div className="btn-group">
            {/* Button to add a new image */}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleAddImageClick}
            >
              Add Image
            </button>
            {/* Button to go back to the album list */}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onBackClick}
            >
              Back to Albums
            </button>
          </div>
        </div>

        {/* Display a loading spinner while data is being fetched */}
        {loading && (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        {/* Container for displaying the list of images */}
        <div className="albumContainer">
          {/* Check if there are images in the album */}
          {album && album.images && album.images.length > 0 ? (
            // Map over the images and display each one
            album.images.map((image, index) => (
              <div className="grid" key={index}>
                <h6
                  onClick={() => handleImageClick(index)}
                  className="albumName"
                >
                  {image.name}
                </h6>
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="imageFolderIcon"
                />

                {/* Buttons for editing and deleting images */}
                <div className="image-options">
                  <button
                    className="btn"
                    onClick={() => handleEditImageClick(image)}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleDeleteImageClick(image.id)}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Display a message if there are no images in the album
            <p>No images in this album</p>
          )}
        </div>

        {/* Display the image carousel if an image is selected */}
        {selectedImageIndex !== null && (
          <div className="carousels">
            {/* Button to close the carousel */}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleCloseCarousel}
            ></button>
            {/* Display the selected image in the carousel */}
            <img
              src={album.images[selectedImageIndex].url}
              alt={`Image ${selectedImageIndex + 1}`}
              style={{ width: "190%", height: "90%" }}
            />
          </div>
        )}
      </div>
    </>
  );
}

// Export the ImageList component
export default ImageList;
