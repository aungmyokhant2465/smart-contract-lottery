import Head from 'next/head'
import Header from '../components/Header'
import LotteryEntrace from '../components/LotteryEntrance'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Raffle</title>
        <meta name="description" content="My Smart Contract Raffle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
      <h2 className="font-bold my-3 text-xl">Description and note</h2>
        <article className="my-3">
          <h3 className="font-semibold text-lg">What is it?</h3>
          <p>
            It is a lottery program. You can enter this program and test your luck by paying entrance fee (0.01ETH). If you want to test, switch the network to <strong>Goerli test network</strong> in your wallet.
          </p>
          <p>
            If number of players is more than <em>14</em>, it will automatically select <em>three winners</em>. Otherwise, there is only <em>one winner</em>.
          </p>
        </article>
        <article className="my-3">
          <h3 className="font-semibold text-lg">Differentiation</h3>
          <p>
            <em>Do not trust anyone including me.</em>
          </p>
          <p>
            Technically, It is a smart contract, build on <strong>Goerli Testnet Blockchain</strong>. So it is really really <strong>decentralized</strong>.
          </p>
        </article>
        <article className="my-3">
          <h3 className="font-semibold text-lg"><em>Important!!!</em></h3>
          <p><em>Do not make any transaction on <strong>Ethereum Mainnet</strong>.</em></p>
        </article>
      </main>
      <LotteryEntrace />
    </div>
  )
}
