import React, { useState, useEffect } from "react";
import AlbumForm from "./AlbumForm";
import ImageList from "./ImageList";
import { db } from "../firebaseInit";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";

// AlbumList component manages the list of albums and their interactions
function AlbumList() {
  // State variables for managing albums and component state
  const [albums, setAlbums] = useState([]);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editAlbumData, setEditAlbumData] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Fetch albums from Firestore and update state
  useEffect(() => {
    const albumsCollection = collection(db, "albums");

    // Subscribe to changes in the 'albums' collection
    const unsubscribe = onSnapshot(albumsCollection, (snapshot) => {
      const albumsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAlbums(albumsData);
      setLoading(false); // Set loading to false when albums are loaded
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle options click (Edit album)
  const handleOptionsClick = (albumId) => {
    const albumData = albums.find((album) => album.id === albumId);
    setEditAlbumData(albumData);
    setShowAlbumForm(true);
  };

  // Handle delete album
  const handleDeleteAlbum = async (albumId) => {
    try {
      await deleteDoc(doc(db, "albums", albumId));
      console.log(`Delete album with id: ${albumId}`);
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  };

  // Handle add album click
  const handleAddAlbumClick = () => {
    setShowAlbumForm(true);
    setEditAlbumData(null);
  };

  // Handle album form submission
  const handleAlbumFormSubmit = () => {
    setShowAlbumForm(false);
    setEditAlbumData(null);
  };

  // Handle album form close
  const handleAlbumFormClose = () => {
    setShowAlbumForm(false);
    setEditAlbumData(null);
  };

  // Handle album click (select album)
  const handleAlbumClick = (albumId) => {
    setSelectedAlbum(albumId);
    localStorage.setItem("selectedAlbum", albumId); // Save selected album to localStorage
  };

  // Handle back to albums click
  const handleBackToAlbumsClick = () => {
    setSelectedAlbum(null);
    localStorage.removeItem("selectedAlbum"); // Remove selected album from localStorage
  };

  // Check for stored albumId in localStorage on component mount
  useEffect(() => {
    const storedAlbumId = localStorage.getItem("selectedAlbum");
    if (storedAlbumId) {
      setSelectedAlbum(storedAlbumId);
    }
  }, []);

  // JSX structure for rendering the component
  return (
    <>
      {/* Render album form when showAlbumForm is true and loading is false */}
      {!loading && showAlbumForm && (
        <AlbumForm
          onSubmit={handleAlbumFormSubmit}
          onClose={handleAlbumFormClose}
          editAlbumData={editAlbumData}
        />
      )}

      {/* Container for displaying album list */}
      <div className="container my-5 d-flex justify-content-between">
        {!selectedAlbum && (
          <>
            {/* Heading and add album button */}
            <h5>Album list</h5>
            <div
              className="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddAlbumClick}
              >
                Add album
              </button>
            </div>
          </>
        )}
      </div>

      {/* Display loading spinner when loading is true */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border m-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Render ImageList when selectedAlbum is not null and has a length greater than 0 */}
      {!loading && selectedAlbum && selectedAlbum.length > 0 && (
        <ImageList
          albumId={selectedAlbum}
          onBackClick={handleBackToAlbumsClick}
        />
      )}

      {/* Render albums grid when loading is false and selectedAlbum is null */}
      {!loading && !selectedAlbum && (
        <div className="albumContainer">
          {/* Map through albums and render album grid */}
          {albums.map((album) => (
            <div className="grid" key={album.id}>
              <h6
                onClick={() => handleAlbumClick(album.id)}
                className="albumName"
              >
                {album.name}
              </h6>
              <img
                src={`https://helpx.adobe.com/content/dam/help/en/indesign/using/cop-text-ai-id/copy-insert-graphics-insert-png-images.png.img.png`}
                alt=""
                className="imageFolderIcon"
              />
              <i class="fa-regular fa-right"></i>

              <div className="image-options ao">
                {/* Buttons for editing and deleting albums */}
                <button
                  className="btn"
                  onClick={() => handleOptionsClick(album.id)}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button
                  className="btn"
                  onClick={() => handleDeleteAlbum(album.id)}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Export the AlbumList component
export default AlbumList;
