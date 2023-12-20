// ImageCarousel.jsx

import React from "react";
import { Carousel } from "react-bootstrap";

function ImageCarousel({ images, selectedIndex, onClose }) {
  const handleClose = () => {
    onClose();
    // Save the state in local storage
    localStorage.setItem("isCarouselOpen", "false");
  };

  return (
    <>
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          {images &&
            images.map((image, index) => (
              <div
                className={`carousel-item ${
                  index === selectedIndex ? "active" : ""
                }`}
                key={index}
              >
                <img
                  src={image.url}
                  className="d-block w-100"
                  alt={`Image ${index + 1}`}
                />
              </div>
            ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
        {/* Close button */}
        <button onClick={handleClose} className="btn btn-danger">
          Close
        </button>
      </div>
    </>
  );
}

export default ImageCarousel;
