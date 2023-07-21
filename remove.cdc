transaction() {
  prepare(acct: AuthAccount) {
    acct.capabilities.unpublish(/public/MinterPublicPath)
  }
}