import "ExampleNFT"

pub fun main(address: Address): Bool {
  if getAuthAccount(address).borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath) != nil {
    return true
  }
  return false
}