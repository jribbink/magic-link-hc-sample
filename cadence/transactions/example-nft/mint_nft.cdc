import "ExampleNFT"
import "NonFungibleToken"

transaction() {
    prepare(signer: AuthAccount) {
        // Mint a new NFT and deposit it to the user's collection
        let receiver = signer.getCapability(ExampleNFT.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()!
        ExampleNFT.mintNFT(recipient: receiver)
    }
}