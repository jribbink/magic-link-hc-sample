import "ExampleNFT"
import "NonFungibleToken"

transaction(target: Address?) {
    prepare(signer: AuthAccount) {
        // Mint a new NFT and deposit it to the user's collection
        var targetAccount: PublicAccount = getAccount(signer.address)
        if target != nil {
            targetAccount = getAccount(target!)
        }
        let receiver = targetAccount.getCapability(ExampleNFT.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()!
        ExampleNFT.mintNFT(recipient: receiver)
    }
}