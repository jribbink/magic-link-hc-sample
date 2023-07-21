import "HybridCustody"

pub fun main(address: Address): Bool {
  let acct = getAuthAccount(address)
  if acct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath) == nil {
      return false
  }
  return true
}