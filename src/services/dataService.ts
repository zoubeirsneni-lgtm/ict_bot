import { Candle } from '../types';

export class DataService {
  private socket: WebSocket | null = null;
  private onMessageCallback: (candle: Candle) => void;
  private symbol: string;

  constructor(symbol: string, onMessage: (candle: Candle) => void) {
    this.symbol = symbol.toLowerCase();
    this.onMessageCallback = onMessage;
  }

  start() {
    const streamUrl = `wss://stream.binance.com:9443/ws/${this.symbol}@kline_1m`;
    this.socket = new WebSocket(streamUrl);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const k = data.k;
      
      const candle: Candle = {
        time: k.t / 1000,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v)
      };

      if (k.x) { // Candle closed
        this.onMessageCallback(candle);
      }
    };

    this.socket.onerror = (err) => console.error('WebSocket Error:', err);
    this.socket.onclose = () => {
      console.log('WebSocket closed, reconnecting...');
      setTimeout(() => this.start(), 3000);
    };
  }

  stop() {
    if (this.socket) {
      this.socket.close();
    }
  }

  async fetchHistory(symbol: string): Promise<Candle[]> {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=100`);
    const data = await response.json();
    return data.map((d: any) => ({
      time: d[0] / 1000,
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5])
    }));
  }
}
