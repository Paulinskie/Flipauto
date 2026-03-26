import { useState, useMemo } from "react";
const Card = ({ children }) => (
  <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
    {children}
  </div>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, ...props }) => (
  <button
    style={{ padding: 10, borderRadius: 8, cursor: "pointer" }}
    {...props}
  >
    {children}
  </button>
);
const Input = (props) => (
  <input
    style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
    {...props}
  />
);

function downloadCSV(rows) {
  const headers = Object.keys(rows[0] || {});
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => r[h]).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "car_flips.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Simple AI-style evaluator
function analyzeDeal({ model, price, mileage, year }) {
  let score = 0;
  let verdict = "Bad Deal";

  if (price < 8000) score += 2;
  if (price < 6000) score += 3;

  if (mileage < 120000) score += 2;
  if (mileage < 80000) score += 3;

  if (year >= 2016) score += 2;
  if (year >= 2019) score += 3;

  if (
    ["Corolla", "Golf", "Tucson", "Yaris", "Octavia"].some((c) =>
      model.includes(c)
    )
  ) {
    score += 3;
  }

  if (score >= 8) verdict = "🔥 Strong Flip";
  else if (score >= 5) verdict = "👍 متوسط Flip";
  else verdict = "❌ Risky";

  return { score, verdict };
}

export default function CarFlippingDashboard() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    model: "",
    year: "",
    purchase: "",
    repairs: "",
    listing: "",
    days: "",
  });

  const [analyzer, setAnalyzer] = useState({
    model: "",
    price: "",
    mileage: "",
    year: "",
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  const addCar = () => {
    if (!form.model || !form.purchase || !form.listing) return;

    const totalCost = Number(form.purchase) + Number(form.repairs || 0);
    const profit = Number(form.listing) - totalCost;

    const newCar = { ...form, totalCost, profit };
    setCars([newCar, ...cars]);
    setForm({
      model: "",
      year: "",
      purchase: "",
      repairs: "",
      listing: "",
      days: "",
    });
  };

  const runAnalysis = () => {
    const result = analyzeDeal({
      model: analyzer.model,
      price: Number(analyzer.price),
      mileage: Number(analyzer.mileage),
      year: Number(analyzer.year),
    });
    setAnalysisResult(result);
  };

  const analytics = useMemo(() => {
    const totalProfit = cars.reduce((sum, c) => sum + c.profit, 0);
    const avgProfit = cars.length ? (totalProfit / cars.length).toFixed(0) : 0;
    return { totalProfit, avgProfit };
  }, [cars]);

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">
        🚗 Car Flipping Dashboard + AI Analyzer
      </h1>

      {/* Analyzer */}
      <Card className="p-4">
        <CardContent className="grid gap-3">
          <h2 className="font-bold">AI Deal Analyzer</h2>
          <Input
            placeholder="Model (e.g Corolla)"
            value={analyzer.model}
            onChange={(e) =>
              setAnalyzer({ ...analyzer, model: e.target.value })
            }
          />
          <Input
            placeholder="Price (€)"
            type="number"
            value={analyzer.price}
            onChange={(e) =>
              setAnalyzer({ ...analyzer, price: e.target.value })
            }
          />
          <Input
            placeholder="Mileage"
            type="number"
            value={analyzer.mileage}
            onChange={(e) =>
              setAnalyzer({ ...analyzer, mileage: e.target.value })
            }
          />
          <Input
            placeholder="Year"
            type="number"
            value={analyzer.year}
            onChange={(e) => setAnalyzer({ ...analyzer, year: e.target.value })}
          />
          <Button onClick={runAnalysis}>Analyze Deal</Button>

          {analysisResult && (
            <div className="p-3 border rounded-xl">
              <p>Score: {analysisResult.score}/10</p>
              <p className="font-bold">{analysisResult.verdict}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Dashboard */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            Total Profit: €{analytics.totalProfit}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            Avg Profit: €{analytics.avgProfit}
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardContent className="grid gap-3">
          <Input
            placeholder="Car Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
          <Input
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
          <Input
            placeholder="Purchase Price (€)"
            type="number"
            value={form.purchase}
            onChange={(e) => setForm({ ...form, purchase: e.target.value })}
          />
          <Input
            placeholder="Repair Cost (€)"
            type="number"
            value={form.repairs}
            onChange={(e) => setForm({ ...form, repairs: e.target.value })}
          />
          <Input
            placeholder="Listing Price (€)"
            type="number"
            value={form.listing}
            onChange={(e) => setForm({ ...form, listing: e.target.value })}
          />
          <Input
            placeholder="Days to Sell"
            type="number"
            value={form.days}
            onChange={(e) => setForm({ ...form, days: e.target.value })}
          />
          <Button onClick={addCar}>Add Deal</Button>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => downloadCSV(cars)}>Export CSV</Button>
        <Button variant="outline" onClick={() => setCars([])}>
          Clear All
        </Button>
      </div>
    </div>
  );
}