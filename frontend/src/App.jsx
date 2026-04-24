import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

/* ---------------- BANK PORTAL ---------------- */

function BankPortal() {

  function requestVerification() {

    const code =
      Math.floor(100000 + Math.random() * 900000).toString();

    /* Simulated SMS shared across tabs */
    localStorage.setItem("pendingCode", code);

    /* Vault state */
    localStorage.setItem(
      "vaultResponse",
      "Consent Pending"
    );

    alert(
      "Request sent to user.\nApproval code generated."
    );

  }

  return (

    <div style={{ padding: "40px" }}>

      <h1>Bank Portal</h1>

      <button onClick={requestVerification}>
        Request Verification
      </button>

      <p>
        Open User Screen in another tab:
      </p>

      <a href="/user" target="_blank">
        User Consent Window
      </a>

      <br /><br />

      <a href="/vault" target="_blank">
        Vault Window
      </a>

    </div>

  )

}

/* ---------------- USER CONSENT ---------------- */

function UserScreen() {

  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");

  function approve() {

    const code =
      localStorage.getItem("pendingCode");

    if (input === code) {

      localStorage.setItem(
        "vaultResponse",
        '{"verified":true}'
      );

      setStatus("Approved");

    }
    else {

      localStorage.setItem(
        "vaultResponse",
        '{"verified":false,"reason":"CONSENT_DENIED"}'
      );

      setStatus("Denied");

    }

  }

  return (

    <div style={{ padding: "40px" }}>

      <h1>User Consent App</h1>

      <p>
        Approval Code (simulated SMS):
        <b>
          {" "}
          {localStorage.getItem("pendingCode")}
        </b>
      </p>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter code"
      />

      <button onClick={approve}>
        Approve
      </button>

      <h3>{status}</h3>

    </div>

  )

}

/* ---------------- VAULT ---------------- */

function VaultScreen() {

  return (

    <div style={{ padding: "40px" }}>

      <h1>Vault Monitor</h1>

      <h3>Current Response:</h3>

      <pre>
        {localStorage.getItem("vaultResponse")}
      </pre>

    </div>

  )

}

/* ---------------- ROUTER ---------------- */

function App() {

  return (

    <BrowserRouter>

      <nav style={{ padding: "20px" }}>
        <Link to="/">Bank</Link> |{" "}
        <Link to="/user">User</Link> |{" "}
        <Link to="/vault">Vault</Link>
      </nav>

      <Routes>

        <Route path="/" element={<BankPortal />} />
        <Route path="/user" element={<UserScreen />} />
        <Route path="/vault" element={<VaultScreen />} />

      </Routes>

    </BrowserRouter>
s
  )

}

export default App;