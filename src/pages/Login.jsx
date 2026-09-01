import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorDialog from "../components/ErrorDialog.jsx";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";
import MfaModal from "../components/MfaModal.jsx";
 
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [pendingMfa, setPendingMfa] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 
    const result = await login({ email, password });
    if (!result.ok) {
      setError(result.message);
      return;
    }
 
    if (mfaEnabled) {
      setPendingMfa(true);
      return;
    }
	window.location.href = "/dashboard";
  };
 
  const finishAfterMfa = () => {
    setPendingMfa(false);
    window.location.href = "/dashboard";
  };
 
  const cancelMfa = () => {
    setPendingMfa(false);
    setError("Verification was cancelled. Please sign in again.");
  };
 
  return (
    <div className="login-screen">
      <div className="login-visual" aria-hidden="true">
        <div className="login-visual-badge">
          <span className="eyebrow">BNY University</span>
          <h1>Welcome to your onboarding &amp; growth home.</h1>
          <p>
            One place for your Point of Contact, onboarding steps, mandatory
            trainings, domain learning paths, and account programs.
          </p>
        </div>
        <div className="login-visual-path">
          <div className="path-dot" />
          <div className="path-dot" />
          <div className="path-dot" />
          <div className="path-dot" />
        </div>
      </div>
 
      <div className="login-panel">
        <div className="login-panel-inner">
          <div className="login-brandmark">
            <span className="login-brandmark-mark">BU</span>
            <span className="login-brandmark-text">BNY University</span>
          </div>
 
          <h2 className="login-heading">
            Sign in to your account
          </h2>
		  <p className="login-subheading">
		    Access onboarding, trainings, programs and account resources.
		  </p>
 
          <ErrorDialog message={error} onDismiss={() => setError("")} />
 
          <form onSubmit={handleSubmit} className="login-form">
            <label className="field-label" htmlFor="email">Work email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@bny.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
 
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
 
            <div className="login-row-between">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                />
                Use multi-factor verification
              </label>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            </div>
 
            <button type="submit" className="btn btn-primary login-submit">
              Login
            </button>
          </form>
 
        </div>
      </div>
 
      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
      <MfaModal
        open={pendingMfa}
        userLabel={email || "your account"}
        onVerified={finishAfterMfa}
        onCancel={cancelMfa}
      />
    </div>
  );
}