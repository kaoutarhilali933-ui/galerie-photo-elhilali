import { useState } from "react";

function PhotoCard({ photo, onDelete, onPublish }) {
  const imageUrl = `http://localhost:8000/uploads/${photo.filename}`;
  const [order, setOrder] = useState(photo.publicOrder || "");

  const dateStr = new Date(photo.uploadedAt).toLocaleDateString("en-US");

  const formatSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getType = () => {
    if (photo.mimeType) {
      const parts = photo.mimeType.split("/");
      if (parts[1]) return parts[1].toUpperCase();
    }

    const sourceName = photo.originalName || photo.filename || "";
    const parts = sourceName.split(".");
    if (parts.length < 2) return "IMG";
    return parts[parts.length - 1].toUpperCase();
  };

  return (
    <div className="photo-card">
      <div className="photo-image-wrapper" style={{ position: "relative" }}>
        <img
          src={imageUrl}
          alt={photo.originalName || "Photo"}
          className="photo-image"
        />

        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "flex-end",
            zIndex: 10,
          }}
        >
          <button
            onClick={onDelete}
            style={{
              background: "#5c4033",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="photo-info">
        <div className="photo-name">
          {photo.originalName || photo.filename || "Untitled Photo"}
        </div>

        <div className="photo-meta">
          <div className="meta-item">
            <span className="meta-left">
              <span className="meta-icon">📅</span>
              <span className="meta-label">Date</span>
            </span>
            <span className="meta-value">{dateStr}</span>
          </div>

          <div className="meta-item">
            <span className="meta-left">
              <span className="meta-icon">📦</span>
              <span className="meta-label">Size</span>
            </span>
            <span className="meta-value">{formatSize(photo.sizeBytes)}</span>
          </div>

          <div className="meta-item">
            <span className="meta-left">
              <span className="meta-icon">🖼️</span>
              <span className="meta-label">Type</span>
            </span>
            <span className="meta-value">{getType()}</span>
          </div>

          <div className="meta-item">
            <span className="meta-left">
              <span className="meta-icon">🌍</span>
              <span className="meta-label">Public Order</span>
            </span>
            <span className="meta-value">
              {photo.publicOrder ?? "Private"}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: "18px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Order"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #c8b7a6",
              outline: "none",
            }}
          />

          <button
            onClick={() => onPublish(order)}
            style={{
              background: "#a67c52",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhotoCard;