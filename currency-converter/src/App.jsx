import { useState, useEffect } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { currencies } from "./data/currencies";

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [result, setResult] = useState(null);
  const [displayResult, setDisplayResult] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = "2c7d2f827c-24da54f391-tbhfyf";

  // Fetch exchange rate whenever currencies change
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency.value}/${toCurrency.value}`
        );
        const data = await res.json();

        if (data && data.conversion_rate) {
          setExchangeRate(data.conversion_rate);

          // Auto-convert if amount exists
          const numericAmount = parseFloat(amount);
          if (!isNaN(numericAmount)) {
            const converted = (numericAmount * data.conversion_rate).toFixed(2);
            setResult(converted);
            animateResult(converted);
          }
        }
      } catch {
        setExchangeRate(null);
        console.log("Rate fetch failed");
      }
    };
    fetchRate();
  }, [fromCurrency, toCurrency]);

  const animateResult = (target) => {
    let start = 0;
    const end = parseFloat(target);
    const duration = 600;
    const stepTime = 20;
    const increment = end / (duration / stepTime);
    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplayResult(start.toFixed(2));
    }, stepTime);
  };

  // Auto-convert while typing
  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);

    const numericVal = parseFloat(val);
    if (!isNaN(numericVal) && exchangeRate) {
      const converted = (numericVal * exchangeRate).toFixed(2);
      setResult(converted);
      animateResult(converted);
    } else {
      setResult(null);
      setDisplayResult(0);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const convertCurrency = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
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
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency.value}/${toCurrency.value}/${numericAmount}`
      );
      const data = await res.json();

      if (data && data.conversion_result) {
        setResult(data.conversion_result.toFixed(2));
        animateResult(data.conversion_result.toFixed(2));

        setHistory((prev) => [
          {
            from: fromCurrency.value,
            to: toCurrency.value,
            amount: numericAmount,
            result: data.conversion_result.toFixed(2),
          },
          ...prev,
        ]);
      }
    } catch {
      setError("Conversion failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""} transition-colors duration-500`}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <motion.div
          layout
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-[420px] transition-colors duration-500"
        >
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Currency Converter
          </h1>

          {/* Amount Input */}
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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
          <motion.button
            onClick={swapCurrencies}
            whileTap={{ rotate: 180 }}
            className="w-full mt-4 mb-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded transition-colors duration-300"
          >
            Swap Currencies
          </motion.button>

          {/* Convert Button */}
          <button
            onClick={convertCurrency}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-2 transition-colors duration-300"
          >
            Convert
          </button>

          {/* Live Exchange Rate */}
          {exchangeRate && (
            <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
              1 {fromCurrency.value} = {exchangeRate} {toCurrency.value}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-center mt-4 text-gray-500 dark:text-gray-300">
              Converting...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center mt-4 text-red-500">{error}</p>
          )}

          {/* Animated Result */}
          <AnimatePresence>
            {displayResult && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {amount} {fromCurrency.value} = {displayResult} {toCurrency.value}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversion History */}
          {history.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">History</h2>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {history.map((item, index) => (
                  <li key={index} className="flex justify-between border-b pb-1 dark:border-gray-600">
                    <span>{item.amount} {item.from}</span>
                    <span>= {item.result} {item.to}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;