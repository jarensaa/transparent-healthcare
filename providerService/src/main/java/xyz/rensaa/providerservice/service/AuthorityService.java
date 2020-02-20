package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import xyz.rensaa.providerservice.model.Key;
import xyz.rensaa.providerservice.model.Keystore;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthorityService {

  @Autowired
  private Keystore keystore;

  @Autowired
  private Web3Service web3Service;

  @Autowired
  private List<Credentials> credentials;


  public String getAuthority() {
    var addresses = keystore.keys().stream().map(Key::address).collect(Collectors.toList());
    var actualAccountAddress = credentials.get(0).getAddress();

    var randomBalance = web3Service.getAddressBalance(addresses.get(0));
    var actualAccountBalance = web3Service.getAddressBalance(actualAccountAddress);

    System.out.println(randomBalance);
    System.out.println(actualAccountBalance);

    web3Service.sendEth(credentials.get(0), addresses.get(0), BigDecimal.valueOf(1));

    randomBalance = web3Service.getAddressBalance(addresses.get(0));
    actualAccountBalance = web3Service.getAddressBalance(actualAccountAddress);

    return String.valueOf(randomBalance) + String.valueOf(actualAccountBalance);

  }
}
