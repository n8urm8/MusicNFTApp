import { CheckoutWithCard } from "@paperxyz/react-client-sdk";
import { useState } from "react";

export const PaperCheckout = ({ account, id }) => {
  // need to fix this to accept correct params, hide api key. Returns sdkClientSecret
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      // hide this key
      Authorization: 'Bearer e3d9e9da-612f-49ee-8058-a7d51eb1374a'
    },
    body: JSON.stringify({
      quantity: 1,
      metadata: {},
      expiresInMinutes: 15,
      usePaperKey: false,
      hideApplePayGooglePay: true,
      sendEmailOnTransferSucceeded: true,
      contractId: 'f3a6fbe2-a394-41b6-9b38-49f01ef79bae',
      //pass in account
      walletAddress: account,
      // pass in email, get this somehow...
      email: 'email@fix.this',
      mintMethod: {
        name: 'mint',
        // update args id
        args: { _to: '$WALLET', _id: id, _amount: 1 },
        // update payment value
        payment: {value: '0.001' , currency: 'MATIC'}
      },
      feeBearer: 'BUYER'
    })
  };
  const [clientSecret, setClientSecret] = useState()
  const getClientSecret = () => {
    fetch('https://paper.xyz/api/2022-08-12/checkout-sdk-intent', options)
      .then(response => response.json())
      .then(response => setClientSecret(response.toString()))
      .catch(err => console.error(err));
    // return clientSecret
  }

  return (
    <>
      <button onClick={getClientSecret}>Generate Intent</button>
      {clientSecret !== undefined && <CheckoutWithCard
        sdkClientSecret={clientSecret}
        onPaymentSuccess={(result) => { console.log('success:', result) }}
        onReview={(result) => { console.log('review:', result) }}
        onError={(error) => { console.log('error:', error) }}
        options={{
            colorBackground: '#121212',
            colorPrimary: '#19A8D6',
            colorText: '#f0f0f0',
            borderRadius: 15,
        }}
      />}
    </>
  )
}