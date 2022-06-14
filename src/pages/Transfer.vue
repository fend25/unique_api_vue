<script setup lang="ts">
import Links from '../components/Links.vue'
import {ref} from 'vue'
import {useInit} from '../srclib'

import {checkEthersBalance} from '../code/checkEthersBalance'
import {Substrate} from "@unique-nft/api";

const count = ref(0)

const {chainRef, ethAccountsRef, requestEthereumAccounts} = useInit()

const checkBalance = async () => {
  if (!ethAccountsRef.value.length) {
    await requestEthereumAccounts()
  }
  console.log(ethAccountsRef.value)
  const result = await checkEthersBalance(
    import.meta.env.VITE_NODE_ETH_A,
    ethAccountsRef.value[0],
    chainRef.value.coin
  )
  console.log('result', result.formattedBalance)
}

const transferCoins = async () => {
  const accounts = await Substrate.extension.getAllAccounts()

  const account = accounts.find(account => account.address === import.meta.env.VITE_ADDRESS_FROM)

  if (!account) throw new Error(`no account found in the extension: ${import.meta.env.VITE_ADDRESS_FROM}`)

  const tx = chainRef.value.transferCoins({
    toAddress: ethAccountsRef.value[0],
    amountInWei: BigInt(Math.ceil(Math.random() * 10 ** 15)) * 1000n + (10n ** 18n),
  })
  const result = await tx.signAndSend(account, {getBlockNumber: true})
  console.log(result)

}

</script>

<template>
  <Links/>
  <h1>Transfer coins</h1>

  <button type="button" @click="checkBalance">Check balance</button>
  <br/><br/>

  <button type="button" @click="transferCoins">Transfer coins</button>
  <br/><br/>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}


</style>


<script lang="ts">
export default {
  name: 'Transfer'
}
</script>
