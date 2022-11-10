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
