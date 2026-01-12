
export interface AppleData {
  id: string;
  value: number;
  isMatched: boolean;
}

export interface GameState {
  grid: AppleData[];
  score: number;
  selectedIndices: number[];
  isProcessing: boolean;
}
