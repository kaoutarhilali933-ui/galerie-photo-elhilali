import { useState } from "react";
import api from "../services/api";

function UploadModal({ onClose, refreshPhotos }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));

      if (!photoName.trim()) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setPhotoName(cleanName);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("originalName", photoName.trim());

    try {
      await api.post("/photos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refreshPhotos();

      setFile(null);
      setPreview(null);
      setPhotoName("");
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert(JSON.stringify(error.response?.data || { message: "Upload failed" }));
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Upload Photo</h2>
        <p className="modal-subtitle">
          Select an image and choose a custom name before uploading
        </p>

        <label htmlFor="file-upload" className="upload-box">
          {preview ? (
            <img src={preview} alt="Preview" className="upload-preview" />
          ) : (
            <div className="upload-placeholder">
              <span className="icon">📁</span>
              <span className="upload-placeholder-title">
                Click to browse files
              </span>
              <small>Supported: JPG, PNG</small>
            </div>
          )}
        </label>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />

        {file && <p className="file-info-text">Selected file: {file.name}</p>}

        <div className="input-group">
          <label htmlFor="photo-name" className="input-label">
            Photo name
          </label>
          <input
            id="photo-name"
            type="text"
            className="photo-name-input"
            placeholder="Enter a custom photo name"
            value={photoName}
            onChange={(e) => setPhotoName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="modal-actions">
          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Confirm"}
          </button>

          <button
            type="button"
            className="cancel-button-link"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;