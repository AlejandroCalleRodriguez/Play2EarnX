import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import abi from '@/artifacts/contracts/Play2EarnX.sol/PlayToEarnX.json'
import { GameStruct } from '@/utils/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any /* Transacciones/transactions */

if (typeof window !== 'undefined') ethereum = window.ethereum

const getEthereumContracts = async () => {
    const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

    if (accounts?.length > 0) {
      const provider = new ethers.BrowserProvider(ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(address.playToEarnXContract, abi.abi, signer)
      return contract
    } else {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
      const wallet = ethers.Wallet.createRandom()
      const signer = wallet.connect(provider)
      const contract = new ethers.Contract(address.playToEarnXContract, abi.abi, signer)
      return contract
    }
}

const getGames = async (): Promise<GameStruct[]> => {
    const contract = await getEthereumContracts()
    const games = await contract.getGames()
    return structuredGames(games)
}

const structuredGames = (games: GameStruct[]): GameStruct[] =>
    games.map((game) => ({
        id: Number(game.id),
        title: game.title,
        participants: Number(game.participants),
        numberOfWinners: Number(game.numberOfWinners),
        acceptees: Number(game.acceptees),
        stake: parseFloat(fromWei(game.stake)),
        owner: game.owner,
        description: game.description,
        startDate: Number(game.startDate),
        endDate: Number(game.endDate),
        timestamp: Number(game.timestamp),
        deleted: game.deleted,
        paidOut: game.paidOut,
    }))

export { getGames }
