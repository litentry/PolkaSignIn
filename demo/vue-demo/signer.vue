<template>
  <div>
    hello
    <div class="btn-test" @click="testSigner">test sign</div>

    <div v-for="a in allAccounts" :key="a.address">
      {{ a }}
    </div>
    <div v-for="g in logs" :key="g">
      <br />
      {{ g }}
    </div>
  </div>
</template>

<script>
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import {
  cryptoWaitReady,
  decodeAddress,
  signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";

export default {
  data() {
    return {
      allAccounts: {},
      logs: [],
    };
  },
  mounted() {},
  methods: {
    clearLog() {
      this.logs.length = 0;
    },
    pushLog(log) {
      this.logs.push(new Date().toISOString() + " " + log);
    },
    hexDecode(hex) {
      var j;
      var hexes = hex.match(/.{1,4}/g) || [];
      var back = "";
      for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
      }
      return back;
    },
    hexEncode(str) {
      var hex, i;

      var result = "";
      for (i = 0; i < str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
      }

      return result;
    },
    async testSigner() {
      this.clearLog();
      const extensions = await web3Enable("my cool dapp");
      console.log(extensions);
      const allAccounts = await web3Accounts();
      this.allAccounts = allAccounts;
      if (this.allAccounts.length) {
        const account = allAccounts[0];
        this.pushLog("account address:" + account.address);

        // to be able to retrieve the signer interface from this account
        // we can use web3FromSource which will return an InjectedExtension type
        const injector = await web3FromSource(account.meta.source);
        // this injector object has a signer and a signRaw method
        // to be able to sign raw bytes
        const signRaw = injector?.signer?.signRaw;

        if (signRaw) {
          // after making sure that signRaw is defined
          // we can use it to sign our message
          let accountAddress = account.address;
          let message = accountAddress;
          message = "challenge message at 20210-11-21 10:00:00";
          this.pushLog("message to sign:" + message);

          const { signature } = await signRaw({
            address: accountAddress,
            data: message,
          });

          this.pushLog("message signature:" + signature);

          const isValid = await this.isValidSignature(
            message,
            signature,
            accountAddress
          );
          this.pushLog("message isValidSignature:" + isValid);

          //fake account
          let messageFake = accountAddress + "_fake";
          this.pushLog("message fake:" + messageFake);

          const isValid_fake = await this.isValidSignature(
            messageFake,
            signature,
            accountAddress
          );
          this.pushLog("message fake isValidSignature:" + isValid_fake);
        }
      }
    },
    async isValidSignature(signedMessage, signature, address) {
      await cryptoWaitReady();
      const publicKey = decodeAddress(address);
      const hexPublicKey = u8aToHex(publicKey);
      console.log(signedMessage);
      console.log(signature);
      console.log(hexPublicKey);
      let isValid = signatureVerify(
        signedMessage,
        signature,
        hexPublicKey
      ).isValid;

      console.log("isValidSignature:", isValid);
      return isValid;
    },
  },
};
</script>

<style>
.btn-test {
  padding: 5px 10px;
  border: solid 1px #ccc;
  width: 80px;
  margin: 10px 10px;
  cursor: pointer;
  background: #ccc;
}
.btn-test:hover {
  background: #ddd;
}
</style>
