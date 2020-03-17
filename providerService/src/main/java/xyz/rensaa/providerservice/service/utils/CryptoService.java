package xyz.rensaa.providerservice.service.utils;

import org.web3j.crypto.ECDSASignature;
import org.web3j.crypto.Hash;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class CryptoService {

    public static final String PERSONAL_MESSAGE_PREFIX = "\u0019Ethereum Signed Message:\n";

    // We must apply the prefix from the spec here: https://web3js.readthedocs.io/en/v1.2.6/web3-eth-accounts.html#sign
    public static byte[] getPackedEthHash(String data) {
        String prefix = PERSONAL_MESSAGE_PREFIX + data.length();
        return Hash.sha3((prefix + data).getBytes(StandardCharsets.UTF_8));
    }

    public static boolean verifyEthSignature(String data, String signature, String rawAddress) {
        var address = rawAddress.toLowerCase();
        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);

        byte v = signatureBytes[64];
        if (v < 27) {
            v += 27;
        }

        var signatureData = new Sign.SignatureData(
                v,
                Arrays.copyOfRange(signatureBytes, 0, 32),
                Arrays.copyOfRange(signatureBytes, 32, 64));

        // We must apply the prefix from the spec here: https://web3js.readthedocs.io/en/v1.2.6/web3-eth-accounts.html#sign
        String prefix = PERSONAL_MESSAGE_PREFIX + data.length();

        byte[] challengeBytes = Hash.sha3((prefix + data).getBytes(StandardCharsets.UTF_8));

        for (int i = 0; i < 4; i++) {
            var recoveredPublicKey = Sign.recoverFromSignature(
                    (byte) i,
                    new ECDSASignature(
                            new BigInteger(1, signatureData.getR()),
                            new BigInteger(1, signatureData.getS())),
                    challengeBytes);

            if (recoveredPublicKey != null) {
                var addressRecovered = "0x" + Keys.getAddress(recoveredPublicKey);

                if (addressRecovered.equals(address)) {
                    return true;
                }
            }
        }
        return false;
    }

}
