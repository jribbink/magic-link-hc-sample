import "ExampleNFT"
import "NonFungibleToken"
import "MetadataViews"

transaction() {
  prepare(acct: AuthAccount) {
    // Create a Collection resource and save it to storage
    let collection <- ExampleNFT.createEmptyCollection()
    acct.save(<-collection, to: ExampleNFT.CollectionStoragePath)

    // create a public capability for the collection
    acct.link<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, ExampleNFT.ExampleNFTCollectionPublic, MetadataViews.ResolverCollection}>(
        ExampleNFT.CollectionPublicPath,
        target: ExampleNFT.CollectionStoragePath
    )

    // create a private capability for the collection
    acct.link<&ExampleNFT.Collection>(
        ExampleNFT.CollectionPrivatePath,
        target: ExampleNFT.CollectionStoragePath
    )
  }
}