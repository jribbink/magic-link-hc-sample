import "ExampleNFT"

transaction(withdrawID: UInt64) {
  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
      ?? panic("Could not borrow a reference to the owner's collection")

    let nft <- collection.withdraw(withdrawID: withdrawID)
    destroy nft
  }
}