import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { FaCamera, FaVideo, FaStopCircle, FaSyncAlt, FaTrash, FaImages, FaSave } from "react-icons/fa";
import axiosInstance from "../axiosInstance";

const Camera = () => {
  const [image, setImage] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const navigate = useNavigate();

  // Capture Photo & Preview
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc); // Set preview first
  };

  // Start Video Recording
  const startRecording = () => {
    setRecording(true);
    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });

    let chunks = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoBlob(url); 
    };

    mediaRecorderRef.current.start();
  };

  // Stop Video Recording
  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  // Save Media to Backend
  const saveMedia = async (type) => {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?.id;
  
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }
  
    const formData = new FormData();
  
    if (type === "image" && image) {
      const blob = await fetch(image).then((res) => res.blob());
      formData.append("file", blob, "captured-image.jpg");
    } else if (type === "video" && videoBlob) {
      const blob = await fetch(videoBlob).then((res) => res.blob());
      formData.append("file", blob, "recorded-video.webm");
    } else {
      console.error("No media file available for upload.");
      return;
    }
  
    formData.append("userId", userId);
  
    try {
      await axiosInstance.post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

    } catch (error) {
      console.error("Error saving media:", error.response ? error.response.data : error);
    }
  };

  // Delete Media Preview
  const deletePreview = () => {
    setImage(null);
    setVideoBlob(null);
  };

  // Toggle Front/Back Camera
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="camera-container">
      <Webcam
        ref={webcamRef}
        audio={true}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode }}
        className="webcam"
      />

      <div className="buttons">
        <button className="capture-btn" onClick={capturePhoto}>
          <FaCamera className="btn-icon" />
        </button>

        <button className="record-btn" onClick={recording ? stopRecording : startRecording}>
          {recording ? <FaStopCircle className="btn-icon stop" /> : <FaVideo className="btn-icon" />}
        </button>

        <button className="toggle-btn" onClick={toggleCamera}>
          <FaSyncAlt className="btn-icon" />
        </button>

        <button className="gallery-btn" onClick={() => navigate("/gallery")}>
          <FaImages className="btn-icon" />
        </button>
      </div>

      {/* Preview Captured Image */}
      {image && (
        <div className="preview">
          <h3>Captured Image:</h3>
          <img src={image} alt="Captured" />
          <div className="preview-buttons">
            <button className="save-btn" onClick={() => saveMedia("image")}>
              <FaSave /> Save
            </button>
            <button className="delete-btn" onClick={deletePreview}>
              <FaTrash /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Preview Recorded Video */}
      {videoBlob && (
        <div className="preview">
          <h3>Recorded Video:</h3>
          <video src={videoBlob} controls />
          <div className="preview-buttons">
            <button className="save-btn" onClick={() => saveMedia("video")}>
              <FaSave /> Save
            </button>
            <button className="delete-btn" onClick={deletePreview}>
              <FaTrash /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
