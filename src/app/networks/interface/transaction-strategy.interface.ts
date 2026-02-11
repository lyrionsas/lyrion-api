import { TransactionData } from "./transaction-data.interface";

export interface TransactionStrategy {
  getApiUrl(): string;
  validateTransaction(data: TransactionData): Promise<any>;
  getTransactionByHash(hash: string): Promise<any>;
}
