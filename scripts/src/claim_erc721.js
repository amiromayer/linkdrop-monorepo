import LinkdropSDK from '../../sdk/src/index'

import ora from 'ora'
import path from 'path'
import { ethers } from 'ethers'
import { terminal as term } from 'terminal-kit'
import { newError, getString } from './utils'

const csvToJson = require('csvtojson')
const queryString = require('query-string')

ethers.errors.setLogLevel('error')

const JSON_RPC_URL = getString('jsonRpcUrl')
const HOST = getString('host')
const RECEIVER_ADDRESS = getString('receiverAddress')

// Get linkdrop parameters
const getUrlParams = async i => {
  const csvFilePath = path.resolve(__dirname, '../output/linkdrop_erc721.csv')

  let jsonArray = await csvToJson().fromFile(csvFilePath)
  let rawUrl = jsonArray[i].url
  let parsedUrl = await queryString.extract(rawUrl)
  let parsed = await queryString.parse(parsedUrl)
  return parsed
}

const claimERC721 = async () => {
  let spinner

  try {
    spinner = ora({
      text: term.bold.green.str('Claiming\n'),
      color: 'green'
    })

    spinner.start()

    const {
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      isApprove
    } = await getUrlParams(1)

    const { error, success, txHash } = await LinkdropSDK.claimERC721({
      jsonRpcUrl: JSON_RPC_URL,
      host: HOST,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: RECEIVER_ADDRESS,
      isApprove
    })

    if (success === true && txHash) {
      spinner.succeed(term.bold.str('Submitted claim transaction'))
      term.bold(`Tx hash: ^g${txHash}\n`)
    } else {
      throw newError(`${error.reason ? error.reason : error}`)
    }
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to claim'))
    throw newError(err)
  }
}

claimERC721()