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
import xyz.rensaa.providerservice.service.utils.SignatureService;

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

    public String getAccessToken() {
        return UUID.randomUUID().toString();
    }

    public String getChallenge(String accessToken) {
        var challenge = UUID.randomUUID().toString();
        var challengeEntity = new PatientKeyRegistrationChallenge(accessToken,challenge);
        patientKeyChallengeRepository.save(challengeEntity);
        return challenge;
    }

    public String registerKey(String accessToken, String challangeSignature, String address) {
        var challengeOptional  = patientKeyChallengeRepository.findById(accessToken);
        if (challengeOptional.isEmpty()) throw new UnauthorizedException();
        var challenge = challengeOptional.get().getChallenge();

        var isSignatureValid = SignatureService.verifyEthSignature(challenge, challangeSignature, address);
        if(!isSignatureValid) throw new UnauthorizedException("Invalid signature");
        var token = UUID.randomUUID().toString();
        var keyEntry = new PatientKeyRegistration(address, token);
        patientKeyRepository.save(keyEntry);
        return token;
    }
}
