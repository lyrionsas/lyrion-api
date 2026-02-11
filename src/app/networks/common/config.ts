import { BlockchainEnum } from "src/enums/Blockchain.enum";


export const TRON_API_URL = "https://apilist.tronscanapi.com/api";
export const TRON_ENDPOINT = {
  getListTransactions: `${TRON_API_URL}/transaction`,
  getTransactionInfoByHash: `${TRON_API_URL}/transaction-info`,
};

export const STRATEGIES = {
  [BlockchainEnum.TRC20]: "TronStrategy",
  [BlockchainEnum.ERC20]: "EthereumStrategy",
};
