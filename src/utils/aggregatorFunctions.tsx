

export const purchaseCollectible = (id: number, wallet: string, purchasedAmount: number) => {
  fetch(`/api/collections/${id}?owner=${wallet}&purchasedAmount=${purchasedAmount}`, {
    method: 'POST'
  })
    //.then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err))
}

export const loadCollectible = (id, name, coverArt, audio, description, maxSupply, purchasedAmount, price, artistId) => {
  fetch(`/api/collections?`)
}