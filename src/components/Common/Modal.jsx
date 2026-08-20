

import {X} from 'lucide-react'
const Modal = ({open,title,onClose,children}) => {
    if(!open) return null;
    return (
    <div className="modal-backdrop" onMouseDown={onClose}>
        <div className="modal" onMouseDown={(e)=> e.stopPropagation()}>
            <div className="modal-header">
                <h3>{title}</h3>
                <button className="icon-button" onClick={onClose}>
                    <X/>
                </button>
            </div>
            {children}
        </div>
    </div>
  )
}

export default Modal