package xyz.rensaa.providerservice.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import xyz.rensaa.providerservice.dto.ContractAddresses;
import xyz.rensaa.providerservice.dto.ImmutableKeyMessage;
import xyz.rensaa.providerservice.dto.KeyMessage;
import xyz.rensaa.providerservice.dto.Keystore;
import xyz.rensaa.providerservice.model.KeyAuthorization;
import xyz.rensaa.providerservice.repository.KeyAuthorizationRepository;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    @Qualifier("originalCredentials")
    private List<Credentials> credentials;

    @Autowired
    private Web3Service web3Service;

    @Autowired
    private Keystore keystore;

    @Autowired
    private KeyAuthorizationRepository keyAuthorizationRepository;

    @Autowired
    private ZoneOffset zoneOffset;

    public Map<String, String> getRichAccounts() {
        return credentials.stream()
            .map(Credentials::getAddress)
            .collect(Collectors.toMap(s-> s, s -> Double.toString(web3Service.getAddressBalance(s))));
    }

    public Map<String, String> getGeneratedAccounts() {
        return keystore.credentials().stream()
            .map(Credentials::getAddress)
            .collect(Collectors.toMap(s -> s, s -> Double.toString(web3Service.getAddressBalance(s))));
    }

    public KeyMessage getAuthorityKey() {
        var creds = credentials.get(0);
        var timestamp = Instant.now().atOffset(zoneOffset);
        var token = UUID.randomUUID().toString();
        var privateKey = "0x" + creds.getEcKeyPair().getPrivateKey().toString(16);

        var authorization = new KeyAuthorization(token,creds.getAddress(),privateKey, timestamp);
        keyAuthorizationRepository.save(authorization);

        return ImmutableKeyMessage.builder()
            .token(token)
            .address(creds.getAddress())
            .build();
    }

}
