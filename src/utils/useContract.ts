import { useEffect, useState } from "react";
import { AbiItem } from "web3-utils";

export const useContract = (abi: any, address: string, web3: any) => {
  const [contract, setContract] = useState<any>()

  useEffect(() => {
    setContract(new web3.eth.Contract(abi as unknown as AbiItem, address))
  }, [abi, address, web3])

  return contract
}

