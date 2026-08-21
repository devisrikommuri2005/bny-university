import { useState } from "react";
import Modal from "./Modal.jsx";

/**
 * First-draft MFA step. Any 6-digit code is accepted so the flow can be
 * demoed end-to-end — swap `verify()` for a real OTP check later.
 */
export default function MfaModal({ open, userLabel, onVerified, onCancel }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const verify = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setError("");
    setCode("");
    onVerified();
  };

  return (
    <Modal open={open} title="Verify it's you" onClose={onCancel}>
      <p className="modal-hint">
        We sent a 6-digit verification code for <strong>{userLabel}</strong>. Enter it below to finish signing in.
        <br />
        <span className="modal-hint-note">(Draft mode: any 6-digit code works.)</span>
      </p>
      <form onSubmit={verify}>
        <label className="field-label" htmlFor="mfa-code">Verification code</label>
        <input
          id="mfa-code"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          autoComplete="one-time-code"
        />
        {error && <p className="field-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">Verify &amp; continue</button>
        </div>
      </form>
    </Modal>
  );
}
