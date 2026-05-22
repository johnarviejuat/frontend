import React, { useState, useRef, useEffect } from "react";

export default function OnboardingForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "" });
  const [status, setStatus] = useState({ message: "", isSuccess: false });
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("register");
  
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [isCanvasBlank, setIsCanvasBlank] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7190";

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customer index", error);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchCustomers();
    }
  }, [activeTab]);

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    isDrawing.current = true;
    setIsCanvasBlank(false);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => (isDrawing.current = false);

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setIsCanvasBlank(true);
  };

  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setStatus({ message: "First and Last Name cannot be blank.", isSuccess: false });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus({ message: "Please supply a structurally valid email address.", isSuccess: false });
      return false;
    }
    if (isCanvasBlank) {
      setStatus({ message: "E-Signature authorization capture is mandatory.", isSuccess: false });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", isSuccess: false });

    if (!validateForm()) return;

    const signatureBase64 = canvasRef.current.toDataURL("image/png");
    const payload = { ...form, signatureBase64 };

    try {
      const res = await fetch(`${API_BASE_URL}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus({ message: "Success! Customer onboarded smoothly.", isSuccess: true });
        setForm({ firstName: "", lastName: "", email: "", phoneNumber: "" });
        clearSignature();
      } else {
        const err = await res.json();
        setStatus({ message: `Validation Error: ${err.message || "Please check inputs."}`, isSuccess: false });
      }
    } catch (error) {
      setStatus({ message: "Server connection failed. Verify API is running.", isSuccess: false });
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px", fontFamily: "Segoe UI, system-ui, sans-serif", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)" }}>
      
      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "24px" }}>
        <button onClick={() => setActiveTab("register")} style={{ flex: 1, padding: "12px", background: "none", border: "none", borderBottom: activeTab === "register" ? "2px solid #0056b3" : "none", color: activeTab === "register" ? "#0056b3" : "#64748b", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
          Registration Form
        </button>
        <button onClick={() => setActiveTab("view")} style={{ flex: 1, padding: "12px", background: "none", border: "none", borderBottom: activeTab === "view" ? "2px solid #0056b3" : "none", color: activeTab === "view" ? "#0056b3" : "#64748b", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
          Customer Directory ({customers.length})
        </button>
      </div>

      {activeTab === "register" ? (
        <div>
          <h2 style={{ color: "#0f172a", margin: "0 0 4px 0", fontSize: "22px" }}>Customer Onboarding</h2>
          <p style={{ color: "#64748b", margin: "0 0 20px 0", fontSize: "14px" }}>Fill in details to provision an active database client record.</p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <input type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
            
            <div style={{ marginBottom: "12px" }}>
              <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <input type="text" placeholder="Phone Number (Optional)" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "600", fontSize: "14px", color: "#475569", marginBottom: "6px" }}>Handwritten Authorization Signature:</label>
              <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} width={550} height={150} style={{ border: "1px dashed #94a3b8", borderRadius: "6px", background: "#f8fafc", display: "block", cursor: "crosshair", width: "100%", height: "150px" }} />
              <button type="button" onClick={clearSignature} style={{ marginTop: "6px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", padding: "0", fontWeight: "500" }}>Clear Drawing Pad</button>
            </div>
            
            <button type="submit" style={{ width: "100%", padding: "12px", background: "#0056b3", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "15px", transition: "background 0.2s" }}>Submit Onboarding Application</button>
          </form>
        </div>
      ) : (

        <div>
          <h3 style={{ color: "#0f172a", margin: "0 0 16px 0" }}>Registered Customer Base</h3>
          {customers.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "20px" }}>No client profiles saved inside SQLite database yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
              {customers.map((c) => (
                <div key={c.id} style={{ padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>{c.firstName} {c.lastName}</h4>
                    <p style={{ margin: "0 0 2px 0", fontSize: "13px", color: "#64748b" }}>✉ {c.email}</p>
                    {c.phoneNumber && <p style={{ margin: "0", fontSize: "13px", color: "#64748b" }}>📞 {c.phoneNumber}</p>}
                  </div>
                  {c.signatureBase64 && (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>Signature</span>
                      <img src={c.signatureBase64} alt="signature" style={{ height: "40px", width: "90px", objectFit: "contain", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {status.message && (
        <div style={{ marginTop: "20px", padding: "12px", borderRadius: "6px", background: status.isSuccess ? "#f0fdf4" : "#fef2f2", color: status.isSuccess ? "#166534" : "#991b1b", fontSize: "14px", fontWeight: "500", border: status.isSuccess ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
          {status.message}
        </div>
      )}
    </div>
  );
}