import { Candle, ICTPattern, SignalType } from '../types';

export class ICTService {
  private static readonly FVG_MIN_SIZE_RATIO = 0.0005; // 0.05% of price

  static detectFVG(candles: Candle[]): ICTPattern[] {
    if (candles.length < 3) return [];
    
    const patterns: ICTPattern[] = [];
    
    for (let i = 2; i < candles.length; i++) {
      const c1 = candles[i - 2];
      const c2 = candles[i - 1];
      const c3 = candles[i];

      // Bullish FVG (Gap between C1 High and C3 Low)
      if (c3.low > c1.high) {
        const gapSize = c3.low - c1.high;
        if (gapSize > c2.open * this.FVG_MIN_SIZE_RATIO) {
          patterns.push({
            id: `fvg-bull-${c2.time}`,
            type: SignalType.BULLISH_FVG,
            price: (c3.low + c1.high) / 2,
            time: c2.time,
            metadata: { bottom: c1.high, top: c3.low }
          });
        }
      }

      // Bearish FVG (Gap between C1 Low and C3 High)
      if (c3.high < c1.low) {
        const gapSize = c1.low - c3.high;
        if (gapSize > c2.open * this.FVG_MIN_SIZE_RATIO) {
          patterns.push({
            id: `fvg-bear-${c2.time}`,
            type: SignalType.BEARISH_FVG,
            price: (c3.high + c1.low) / 2,
            time: c2.time,
            metadata: { bottom: c3.high, top: c1.low }
          });
        }
      }
    }
    
    return patterns;
  }

  static detectMSS(candles: Candle[]): ICTPattern | null {
    if (candles.length < 10) return null;

    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    
    // Simple Swing detection
    const findsSwingHigh = (idx: number) => {
      const c = candles[idx];
      return c.high > candles[idx - 1].high && c.high > candles[idx + 1].high;
    };

    const findsSwingLow = (idx: number) => {
      const c = candles[idx];
      return c.low < candles[idx - 1].low && c.low < candles[idx + 1].low;
    };

    // Look for Bullish MSS: Break of recent Swing High
    for (let i = candles.length - 5; i > 5; i--) {
      if (findsSwingHigh(i)) {
        const swingHigh = candles[i].high;
        if (prev.close < swingHigh && last.close > swingHigh) {
          return {
            id: `mss-bull-${last.time}`,
            type: SignalType.BULLISH_MSS,
            price: swingHigh,
            time: last.time
          };
        }
        break;
      }
    }

    // Look for Bearish MSS: Break of recent Swing Low
    for (let i = candles.length - 5; i > 5; i--) {
      if (findsSwingLow(i)) {
        const swingLow = candles[i].low;
        if (prev.close > swingLow && last.close < swingLow) {
          return {
            id: `mss-bear-${last.time}`,
            type: SignalType.BEARISH_MSS,
            price: swingLow,
            time: last.time
          };
        }
        break;
      }
    }

    return null;
  }

  static detectOrderBlocks(candles: Candle[]): ICTPattern[] {
     // Implementation of OB detection logic
     // Usually the opposite candle before a break of structure
     return [];
  }
}
