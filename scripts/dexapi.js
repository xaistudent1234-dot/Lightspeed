// -------------------------
// CONFIG
// -------------------------

// Goal market cap (target value for 100% bar)
const TARGET_MARKETCAP = 299_792_458; // 299.8 million

// Token mint on Solana
const TOKEN_ADDRESS = "2dMHTBnkSPRNqasqwpPfK4wwPxNdgmb1LhrbJ8vGjups";

// Get references to DOM elements
const MARKETCAP_BAR = document.getElementById("marketcap-bar");
const MARKETCAP_TEXT = document.getElementById("marketcap-text");

// -------------------------
// FUNCTION: Fetch market data
// -------------------------
async function fetchMarketData() {
  try {
    // Fetch token data from DexScreener
    const res = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${TOKEN_ADDRESS}`
    );
    const data = await res.json();

    // Extract market cap (fallback to FDV if not present)
    let marketCap = null;
    if (Array.isArray(data) && data.length > 0) {
      marketCap = data[0].marketCap || data[0].fdv;
    } else if (data.marketCap) {
      marketCap = data.marketCap;
    }

    if (!marketCap) {
      throw new Error("Market cap not available");
    }

    // Calculate % progress toward the goal
    let progress = Math.min((marketCap / TARGET_MARKETCAP) * 100, 100);

    // Update text (show in millions, e.g. $123.45m)
    MARKETCAP_TEXT.textContent = `$${(marketCap / 1e6).toFixed(2)}m`;

    // Update progress bar width
    MARKETCAP_BAR.style.width = progress + "%";

  } catch (err) {
    console.error("Error fetching market data:", err);
    MARKETCAP_TEXT.textContent = "Error loading market cap";
  }
}

// -------------------------
// INITIAL RUN + INTERVAL
// -------------------------

// Run once on page load
fetchMarketData();

// Update every 3 hours (1000 ms * 60 sec * 60 min * 3 hr)
setInterval(fetchMarketData, 1000 * 60 * 60 * 3);
