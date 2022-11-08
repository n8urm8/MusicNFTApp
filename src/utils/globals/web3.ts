import Web3 from "web3";

// this isn't working as intended...
declare global {
  var web3: Web3 | undefined
}

const nodes = [
  // process.env.NEXT_PUBLIC_RPC_PUBLIC1,
  // process.env.NEXT_PUBLIC_RPC_PUBLIC2,
  process.env.NEXT_PUBLIC_RPC_PUBLIC3,
  process.env.NEXT_PUBLIC_RPC_PUBLIC4
]

const getNodeUrl = () => {
  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const randomIndex = randomNumberInRange(0, nodes.length - 1)
  return nodes[randomIndex]
}
const RPC_URL = getNodeUrl()
// @ts-ignore
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 5000 })

/**
 * Provides a web3 instance using our own private provider httpProver
 */
const getWeb3 = () => {
  const web3 = new Web3(httpProvider)

  return web3
}

export { getWeb3, httpProvider };
