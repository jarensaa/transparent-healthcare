package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.rensaa.providerservice.dto.KeyMessage;
import xyz.rensaa.providerservice.service.AccountService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

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
}
