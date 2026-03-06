import { useState, useEffect } from "react";
import Select from "react-select";
import { currencies } from "./data/currencies";

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [result, setResult] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const API_KEY = "2c7d2f827c-24da54f391-tbhfyf";

  // Fetch live exchange rate whenever currencies change
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency.value}/${toCurrency.value}`
        );
        const data = await res.json();
        setExchangeRate(data.conversion_rate);

        // Auto convert if amount is present
        if (amount && amount > 0) {
          setResult((amount * data.conversion_rate).toFixed(2));
        }
      } catch {
        console.log("Rate fetch failed");
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency, amount]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (fromCurrency.value === toCurrency.value) {
      setError("Choose two different currencies");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency.value}/${toCurrency.value}/${amount}`
      );
      const data = await res.json();
      setResult(data.conversion_result);

      // Add to history
      setHistory((prev) => [
        { from: fromCurrency.value, to: toCurrency.value, amount, result: data.conversion_result },
        ...prev,
      ]);
    } catch {
      setError("Conversion failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change (auto convert)
  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    if (val && val > 0 && exchangeRate) {
      setResult((val * exchangeRate).toFixed(2));
    } else {
      setResult(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[420px]">

        <h1 className="text-2xl font-bold text-center mb-6">
          Currency Converter
        </h1>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={handleAmountChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Currency Selectors */}
        <div className="space-y-3">
          <Select
            options={currencies}
            value={fromCurrency}
            onChange={setFromCurrency}
          />
          <Select
            options={currencies}
            value={toCurrency}
            onChange={setToCurrency}
          />
        </div>

        {/* Swap Button */}
        <button
          onClick={swapCurrencies}
          className="w-full mt-4 mb-3 bg-gray-200 hover:bg-gray-300 p-2 rounded"
        >
          Swap Currencies
        </button>

        {/* Convert Button */}
        <button
          onClick={convertCurrency}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Convert
        </button>

        {/* Live Exchange Rate */}
        {exchangeRate && (
          <p className="text-center mt-4 text-gray-600">
            1 {fromCurrency.value} = {exchangeRate} {toCurrency.value}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-center mt-4 text-gray-500">
            Converting...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center mt-4 text-red-500">
            {error}
          </p>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="text-center mt-6 text-lg font-semibold">
            {amount} {fromCurrency.value} = {result} {toCurrency.value}
          </div>
        )}

        {/* Conversion History */}
        {history.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">History</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              {history.map((item, index) => (
                <li key={index} className="flex justify-between border-b pb-1">
                  <span>{item.amount} {item.from}</span>
                  <span>= {item.result} {item.to}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;