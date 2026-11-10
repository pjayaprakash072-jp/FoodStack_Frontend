

import {X} from 'lucide-react'
const Modal = ({open,title,onClose,children}) => {
    if(!open) return null;
    return (
        <div
        className="modal-backdrop"
        onMouseDown={onClose}
        >
        <div
            className="modal-container"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="modal-header">
            <h2 className="section-title">{title}</h2>

            <button
                type="button"
                className="modal-close-button"
                onClick={onClose}
                aria-label="Close modal"
            >
                <X size={20} />
            </button>
            </div>

            {children}
        </div>
        </div>
  )
}

export default Modal