"use strict";

const Config = {
    defaultServer: 'https://europe.signum.network',
    SmartContractId: 738377637144987047n,
    authorisedCodeHash: 13623170965212595266n,
    assetId: "9518219425200752102", 
    assetId_2: "9381200141252723234",
    serverAlternatives: [
        "https://brazil.signum.network",
        "https://uk.signum.network",
        "https://cryptodefrag.com:8125",
        "https://europe.signum.network",
        "https://australia.signum.network",
        "https://signawallet.notallmine.net"
    ],
    MinerContractArgs: {
        feePlanck: '20000000',
        activationAmountPlanck: '15000000000',
        description: "This A1 smart contract issues and sells a VGB token. This is a virtual HDD token for mining Zethereum #ZTH",
        name: "ZStoreVGB",
        referencedTransactionHash: "TokenSellerContractContext.ReferenceHash.Mainnet",
    }
}

const Picker = {
    tokenId: 0n,
    currentTX: {
        txId: 0n,
        baseDeadline: 0n,
        sender: 0n,
        miningIntensity: 0n,
    },
    best: {
        deadline: 0n,
        sender: 0n,
    },
    stats: {
        overallMiningFactor: 0n,
        lastOverallMiningFactor: 0n,
        processedDeadlines: 0n,
        currentHeight: 0n,
        lastWinnerId: 0n,
        lastWinnerDeadline: 0n,
    },
    processTX: {
        miningFactor: 0n,
        currentDeadline: 0n,
    },
    forgeTokens: {
        lastForging: 0n,
        currentBlock: 0n,
    },
    distributeBalance: {
        currentAvailableBalance: 0n,
    }
}

const Global = {
    server: '',
    fetchingData: false,
    signumJSAPI: undefined,
    wallet: undefined,
    walletResponse: undefined,
    walletSubscription: undefined,
    UserContract: undefined
}

window.addEventListener('wallet-event', (event) => {
    const {payload, action} = event.detail

    if (action === 'connected') {
      document.querySelector('#account-connection span').innerText = payload.address
      const avatar = document.querySelector('#account-connection img')
      avatar.src = window.hashicon(payload.accountId, 64).toDataURL()
      document.getElementById('successful-connection').classList.remove("is-hidden")
      document.getElementById('network').innerText = payload.host;
    }

    if (action === 'disconnected') {
      document.getElementById('successful-connection').classList.add("is-hidden")
      document.getElementById('connect-button-text').innerText = 'Connect Wallet'
      document.querySelector('#connect-button-icon span').classList.remove('is-hidden');
      const avatar = document.querySelector('#connect-button-icon img')
      avatar.src = ""
      avatar.classList.add('is-hidden');
    }

    if (action === 'accountChanged') {
      document.querySelector('#account-connection span').innerText = payload.address
      const avatar = document.querySelector('#account-connection img')
      avatar.src = window.hashicon(payload.accountId, 64).toDataURL()
    }

    if (action === 'networkChanged') {
      document.getElementById('network').innerText = payload.nodeHost;
    }

  })
}

async function sendTestMessage() {
  try {

    if (!window.signumLedger) {
      throw new Error("Ledger Client not initialized");
    }

    const link = document.getElementById('transaction-link')
    link.classList.add('is-hidden')
    const {unsignedTransactionBytes} = await window.signumLedger.message.sendMessage({
      senderPublicKey: walletConnection.publicKey,
      recipient: walletConnection.accountId, // send to self
      message: "If you can read this message, then you successfully sent the message with XT Vanilla Demo App",
      messageIsText: true,
      feePlanck: sig$util.Amount.fromSigna('0.01').getPlanck()
    })
    const tx = await window.wallet.confirm(unsignedTransactionBytes)
    link.classList.remove('is-hidden')
    link.setAttribute('href', `https://t-chain.signum.network/tx/${tx.transactionId}`)
  } catch (e) {
    alert(e.message)
  }
}
