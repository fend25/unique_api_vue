import {Coin, libs} from '@unique-nft/api'

export const checkEthersBalance = async (rpcLink: string, account: string, coin: Coin) => {
  const ethers = libs.getEthers()

  const rpcProvider = new ethers.providers.JsonRpcProvider(rpcLink)
  // await rpcProvider.getBlockNumber()
  // console.log('chainId', rpcProvider.network.chainId)

  const balance = (await rpcProvider.getBalance(account)).toBigInt()
  const formattedBalance = coin.format(balance)
  return {balance, formattedBalance}
}
