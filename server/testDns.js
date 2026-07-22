const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.keerthi29.k1two91.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS Error:");
      console.error(err);
    } else {
      console.log(addresses);
    }
  }
);