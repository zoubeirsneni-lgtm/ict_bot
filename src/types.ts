/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum SignalType {
  BULLISH_MSS = 'BULLISH_MSS',
  BEARISH_MSS = 'BEARISH_MSS',
  BULLISH_FVG = 'BULLISH_FVG',
  BEARISH_FVG = 'BEARISH_FVG',
  BULLISH_OB = 'BULLISH_OB',
  BEARISH_OB = 'BEARISH_OB'
}

export interface ICTPattern {
  id: string;
  type: SignalType;
  price: number;
  time: number;
  metadata?: any;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'CALL' | 'PUT';
  entryPrice: number;
  amount: number;
  expiryTime: number;
  status: 'OPEN' | 'WIN' | 'LOSS';
  timestamp: number;
  settlementPrice?: number;
}

export interface RiskSettings {
  stake: number;
  expirySeconds: number;
  maxDailyLoss: number;
}
