import { takeEvery } from 'redux-saga/effects'

import prepareNewERC20Data from './every/prepare-new-erc20-data'
import prepareNewEthData from './every/prepare-new-eth-data'
import proceedPayment from './every/proceed-payment'
import resetData from './every/reset-data'
import save from './every/save'
import getCSV from './every/get-csv'

export default function * () {
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW_ERC20_DATA', prepareNewERC20Data)
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW_ETH_DATA', prepareNewEthData)
  yield takeEvery('*CAMPAIGNS.PROCEED_PAYMENT', proceedPayment)
  yield takeEvery('*CAMPAIGNS.SAVE', save)
  yield takeEvery('*CAMPAIGNS.RESET_DATA', resetData)
  yield takeEvery('*CAMPAIGNS.GET_CSV', getCSV)
}
