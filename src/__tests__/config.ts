export default {
  assetData: {
    eth: {
      blockchain: 'eth',
      hash: '0000000000000000000000000000000000000000',
      precision: 8
    },
    gas: {
      blockchain: 'neo',
      hash: '602C79718B16E442DE58778E148D0B1084E3B2DFFD5DE6B7B16CEE7969282DE7',
      precision: 8
    },
    neo: {
      blockchain: 'neo',
      hash: 'C56F33FC6ECFCD0C225C4AB356FEE59390AF8560BE0E930FAEBE74A6DAFF7C9B',
      precision: 8
    }
  },
  marketData: {
    gas_neo: {
      minTickSize: 2,
      minTradeSize: 6
    },
    neo_eth: {
      minTickSize: 6,
      minTradeSize: 2
    }
  },
  wallets: {
    eth: {
      address: '5f8b6d9d487c8136cc1ad87d6e176742af625de8',
      privateKey: '99ed2f77373431e4052690dd23d72854737f2a7b12b12c6330f6a68ec071a430',
      publicKey:
        '04d37f1a8612353ffbf20b0a68263b7aae235bd3af8d60877ed8135c27630d895894885f220a39acab4e70b025b1aca95fab1cd9368bf3dc912ef32dc65aecfa02'
    },
    neo: {
      address: 'Aet6eGnQMvZ2xozG3A3SvWrMFdWMvZj1cU',
      privateKey: '7146c0beb313d849809a263d3e112b7c14801c381ddc8b793ab751d451886716',
      publicKey: '039fcee26c1f54024d19c0affcf6be8187467c9ba4749106a4b897a08b9e8fed23'
    }
  }
}
