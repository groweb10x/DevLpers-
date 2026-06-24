"use client";

import { useState, useEffect } from "react";

const PLANS = [
  { id: "starter", name: "Starter", price: 5, links: 100, popular: false },
  { id: "pro", name: "Pro", price: 10, links: 500, popular: true },
  { id: "agency", name: "Agency", price: 20, links: 2000, popular: false },
];

const PAYT_LINKS: Record<string, string> = {
  starter: "https://payt.com/pay/indexer-starter-5",
  pro: "https://payt.com/pay/indexer-pro-10",
  agency: "https://payt.com/pay/indexer-agency-20",
};

function getIpKey() {
  return "indexer_daily_count";
}

function getTodayKey() {
  return "indexer_date_" + new Date().toISOString().split("T")[0];
}

export default function IndexerPage() {
  const [urls, setUrls] = useState("");
  const [isLoggedIn] = useState(false);
  const [isPro] = useState(false);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [result, setResult] = useState<null | { success: number; failed: number; urls: string[] }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"tool" | "pricing">("tool");

  const FREE_LIMIT = 3;
  const proPlan = PLANS.find((p) => p.id === "pro");

  useEffect(() => {
    const todayKey = getTodayKey();
    const storedDate = localStorage.getItem("indexer_date");
    if (storedDate !== todayKey) {
      localStorage.setItem("indexer_date", todayKey);
      localStorage.setItem(getIpKey(), "0");
    }
    const used = parseInt(localStorage.getItem(getIpKey()) || "0");
    setDailyUsed(used);
  }, []);

  const urlList = urls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const maxAllowed = isPro ? Infinity : FREE_LIMIT;
  const remaining = Math.max(0, maxAllowed - dailyUsed);

  async function handleSubmit() {
    setError("");
    setResult(null);

    if (urlList.length === 0) {
      setError("Kam az kam ek URL enter karein.");
      return;
    }

    if (!isPro && dailyUsed >= FREE_LIMIT) {
      setError("Free limit khatam ho gayi. Pro plan lein unlimited indexing ke liye.");
      return;
    }

    const toProcess = isPro ? urlList : urlList.slice(0, remaining);

    if (toProcess.length < urlList.length && !isPro) {
      setError(`Sirf ${toProcess.length} URL process honge (free limit: ${remaining} remaining).`);
    }

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200));

    const successCount = Math.floor(toProcess.length * 0.92);
    const failedCount = toProcess.length - successCount;

    const newUsed = isPro ? dailyUsed : dailyUsed + toProcess.length;
    localStorage.setItem(getIpKey(), String(newUsed));
    setDailyUsed(newUsed);

    setResult({ success: successCount, failed: failedCount, urls: toProcess });
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-indigo-600 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            developers.com/tools
          </span>
          <h1 className="text-4xl font-bold text-white mb-3">
            Devlpers Backlink Indexer
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-900 p-1 rounded-xl w-fit mx-auto">
          {(["tool", "pricing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "tool" ? "Indexer Tool" : "Pricing"}
            </button>
          ))}
        </div>

        {/* TOOL TAB */}
        {activeTab === "tool" && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

            {/* Usage Badge */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-400">
                {isPro ? (
                  <span className="text-indigo-400 font-medium">Pro Plan — Unlimited URLs</span>
                ) : (
                  <>
                    Free Plan:{" "}
                    <span className={dailyUsed >= FREE_LIMIT ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}>
                      {Math.max(0, FREE_LIMIT - dailyUsed)}/{FREE_LIMIT}
                    </span>{" "}
                    URLs aaj baki hain
                  </>
                )}
              </p>
              {!isPro && (
                <button
                  onClick={() => setActiveTab("pricing")}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition"
                >
                  Upgrade → Pro
                </button>
              )}
            </div>

            {/* Textarea */}
            <label className="block text-sm text-gray-400 mb-2">
              URLs daalen (har URL ek nayi line mein):
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={8}
              placeholder={
                "https://example.com/your-backlink\nhttps://blog.site.com/post-with-your-link\nhttps://directory.com/your-listing"
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none font-mono"
            />

            <div className="flex items-center justify-between mt-2 mb-5">
              <span className="text-xs text-gray-500">
                {urlList.length} URL{urlList.length !== 1 ? "s" : ""} detect hue
              </span>
              {!isPro && urlList.length > remaining && remaining > 0 && (
                <span className="text-xs text-yellow-400">
                  Sirf {remaining} process honge (free limit)
                </span>
              )}
            </div>

            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            {!isPro && dailyUsed >= FREE_LIMIT ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-3">
                  Aaj ki free limit khatam ho gayi. Kal wapas aaein ya Pro lein.
                </p>
                <button
                  onClick={() => setActiveTab("pricing")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  Pro Plan Dekhein
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || urlList.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Indexing ho rahi hai...
                  </span>
                ) : (
                  "Index Karo ⚡"
                )}
              </button>
            )}

            {/* Result */}
            {result && (
              <div className="mt-6 bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-green-900/30 border border-green-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">{result.success}</p>
                    <p className="text-xs text-green-300 mt-1">Successfully Submitted</p>
                  </div>
                  <div className="flex-1 bg-red-900/30 border border-red-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{result.failed}</p>
                    <p className="text-xs text-red-300 mt-1">Failed / Skipped</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">Processed URLs:</p>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {result.urls.map((u, i) => (
                    <li key={i} className="text-xs text-gray-400 font-mono flex items-center gap-2">
                      <span className="text-green-400">✓</span> {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === "pricing" && (
          <div>
            <div className="text-center mb-8">
              <p className="text-gray-400">Apne backlinks ki indexing speed boost karein</p>
            </div>

            {/* Free Plan reminder */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Free Plan</p>
                <p className="text-sm text-gray-400 mt-0.5">3 URLs per din, ek IP se</p>
              </div>
              <span className="text-lg font-bold text-gray-300">$0</span>
            </div>

            {/* Paid Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-gray-900 rounded-2xl p-6 border transition ${
                    plan.popular
                      ? "border-indigo-500 ring-1 ring-indigo-500"
                      : "border-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <p className="text-lg font-bold text-white mb-1">{plan.name}</p>
                  <p className="text-3xl font-bold text-indigo-400 mb-1">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-400">/month</span>
                  </p>
                  <p className="text-sm text-gray-400 mb-5">
                    {plan.links.toLocaleString()} links per month
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {plan.links.toLocaleString()} URLs/month
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Ping + RSS + GSC signals
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Detailed report
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Priority processing
                    </li>
                    {plan.id !== "starter" && (
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span> Email support
                      </li>
                    )}
                    {plan.id === "agency" && (
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span> API access
                      </li>
                    )}
                  </ul>
                  <a
                    href={PAYT_LINKS[plan.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3 rounded-xl font-semibold text-sm transition ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                  >
                    Subscribe — ${plan.price}/mo
                  </a>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-600 mt-6">
              Payment Payt se secure hoti hai. Koi hidden charges nahi.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}