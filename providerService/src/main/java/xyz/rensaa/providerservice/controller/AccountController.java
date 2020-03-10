package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.KeyMessage;
import xyz.rensaa.providerservice.service.AccountService;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.Web3Service;

import java.math.BigInteger;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
public class AccountController {

  @Autowired
  private AccountService accountService;

  @Autowired
  private Web3Service web3Service;

  @Autowired
  private KeyRepositoryService keyRepositoryService;

  @GetMapping("/rich")
  public Map<String, String> getRichAccounts() {
    return accountService.getRichAccounts();
  }

  @GetMapping("/generated")
  public Map<String, String> getGeneratedAccounts() {
    return accountService.getGeneratedAccounts();
  }

  @GetMapping("/authority")
  public KeyMessage getAuthorityAccount() {
    return accountService.getAuthorityKey();
  }

  @GetMapping("/{address}/balance")
  public BigInteger isAuthorized(@PathVariable("address") final String address) {
    return web3Service.getAddressBalanceInWei(address);
  }

  @PostMapping("/{address}/send/{amount}")
  public boolean send(@PathVariable("address") final String address,
                      @PathVariable("amount") final String amount,
                      @RequestHeader("Authorization") final String bearerToken) {
    final String privateKey = keyRepositoryService.getKeyFromBearerToken(bearerToken).getPrivateKey();
    web3Service.sendEth(privateKey, address, new BigInteger(amount));
    return true;
  }

  @GetMapping("/valid")
  public boolean isKeyValid(@RequestHeader("Authorization") final String bearerToken) {
    return keyRepositoryService.isValidToken(bearerToken);
  }

  @GetMapping("/create")
  public KeyMessage getNewGeneratedKey() throws Exception {
    return accountService.getNewGeneratedKey();
  }
}
