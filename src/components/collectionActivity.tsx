import { useEffect, useMemo, useState } from "react"
import Web3 from "web3"
import { AbiItem } from "web3-utils"
import nftABI from '../utils/ABIs/mediaNFT.json'
import { NFTManagerAddress, startBlock } from "../utils/contractAddresses"

const web3Provider = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai.g.alchemy.com/v2/v9tZMbd55QG9TpLMqrkDc1dQIzgZazV6'))

const contract = new web3Provider.eth.Contract(nftABI as unknown as AbiItem, NFTManagerAddress)

interface ActivityProps {
  id: number
}

interface TxProps {
  activity: string
  originator: string
  date: string
  txnHash: string
}

export const CollectionActivity: React.FC<ActivityProps> = ({ id }) => {
  const [txs, setTxs] = useState<TxProps[]>([])


  const sortEvent = (activity, originator, date, txnHash) => {
    let addtx = true;

    txs.forEach(tx => { if (tx.txnHash === txnHash) { addtx = false } })
    if (addtx) {
      setTxs(prev => [
        {
          activity,
          originator,
          date,
          txnHash
        },
        ...prev
      ])
    }
  }


  useMemo(() => {
    let items;
    const fetchOldEvents = async () => {
      items = await contract.getPastEvents('allEvents', {
        // filter: { tokenID: id },
        fromBlock: startBlock,
        toBlock: 'latest',
      }, function (error, events) { if(error) console.error(error); })
      items.forEach(e => {
        if (e.event === 'CollectionCreated') {
          if (e.returnValues.tokenID === id.toString()) {
            sortEvent(e.event, e.returnValues.creator, e.blockNumber, e.transactionHash)
          }
        }
        if (e.event === 'TransferSingle') {
          if (e.returnValues.id === id.toString()) {
            if (e.returnValues.from === "0x0000000000000000000000000000000000000000") {
              sortEvent('Purchase', e.returnValues.to, e.blockNumber, e.transactionHash)
            } else {
              sortEvent('Transfer', e.returnValues.from, e.blockNumber, e.transactionHash);
            }
          }
        }
      })
    }
    fetchOldEvents()
  }, [id]) 


  return (
    <div className="w-full border border-gray-300 rounded-2xl flex flex-col p-2 gap-2">
      <div className="semiBold dark grid grid-cols-5 justify-items-start">
        <p className="col-span-2">Event</p>
        <p className="col-span-2">User</p>
        <p className="col-span-1">Date</p>
      </div>
      {txs?.map((t, i) => {
        return (
          <ActivityRow key={i} activity={t.activity} originator={t.originator} date={t.date} txnHash={t.txnHash} />
        )
      })}
    </div>
  )
}

const ActivityRow: React.FC<TxProps> = ({ activity, originator, date, txnHash }) => {

  const polygonScanURL = `https://mumbai.polygonscan.com/tx/${txnHash}`

  const getTimestamp = (date) => {
    const [timestamp, setTimestamp] = useState<string | number>()
    useEffect(() => {
      async function fetch() {
        const blocktime = await web3Provider.eth.getBlock(date);
        setTimestamp(blocktime.timestamp)
      }
      fetch()
    })
    return timestamp
  }

  const timestamp = getTimestamp(date)
  const dateString = new Date(Number(timestamp)*1000).toLocaleDateString()

  return (
    <div className="grid grid-cols-5 justify-items-start ml-2">
      <div className="col-span-2"><a href={polygonScanURL} target="_blank" rel="noreferrer noopener">{activity}</a></div>
      <div className="col-span-2">{originator.slice(0,10)}...</div>
      <div className="col-span-1">{dateString}</div>
    </div>

  )
}