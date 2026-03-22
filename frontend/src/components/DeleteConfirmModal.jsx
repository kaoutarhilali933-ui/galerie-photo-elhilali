import "./deleteModal.css";

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2 className="delete-modal-title">Delete photo</h2>
        <p className="delete-modal-text">
          This action cannot be undone. Do you want to permanently delete this photo?
        </p>

        <div className="delete-modal-actions">
          <button className="delete-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;