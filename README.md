# Decentralized Voting Platform (DVP) Setup Guide

To try out the DVP, follow these steps:

### Prerequisites
- [MetaMask Chrome Extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

### Steps

1. **Clone the Repository and Checkout a New Branch**

   ```bash
   mkdir DVP
   cd ./DVP
   git clone https://github.com/mvoyevoda/DecentralizedVotingPlatform.git
   git checkout -b <your-name>

2.	**Open 3 Separate Terminal Tabs**
3.	**Terminal Commands**

    - **Tab 1: Start the Blockchain Node**
      ```bash
      cd ./DVP/Blockchain
      npm install
      npx hardhat node
      ```

    - **Tab 2: Deploy Contracts and Add a Poll**
      ```bash
      npx hardhat ignition deploy ./ignition/modules/DVP.js --network localhost
      npx hardhat run scripts/addPoll.js --network localhost # Create some dummy polls
      ```

    - **Tab 3: Start the Client**
      ```bash
      cd ./DVP/Client
      npm install
      npm run dev
      ```

4. **Connect a test account to MetaMask**

    - Go to **Tab 1** and copy a private key from one of the 20 default test accounts listed in the terminal output
    - Open up a new tab in Chrome
    - Login to MetaMask (Avoid secret phrase, use only password for simplicity)
    - Import a new wallet using the copied private key

5. **Open the DVP in Browser**
   
    - Open [http://localhost:5173/](http://localhost:5173/) in Chrome.
    - You should be prompted by MetaMask to connect your wallet to this site. Confirm the connection

6. **Configure MetaMask for Localhost**

    - Go to **MetaMask settings** and add the localhost network:
      - **Network Name**: localhost
      - **New RPC URL**: http://127.0.0.1:8545
      - **Chain ID**: 31337

You’re all set!
