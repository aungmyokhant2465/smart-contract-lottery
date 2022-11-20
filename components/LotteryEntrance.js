import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract, Moralis } from 'react-moralis'
import { abi, contractAddresses } from '../constants/index'
import { ethers } from 'ethers'
import { useNotification } from '@web3uikit/core'
import { Bell } from '@web3uikit/icons'

export default function LotteryEntrace () {
    const dispatch = useNotification()
    const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0]: null
    const [ raffleState, setRaffleState ] = useState(0)
    const [ entranceFee, setEntranceFee ] = useState(0)
    const [ numPlayers, setNumPlayers ] = useState(0)
    const [ recentWinners, setRecentWinners ] = useState([])

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}
    })
    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumPlayers",
        params: {}
    })
    const { runContractFunction: getRecentWinners } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinners",
        params: {}
    })
    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })
    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRaffleState",
        params: {}
    })

    const updateUIValues = async () => {
        if(!raffleAddress) {
            dispatch({
                type: "error",
                message: "Check your wallet network",
                title: "Network Error",
                position: "topR",
                icon: <Bell />
            })
            return
        }
        setEntranceFee((await getEntranceFee()).toString())
        setNumPlayers((await getNumPlayers()).toString())
        setRecentWinners(await getRecentWinners())
        setRaffleState((await getRaffleState()))
    }

    useEffect(() => {
        if(isWeb3Enabled) {
            updateUIValues()
            listenForWinnerToBePicked()
        }
    }, [isWeb3Enabled])

    async function listenForWinnerToBePicked(){
        if(!raffleAddress) return
        const raffle = new ethers.Contract(raffleAddress, abi, web3)
        console.log("Waiting for a winner ...");
        await new Promise((resolve, reject) => {
            raffle.on("WinnerPicked", async() => {
                console.log("We got a winner!");
                try {
                    await updateUIValues();
                    resolve();
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUIValues()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: <Bell />
        })
    }

    return (
        <div className='p-5'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto'     
                onClick={async () => {
                    await enterRaffle({
                        onError: (error) => { console.log(error) },
                        onSuccess: handleSuccess
                    })
                }}
                disabled={isLoading || isFetching || raffleState}
            >  
                {
                    isLoading || isFetching || raffleState ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        <div>Enter Raffle</div>
                    )
                }
            </button>
            <div>
                <div>Lottery Entrace Fee : {ethers.utils.formatUnits(entranceFee, "ether")}</div>
                <div>Number Of Players: {numPlayers}</div>
                <div>
                    <h3>Recent Winners</h3>
                    <ul>
                        {
                            recentWinners.map((recentWinner, index) => (
                                <li key={index}>{recentWinner}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}