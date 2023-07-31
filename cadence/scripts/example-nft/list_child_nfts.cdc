import "HybridCustody"
import "ExampleNFT"
import "MetadataViews"

pub fun main(addr: Address): AnyStruct {
  var nftViews = {} as {Address: {UInt64: MetadataViews.Display}} 
  if let manager = getAccount(addr).getCapability(HybridCustody.ManagerPublicPath).borrow<&{HybridCustody.ManagerPublic}>() {
    for address in manager.getChildAddresses() {
      // Only list accounts which have an NFT collection
      if let collection = getAccount(address).getCapability(ExampleNFT.CollectionPublicPath).borrow<&{ExampleNFT.ExampleNFTCollectionPublic}>() {
        var views: {UInt64: MetadataViews.Display} = {}
        for id in collection.getIDs() {
          let nft = collection.borrowExampleNFT(id:id)!
          views[id] = nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
        }
        nftViews[address] = views
      }
    }
  }
  
  return nftViews
}