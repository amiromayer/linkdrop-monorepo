import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import { jsonRpcUrl, claimHost } from 'config'
import configs from 'config-landing'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { networkId } = payload
    const balance = yield select(generator.selectors.balance)
    const assetBalance = yield select(generator.selectors.assetBalance)
    const privateKey = yield select(generator.selectors.privateKey)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const link = yield LinkdropSDK.generateLink({
      jsonRpcUrl,
      networkId,
      host: claimHost,
      linkdropMasterPrivateKey: privateKey,
      weiAmount: balance || 0,
      tokenAddress: tokenAddress || ethersContractZeroAddress,
      tokenAmount: assetBalance || 0,
      expirationTime: configs.expirationTime,
      isApprove: false
    })
    // linkdropMasterPrivateKey or web3 provider for metamask
    // will add later

    yield put({ type: 'USER.SET_LINK', payload: { link: link.url } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  balance: ({ tokens: { balance } }) => balance,
  assetBalance: ({ tokens: { assetBalance } }) => assetBalance,
  privateKey: ({ user: { privateKey } }) => privateKey,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress
}
