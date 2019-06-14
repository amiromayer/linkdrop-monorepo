/* global CONFIG */
import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-demo'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
let factory
let claimHost
try {
  factory = CONFIG.factory
  claimHost = CONFIG.claimHost
} catch (e) {
  factory = require('config').factory
  claimHost = require('config').claimHost
}
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId, provider } = payload
    const balance = yield select(generator.selectors.balance)
    const assetBalance = yield select(generator.selectors.assetBalance)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const masterAddress = yield select(generator.selectors.masterAddress)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const version = yield factoryContract.getProxyMasterCopyVersion(masterAddress)
    const link = yield LinkdropSDK.generateLinkWeb3({
      provider,
      chainId,
      host: claimHost,
      weiAmount: balance || 0,
      tokenAddress: tokenAddress || ethersContractZeroAddress,
      tokenAmount: assetBalance || 0,
      expirationTime: configs.expirationTime,
      isApprove: 'false',
      version: String(version.toNumber())
    })

    yield put({ type: 'USER.SET_LINK', payload: { link: link.url } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['ERROR_WITH_SIGNATURE_OCCURED'] } })
  }
}

export default generator
generator.selectors = {
  balance: ({ tokens: { balance } }) => balance,
  assetBalance: ({ tokens: { assetBalance } }) => assetBalance,
  privateKey: ({ user: { privateKey } }) => privateKey,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress,
  masterAddress: ({ user: { masterAddress } }) => masterAddress
}
