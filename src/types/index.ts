export interface UserSubmission {
  id: string;
  name: string;
  level: number;
  term: "I" | "II";
  dept: string;
  email: string;
  finalPassword?: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameRule {
  id: number;
  text: string;
  isActive: boolean;
  validator: (password: string, gameState: GameState) => boolean;
  errorMessage?: string;
  getText?: (gameState: GameState) => string;
}

export interface GameState {
  currentRule: number;
  password: string;
  isOnFire: boolean;
  fireInterval?: NodeJS.Timeout;
  tanbirSayemHatched: boolean;
  tanbirSayemFeedingInterval?: NodeJS.Timeout;
  wormCount: number;
  forbiddenLetters: string[];
  userSubmission: UserSubmission | null;
  rules: GameRule[];
}
