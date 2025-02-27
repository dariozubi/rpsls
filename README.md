# Rock, Paper, Scissors, Lizard, Spock for Ethereum

This dapp allows you to play RPSLS on the Sepolia testnet network.

To play you need a MetaMask wallet with some Sepolia ETH and just follow the instructions.

## How it works?

### Step 1

When you first interact with the dapp you need to connect your wallet and then fill a form to challenge another wallet. This deploys a contract that sets you as the `player1`, sets the value you send as the `stake` and sets the `player2` as the address you send. The contract's bytecode to deploy comes from a [hardhat repo](https://github.com/dariozubi/rpsls-contract) that you can also use for local development (more on that below).

To deploy the contract, there's a numerical value generated for the salt. This value is stored in local storage and also shown to the user once the contract is deployed. It's needed to finalize the game. If the user uses the same device to finalize the game, the value won't be asked for. Else, the user needs to input the `salt` value.

Once the contract is deployed, you get a link that you can send to your opponent so they can make the next move. This link contains a `contract` param with the value of the deployed contract.

If you go to the link you'll see a screen informing you that your opponent hasn't made a move. If your opponent takes more time than the timeout (set at 5 minutes) to respond, you can press a timeout button (only shown after the time passed).

### Step 2

Your opponent goes to the link you send them and makes their move.

If you take more time than the timeout (set at 5 minutes) to respond, your opponent can press a timeout button (only shown after the time passed).

### Step 3

You go to the same link and finalize the game. After the transaction succeeds you see a screen that says that the game is over and the stake is transfered to whomever won.

## Development

You can try this code locally using Hardhat's node.

First install the dependencies:

```bash
npm install
```

Then add an `.env.local` file with the value:

```
NEXT_PUBLIC_CHAIN="hardhat"
```

Get the [contract's repo](https://github.com/dariozubi/rpsls-contract), install the dependencies and run:

```bash
npx hardhat node
```

Then you can run this dapp locally with:

```bash
npm run dev
```
