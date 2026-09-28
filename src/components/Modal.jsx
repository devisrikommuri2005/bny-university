import { useEffect, useRef } from "react";
 
/**
 * Generic centered dialog. Used for Forgot Password, MFA, and every
 * Admin "edit" panel so the interaction pattern stays consistent.
 */
export default function Modal({ open, title, onClose, children, width = 440 }) {
  const dialogRef = useRef(null);
 
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    // Focus the first field inside the BODY only — never the header's
    // close button — and only once when the dialog opens. (Deliberately
    // excludes `onClose` from deps: parents often pass a fresh arrow fn
    // on every render, e.g. onClose={() => setEditing(null)}, and
    // including it here re-ran this effect on every keystroke, which
    // kept stealing focus back to whatever matched first in the DOM.)
	const t = setTimeout(() => {

	  const target =
	    dialogRef.current?.querySelector(
	      "[data-delete-btn='true']"
	    );
	  target?.focus();
	}, 0);
	
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
 
  if (!open) return null;
 
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        className="modal-panel"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
      >
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
		  <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}