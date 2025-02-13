import axios from 'axios';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const BLOCKCHAIN_API_BASE = 'https://blockchain.info';

export interface MarketData {
  cryptoPrice: number;
  miningMarketValue: number;
  networkDifficulty: number;
  lastUpdated: string;
}

// Add detailed logging for API calls
const logApiCall = (endpoint: string, data: any) => {
  console.log(`[API Call] ${new Date().toISOString()}`);
  console.log(`Endpoint: ${endpoint}`);
  console.log('Response:', data);
};

export async function fetchMarketData(): Promise<MarketData> {
  try {
    console.log('[Market Data] Fetching fresh market data...');
    
    // Fetch Bitcoin price and market data from CoinGecko
    const priceEndpoint = `${COINGECKO_API_BASE}/simple/price?ids=bitcoin&vs_currencies=usd`;
    console.log(`[CoinGecko] Fetching BTC price from ${priceEndpoint}`);
    const priceResponse = await axios.get(priceEndpoint);
    logApiCall(priceEndpoint, priceResponse.data);

    const marketEndpoint = `${COINGECKO_API_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=daily`;
    console.log(`[CoinGecko] Fetching market data from ${marketEndpoint}`);
    const marketResponse = await axios.get(marketEndpoint);
    logApiCall(marketEndpoint, marketResponse.data);

    const difficultyEndpoint = `${BLOCKCHAIN_API_BASE}/q/getdifficulty`;
    console.log(`[Blockchain.info] Fetching network difficulty from ${difficultyEndpoint}`);
    const difficultyResponse = await axios.get(difficultyEndpoint);
    logApiCall(difficultyEndpoint, difficultyResponse.data);

    const btcPrice = priceResponse.data.bitcoin.usd;
    const marketValue = marketResponse.data.prices[0][1] / btcPrice;
    const networkDifficulty = difficultyResponse.data;

    const marketData = {
      cryptoPrice: btcPrice,
      miningMarketValue: marketValue,
      networkDifficulty: networkDifficulty,
      lastUpdated: new Date().toISOString()
    };

    console.log('[Market Data] Processed market data:', marketData);
    return marketData;
  } catch (error) {
    console.error('[Market Data] Error fetching market data:', error);
    throw error;
  }
}

// Cache market data for 5 minutes
let cachedMarketData: MarketData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getMarketData(): Promise<MarketData> {
  const now = Date.now();
  
  if (!cachedMarketData || (now - lastFetchTime) > CACHE_DURATION) {
    console.log('[Market Data] Cache expired or empty, fetching fresh data...');
    try {
      cachedMarketData = await fetchMarketData();
      lastFetchTime = now;
      console.log('[Market Data] Cache updated at:', new Date(lastFetchTime).toISOString());
    } catch (error) {
      if (cachedMarketData) {
        console.warn('[Market Data] Using expired cache due to fetch error');
        return cachedMarketData;
      }
      throw error;
    }
  } else {
    console.log('[Market Data] Using cached data from:', new Date(lastFetchTime).toISOString());
  }
  
  return cachedMarketData;
} 