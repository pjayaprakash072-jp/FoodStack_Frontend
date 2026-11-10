import Modal from "./Modal"

const ConfirmDialog = (
    {
        open,
        title = "Delete item?",
        message = "This action cannot be undone",
        onCancel,
        onConfirm,
        busy = false,
    }
) => {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
        <div className="confirm-dialog">
            <p className="content-description">{message}</p>

            <div className="form-actions">
            <button
                type="button"
                className="secondary-button"
                onClick={onCancel}
                disabled={busy}
            >
                Cancel
            </button>

            <button
                type="button"
                className="danger-button"
                disabled={busy}
                onClick={onConfirm}
            >
                {busy ? "Deleting..." : "Delete"}
            </button>
            </div>
        </div>
        </Modal>
  )
}

export default ConfirmDialog