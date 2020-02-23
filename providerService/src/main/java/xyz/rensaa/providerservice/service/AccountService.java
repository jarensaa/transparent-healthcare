package xyz.rensaa.providerservice.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import xyz.rensaa.providerservice.dto.ContractAddresses;
import xyz.rensaa.providerservice.model.Keystore;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    @Qualifier("originalCredentials")
    private List<Credentials> credentials;

    @Autowired
    private Web3Service web3Service;

    @Autowired
    ContractAddresses contractAddresses;

    @Autowired
    private Keystore keystore;

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
}
