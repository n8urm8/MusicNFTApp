import { useState } from "react";

interface PaperCheckoutProps {
  account: string | any
  id: number
}

export const PaperCheckoutLink: React.FC<PaperCheckoutProps> = ({ account, id }) => {
  // need to fix this to accept correct params, hide api key. Returns sdkClientSecret
  const body = {
    quantity: 1,
    metadata: {},
    title: 'collectible purchase',
    eligibilityMethod: {
      name: 'checkEligible',
      args: {
        _id: id,
        _amount: 1,
      }
    },
    expiresInMinutes: 15,
    usePaperKey: false,
    hideNativeMint: false,
    hidePaperWallet: false,
    hideExternalWallet: false,
    hidePayWithCard: false,
    hidePayWithCrypto: false,
    hideApplePayGooglePay: true,
    sendEmailOnTransferSucceeded: true,
    contractId: '0067a342-beec-45a3-866f-bd4dcabc2c74',
    //pass in account
    walletAddress: account,
    // pass in email, get this somehow...
    email: 'natef@volume.com',
    mintMethod: {
      name: 'mint',
      args: { _to: '$WALLET', _id: id, _amount: 1 },
      payment: {value: '0.001' , currency: 'MATIC'}
    },
    feeBearer: 'BUYER'
  }
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer e3d9e9da-612f-49ee-8058-a7d51eb1374a`
    },
    body: JSON.stringify(body)
  };
  const [clientSecret, setClientSecret] = useState()
  const getClientSecret = () => {
    fetch('https://paper.xyz/api/2022-08-12/checkout-link-intent', options)
      .then(response => response.json())
      .then(response => { setClientSecret(response.sdkClientSecret); console.log('response', response.sdkClientSecret)})
      .catch(err => console.error(err));
    // return clientSecret
  }

  return (
    <>
      <button disabled={!account} onClick={getClientSecret}>Paper Checkout</button>
      
    </>
  )
}