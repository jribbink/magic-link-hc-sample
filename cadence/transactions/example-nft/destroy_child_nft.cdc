import "ExampleNFT"
import "HybridCustody"

transaction(childAddress: Address, id: UInt64) {
  prepare(acct: AuthAccount) {
    let manager = acct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)!
    let child = manager.borrowAccount(addr: childAddress)!
    let capability = child.getCapability(path: ExampleNFT.CollectionPrivatePath, type: Type<&ExampleNFT.Collection>())!
    let collection = capability.borrow<&ExampleNFT.Collection>()!

    let nft <- collection.withdraw(withdrawID: id)
    destroy nft
  }
}