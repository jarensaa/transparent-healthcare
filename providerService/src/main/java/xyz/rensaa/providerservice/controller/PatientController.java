package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.KeyRegistrationDto;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.PatientRegistationService;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    PatientRegistationService patientRegistationService;

    @Autowired
    KeyRepositoryService keyRepositoryService;

    @GetMapping("/token")
    public String getToken() {
        return patientRegistationService.getAccessToken();
    }

    @GetMapping("/challenge")
    public String getChallange(@RequestHeader("Authorization") final String bearerToken) {
        var token = keyRepositoryService.getTokenPartOfBearerToken(bearerToken);
        return patientRegistationService.getChallenge(token);
    }

    @PostMapping("/registerkey")
    public String registerKey(@RequestHeader("Authorization") final String bearerToken,
                              @RequestBody final KeyRegistrationDto keyRegistrationDto) {
        var token = keyRepositoryService.getTokenPartOfBearerToken(bearerToken);
        return patientRegistationService.registerKey(
                token,
                keyRegistrationDto.challangeSignature(),
                keyRegistrationDto.address()
        );
    }

    @GetMapping("/validkey")
    public boolean isKeyValid(@RequestHeader("Authorization") final String bearerToken) {
        return keyRepositoryService.isValidPatientToken(bearerToken);
    }
}
