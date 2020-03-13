package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.ECDSASignature;
import org.web3j.crypto.Hash;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;
import xyz.rensaa.providerservice.exceptions.UnauthorizedException;
import xyz.rensaa.providerservice.model.PatientKeyRegistration;
import xyz.rensaa.providerservice.model.PatientKeyRegistrationChallenge;
import xyz.rensaa.providerservice.repository.PatientKeyChallengeRepository;
import xyz.rensaa.providerservice.repository.PatientKeyRepository;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.UUID;

@Service
public class PatientRegistationService {

    @Autowired
    PatientKeyChallengeRepository patientKeyChallengeRepository;

    @Autowired
    PatientKeyRepository patientKeyRepository;

    public static final String PERSONAL_MESSAGE_PREFIX = "\u0019Ethereum Signed Message:\n";

    public String getAccessToken() {
        return UUID.randomUUID().toString();
    }

    public String getChallenge(String accessToken) {
        var challenge = UUID.randomUUID().toString();
        var challengeEntity = new PatientKeyRegistrationChallenge(accessToken,challenge);
        patientKeyChallengeRepository.save(challengeEntity);
        return challenge;
    }

    public void verifySignature(String challenge, String signature, String address) {
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
        String prefix = PERSONAL_MESSAGE_PREFIX + challenge.length();

        byte[] challengeBytes = Hash.sha3((prefix + challenge).getBytes(StandardCharsets.UTF_8));

        var hex = Numeric.toHexString(challengeBytes);

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
                    return;
                }
            }
        }
        throw new UnauthorizedException();
    }

    public String registerKey(String accessToken, String challangeSignature, String address) {
        var challengeOptional  = patientKeyChallengeRepository.findById(accessToken);
        if (challengeOptional.isEmpty()) throw new UnauthorizedException();
        var challenge = challengeOptional.get().getChallenge();

        verifySignature(challenge, challangeSignature, address.toLowerCase());
        var token = UUID.randomUUID().toString();
        var keyEntry = new PatientKeyRegistration(address, token);
        patientKeyRepository.save(keyEntry);
        return token;
    }
}
