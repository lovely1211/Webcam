import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./style.css";

const Gallery = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); 
  const userId = userInfo?.id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axiosInstance
      .get(`/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setMediaFiles(res.data.reverse());
      }) 
      .catch((err) => console.error("Error fetching media:", err));
  }, [userId]);  

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMediaFiles(mediaFiles.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  };

  return (
    <div className="gallery-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Your Saved Media</h2>
      <div className="media-grid">
        {mediaFiles.map((file) => (
          <div key={file._id} className="media-card">

            {file.fileType === "video" ? (
              <video src={`http://localhost:5000${file.fileUrl}`} controls />
            ) : (
             <img src={`http://localhost:5000${file.fileUrl}`} alt="Media" />
            )}

            <button className="delete-btn" onClick={() => handleDelete(file._id)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
