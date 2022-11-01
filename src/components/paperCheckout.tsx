import { CheckoutWithCard } from "@paperxyz/react-client-sdk";
import { useState } from "react";

interface PaperCheckoutProps {
  account: string | any
  id: number
  cost: number
  method: 'mint' | 'create'
  nftData?: {
    uri: string
    maxSupply: number
  }
}

export const PaperCheckout: React.FC<PaperCheckoutProps> = ({ account, id, cost, method, nftData }) => {
  const methodMint = {
    name: 'mint',
    // update args id
    args: { _to: '$WALLET', _id: id, _amount: 1 },
    // update payment value
    payment: { value: cost.toString(), currency: 'MATIC' }
  };
  const methodCreate = {
    name: 'createCollection',
    // update args id
    args: { _maxSupply: nftData?.maxSupply, _uri: nftData?.uri, _price: cost * 10 ** 18, _creator: account },
    // update payment value
    payment: { value: "0", currency: 'MATIC' }
  };
  const mintMethod = method === 'mint' ? methodMint : methodCreate

  const checkMint = {
    name: 'checkEligibleMint',
    args: {
      _id: id,
      _amount: 1,
    }
  };
  const checkCreate = {
    name: 'checkEligibleCreation',
  };
  const eligibleMethod = method === 'mint' ? checkMint : checkCreate

  // need to fix this to accept correct params, hide api key. Returns sdkClientSecret
  const body = {
    quantity: 1,
    metadata: {},
    expiresInMinutes: 15,
    usePaperKey: false,
    hideApplePayGooglePay: true,
    sendEmailOnTransferSucceeded: true,
    contractId: '9874a294-e880-43b1-a4f5-caa54ffe0f24',
    //pass in account
    walletAddress: account,
    // pass in email, get this somehow...
    email: 'natef@volume.com',
    mintMethod: mintMethod,
    eligibilityMethod: eligibleMethod,
    feeBearer: 'BUYER'
  }
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      // hide this key
      Authorization: `Bearer e3d9e9da-612f-49ee-8058-a7d51eb1374a`
    },
    body: JSON.stringify(body)
  };
  const [clientSecret, setClientSecret] = useState()
  const getClientSecret = () => {
    fetch('https://paper.xyz/api/2022-08-12/checkout-sdk-intent', options)
      .then(response => response.json())
      .then(response => { setClientSecret(response.sdkClientSecret); console.log('response', response.sdkClientSecret)})
      .catch(err => console.error(err));
    // return clientSecret
  }

  return (
    <>
      <button disabled={!account} className="primary" onClick={getClientSecret}>Buy CC</button>
      {clientSecret !== undefined && <div className="fixed z-10 p-2 top-1/3 inset-0 bg-gray-600 bg-opacity-50 h-full w-full">
        <CheckoutWithCard
        sdkClientSecret={clientSecret}
        onPaymentSuccess={(result) => { console.log('success:', result) }}
        onReview={(result) => { console.log('review:', result) }}
        onError={(error) => { console.log('error:', error) }}
        options={{
            colorBackground: '#EFEFEF',
            colorPrimary: '#3204F5',
            colorText: '#000000',
            borderRadius: 16,
        }}
      /></div>}
    </>
  )
}