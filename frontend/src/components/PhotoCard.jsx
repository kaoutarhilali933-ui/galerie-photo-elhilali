function PhotoCard({ photo, onDelete }) {
  const imageUrl = `http://localhost:8000/uploads/${photo.filename}`;

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
      <div className="photo-image-wrapper">
        <img
          src={imageUrl}
          alt={photo.originalName || "Photo"}
          className="photo-image"
        />

        <button onClick={onDelete} className="btn-delete">
          Delete
        </button>
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
        </div>
      </div>
    </div>
  );
}

export default PhotoCard;