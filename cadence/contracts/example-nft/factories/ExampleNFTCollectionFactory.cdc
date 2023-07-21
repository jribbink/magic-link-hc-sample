import "CapabilityFactory"
import "ExampleNFT"

pub contract ExampleNFTCollectionFactory {
    pub struct Factory: CapabilityFactory.Factory {
        pub fun getCapability(acct: &AuthAccount, path: CapabilityPath): Capability {
            return acct.getCapability<&ExampleNFT.Collection>(path)
        }
    }
}