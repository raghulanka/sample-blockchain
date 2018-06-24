const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        // include a reward for the miner
        // push the reward transaction as part of the block
        // create a block consisting of valid transactions
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
        );
        
        const block = this.blockchain.addBlock(validTransactions);
        
        // synchronize chains in the peer-to-peer server
        this.p2pServer.syncChains();

        // clear the transaction pool
        this.transactionPool.clear();
        
        // broadcast to very miner to clear thier transaction pools
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;