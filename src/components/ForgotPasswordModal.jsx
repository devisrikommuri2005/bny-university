import { useState } from "react";
import Modal from "./Modal.jsx";

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // First draft: no email backend wired up yet — simulate the send.
    setSent(true);
  };

  const handleClose = () => {
    setSent(false);
    setEmail("");
    onClose();
  };

  return (
    <Modal open={open} title="Reset your password" onClose={handleClose}>
      {sent ? (
        <div className="modal-confirm">
          <p>
            If <strong>{email}</strong> matches an account, we've sent a reset link to it.
            Check your inbox — the link expires in 30 minutes.
          </p>
          <button className="btn btn-primary" onClick={handleClose}>
            Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="modal-hint">
            Enter the email tied to your BNY University account and we'll send you a link to reset your password.
          </p>
          <label className="field-label" htmlFor="forgot-email">Work email</label>
          <input
            id="forgot-email"
            type="email"
            placeholder="you@bny.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Send reset link</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
