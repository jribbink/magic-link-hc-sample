import "ExampleNFT"
import "MetadataViews"

pub fun main(address: Address) : AnyStruct {
  let collection = getAccount(address).getCapability(ExampleNFT.CollectionPublicPath).borrow<&{ExampleNFT.ExampleNFTCollectionPublic}>()!

  var res : {UInt64:AnyStruct} = {}
  for id in collection.getIDs() {
    res[id] = collection.borrowNFT(id:id).resolveView(Type<MetadataViews.Display>())!
  }
  return res
}

