# Vue tools for @unique-nft/api

### Install

```yarn add unique_api_vue```

```npm i unique_api_vue```

### Usage

In your root vue file (usually it's `App.vue`):

```vue
import {useInitProvider} from './srclib'

useInitProvider()
```

In your components call the `useInit` hook:
```vue
import {useInit} from "../srclib";

const {chainRef, ethAccountsRef} = useInit()
```

### Options

`useInitProvider` options:

- `substrateAutoconnectTo?: string` // Substrate node WebSocket URL to autoconnect to 
- `connectToPolkadotExtensionsAs?: string` // app name to provide to polkadot extension-dapp lib
- `initEthereumExtension?: boolean` // autorequest or not ethereum extension

`useInit` options:
`dontCheckOnMount?: boolean` - dont try to invoke init on component mount
