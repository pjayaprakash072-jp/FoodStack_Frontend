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
    <Modal open = {open} title = {title} onClose = {onCancel}>
        <p className="muted">{message}</p>
        <div className="form-action">
            <button className="button secondary" onClick={onCancel}>Cancel</button>
            <button className="button danger" disabled = {busy} onClick={onConfirm}> {busy? "Deleting..." : "Delete"}</button>
        </div>
    </Modal>
  )
}

export default ConfirmDialog