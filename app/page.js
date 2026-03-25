"use client";
import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🚗 Flip SaaS</h1>

      <input placeholder="Model" onChange={e=>setForm({...form,model:e.target.value})}/>
      <input placeholder="Price" onChange={e=>setForm({...form,price:e.target.value})}/>
      <input placeholder="Mileage" onChange={e=>setForm({...form,mileage:e.target.value})}/>
      <input placeholder="Year" onChange={e=>setForm({...form,year:e.target.value})}/>

      <button onClick={analyze}>Analyze</button>

      {result && (
        <div>
          <p>Profit: €{result.profit}</p>
          <p>Score: {result.score}</p>
        </div>
      )}
    </div>
  );
}
