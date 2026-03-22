import React from "react";
import "./deleteModal.css";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Confirm deletion</h2>
        <p className="modal-text">
          This photo will be permanently deleted and cannot be recovered.
        </p>

        <div className="modal-actions">
          <button
            className="modal-cancel-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            className="modal-delete-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}