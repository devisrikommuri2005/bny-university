/**
 * Inline error "dialogue box" shown on the Login page itself
 * (not a browser alert) — per the brief, errors stay on-page.
 */
export default function ErrorDialog({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="error-dialog" role="alert">
      <span className="error-dialog-icon" aria-hidden="true">!</span>
      <p>{message}</p>
      {onDismiss && (
        <button className="error-dialog-dismiss" aria-label="Dismiss error" onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  );
}
