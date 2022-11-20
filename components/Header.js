import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
    return (
        <div className="p-3 border-b-2 flex flex-row">
            <h1 className="p-4 font-bold text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-3 px-3">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}