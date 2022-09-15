import {init, Substrate, Ethereum, SubstrateUnique, libs, InjectedAccountWithMeta} from '@unique-nft/api'
import * as uniqueNftApi from '@unique-nft/api'

import {useAsyncWrapper} from './hooks'
import {shallowRef, onMounted, provide, inject, InjectionKey, ShallowRef} from 'vue'

export function createInjectionState<Arguments extends Array<any>, Return>(
    composable: (...args: Arguments) => Return,
): readonly [useProvidingState: (...args: Arguments) => void, useInjectedState: () => Return | undefined] {
  const key: string | InjectionKey<Return> = Symbol('InjectionState')
  const useProvidingState = (...args: Arguments) => {
    provide(key, composable(...args))
  }
  const useInjectedState = () => inject(key)
  return [useProvidingState, useInjectedState]
}

const requestEthereumAccounts = async (ethAccountsRef: ShallowRef) => {
  ethAccountsRef.value = await Ethereum.extension.requestAccounts()
}

export interface InitProviderOptions {
  substrateNodeWsUrl: string
  substrateAutoconnect?: boolean
  connectToPolkadotExtensionsAs?: string
  initEthereumExtension?: boolean
}
const [useInitProvider, __use_init] = createInjectionState((options: InitProviderOptions) => {
  const chainRef = shallowRef<SubstrateUnique>(new Substrate.Unique())
  const substrateNodeWsUrlRef = shallowRef<string>(options.substrateNodeWsUrl)
  const ethAccountsRef = shallowRef<string[]>([])
  const subAccountsRef = shallowRef<InjectedAccountWithMeta[]>([])

  const initTask = useAsyncWrapper(async () => {
    await init()
    if (options?.connectToPolkadotExtensionsAs) {
      await Substrate.extension.connectAs(options?.connectToPolkadotExtensionsAs)
      subAccountsRef.value = await Substrate.extension.getAllAccounts()
    }

    if (typeof window !== 'undefined' && window.ethereum?.isConnected) {
      const {extensionFound, accounts} = await Ethereum.extension.safeGetAccounts()
      if (extensionFound) {
        if (accounts.length) {
          ethAccountsRef.value = accounts
        } else {
          if (options?.initEthereumExtension) {
            await requestEthereumAccounts(ethAccountsRef)
          }
        }
      }
    }

    if (options?.substrateAutoconnect) {
      await chainRef.value.connect(substrateNodeWsUrlRef.value)
    }
  })

  return {
    initTask, chainRef, ethAccountsRef, subAccountsRef, providerOptions: options
  }
})
export {useInitProvider}

export interface InitOptions {
  dontCheckOnMount?: boolean
}
export const useInit = (options?: InitOptions) => {
  const {initTask, ethAccountsRef, chainRef, providerOptions, subAccountsRef} =  __use_init()!

  const check = async() => {
    if (!initTask.isResolved) {
      await initTask.run()
    }
    if (initTask.isRejected) {
      throw initTask.error
    }
  }
  if (!options?.dontCheckOnMount) onMounted(check)

  return {
    ethAccountsRef,
    subAccountsRef,
    chainRef,
    initTask,
    libs,
    uniqueNftApi,
    utils: uniqueNftApi,
    async requestEthereumAccounts() {
      return await requestEthereumAccounts(ethAccountsRef)
    },
    async connectToSubstrate() {
      await chainRef.value.connect(providerOptions.substrateNodeWsUrl)
    }
  }
}
