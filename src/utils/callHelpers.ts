export const createCollection = async (contract, account, maxSupply, uri, price) => {
  return contract.methods.createCollection(maxSupply, uri, price)
    .send({ from: account, gas: 240000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
export const mint = async (contract, account, to, id, amount, price) => {
  return contract.methods.mint(to, id, amount)
    .send({ from: account, value: price, gas: 100000 })
    .on('transactionHash', (tx) => { 
      return tx.transactionHash })
}