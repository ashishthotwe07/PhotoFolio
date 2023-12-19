import React, { useState, useEffect } from "react";
import AlbumForm from "./AlbumForm";
import ImageList from "./ImageList";
import { db } from "../firebaseInit";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";

function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editAlbumData, setEditAlbumData] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const albumsCollection = collection(db, 'albums');

    const unsubscribe = onSnapshot(albumsCollection, (snapshot) => {
      const albumsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAlbums(albumsData);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleOptionsClick = (albumId) => {
    const albumData = albums.find((album) => album.id === albumId);
    setEditAlbumData(albumData);
    setShowAlbumForm(true);
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      await deleteDoc(doc(db, 'albums', albumId));
      console.log(`Delete album with id: ${albumId}`);
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  };

  const handleAddAlbumClick = () => {
    setShowAlbumForm(true);
    setEditAlbumData(null);
  };

  const handleAlbumFormSubmit = () => {
    setShowAlbumForm(false);
    setEditAlbumData(null);
  };

  const handleAlbumFormClose = () => {
    setShowAlbumForm(false);
    setEditAlbumData(null);
  };

  const handleAlbumClick = (albumId) => {
    setSelectedAlbum(albumId);
    localStorage.setItem('selectedAlbum', albumId); // Save selected album to localStorage
  };

  const handleBackToAlbumsClick = () => {
    setSelectedAlbum(null);
    localStorage.removeItem('selectedAlbum'); // Remove selected album from localStorage
  };

  useEffect(() => {
    const storedAlbumId = localStorage.getItem('selectedAlbum');
    if (storedAlbumId) {
      setSelectedAlbum(storedAlbumId);
    }
  }, []);

  return (
    <>
      {showAlbumForm && (
        <AlbumForm
          onSubmit={handleAlbumFormSubmit}
          onClose={handleAlbumFormClose}
          editAlbumData={editAlbumData}
        />
      )}
      <div className="container my-5 d-flex justify-content-between">
        {!selectedAlbum && (
          <>
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
      {selectedAlbum && selectedAlbum.length > 0 && (
        <ImageList albumId={selectedAlbum} onBackClick={handleBackToAlbumsClick} />
      )}
      {!selectedAlbum && (
        <div className="albumContainer">
          {albums.map((album) => (
            <div
              className="album-item"
              key={album.id}
            >
              <h6 className="albumName" onClick={() => handleAlbumClick(album.id)}>{album.name}</h6>
              <img
                src={`${process.env.PUBLIC_URL}/album.png`}
                alt=""
                className="imageFolderIcon"
              />
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
                        onClick={() => handleOptionsClick(album.id)}
                      >
                        Edit album
                      </p>
                    </li>
                    <li>
                      <p
                        className="dropdown-item"
                        onClick={() => handleDeleteAlbum(album.id)}
                      >
                        Delete album
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AlbumList;
