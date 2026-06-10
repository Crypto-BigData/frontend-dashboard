export type Signal = {
  id: string;
  ticker: string;
  type: string;
  confidence: number | null;
  detectedAt: string | null;
  detectedAtMs: number | null;
  metadata: Record<string, unknown>;
};

export type RawSignal = {
  id?: string | number | null;
  ticker?: string | null;
  symbol?: string | null;
  type?: string | null;
  signalType?: string | null;
  confidence?: string | number | null;
  detectedAt?: string | number | null;
  timestamp?: string | number | null;
  createdAt?: string | number | null;
  openTime?: string | number | null;
  metadata?: Record<string, unknown> | null;
};
