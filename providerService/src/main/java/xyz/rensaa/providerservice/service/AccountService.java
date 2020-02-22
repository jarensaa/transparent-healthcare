package xyz.rensaa.providerservice.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import xyz.rensaa.providerservice.model.Keystore;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    @Qualifier("originalCredentials")
    private List<Credentials> credentials;

    @Autowired
    private Keystore keystore;

    public List<String> getRichAccounts() {
        return credentials.stream().map(Credentials::getAddress).collect(Collectors.toList());
    }

    public List<String> getGeneratedAccounts() {
        return keystore.credentials().stream().map(Credentials::getAddress).collect(Collectors.toList());
    }
}
