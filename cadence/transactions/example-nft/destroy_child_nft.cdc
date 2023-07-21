import "ExampleNFT"
import "HybridCustody"

transaction(childAddress: Address, id: UInt64) {
  prepare(acct: AuthAccount) {
    let manager = acct.getCapability<&{HybridCustody.ManagerPrivate}>(HybridCustody.ManagerPrivatePath).borrow()!
    let child = manager.borrowAccount(addr: childAddress)!.getCapability(path: ExampleNFT.CollectionStoragePath, type: Type<&ExampleNFT.Collection>())?.borrow()!


  }
}

/*

    let collection = getAccount(address).getCapability(ExampleNFT.CollectionPublicPath).borrow<&{ExampleNFT.Collection>()!
    var views: {UInt64: MetadataViews.Display} = {}
    for id in collection.getIDs() {
      let nft = collection.borrowExampleNFT(id:id)!
      views[id] = nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
    }
    nftViews[address] = views

    return nftViews
 */