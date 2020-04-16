package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.Treatment;
import xyz.rensaa.providerservice.dto.Evaluation.EvaluatedTreatmentDTO;
import xyz.rensaa.providerservice.dto.Evaluation.ImmutableEvaluatedTreatmentDTO;
import xyz.rensaa.providerservice.dto.Evaluation.ImmutablePractitionerViewDTO;
import xyz.rensaa.providerservice.dto.Evaluation.PractitionerViewDTO;
import xyz.rensaa.providerservice.dto.KeyRegistrationDto;
import xyz.rensaa.providerservice.dto.License;
import xyz.rensaa.providerservice.dto.Treatments.TreatmentContractDataDTO;
import xyz.rensaa.providerservice.service.*;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    PatientRegistationService patientRegistationService;

    @Autowired
    KeyRepositoryService keyRepositoryService;

    @Autowired
    LicenseService licenseService;

    @Autowired
    TreatmentService treatmentService;

    @Autowired
    EvaluationService evaluationService;

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

    @GetMapping("/licenses")
    public List<PractitionerViewDTO> getLicensesInfo() {
        var licenses = licenseService.getLicenses();
        return licenses.stream().map(this::getPracitionerView).collect(Collectors.toList());
    }

    @GetMapping("/licenses/{address}")
    public PractitionerViewDTO getLicenseInfo(@RequestParam("address") String address) {
        var license = licenseService.getLicenseFromAddress(address);
        return getPracitionerView(license);
    }

    private PractitionerViewDTO getPracitionerView(License license) {
        var treatments = treatmentService.getTreatmentContractDataForLicense(license.address());
        var unevaluatedTreatments = new ArrayList<TreatmentContractDataDTO>();
        var evaluatedTreatments = new ArrayList<EvaluatedTreatmentDTO>();

        treatments.forEach(treatmentContractDataDTO -> {
            var evaluation = evaluationService.getEvaluationOfTreatment(treatmentContractDataDTO.address());
            evaluation.ifPresentOrElse(
                    evaluationDTO -> evaluatedTreatments.add(ImmutableEvaluatedTreatmentDTO.builder()
                        .evaluationDto(evaluationDTO)
                        .treatment(treatmentContractDataDTO)
                        .build()),
                    () -> unevaluatedTreatments.add(treatmentContractDataDTO)
                );
        });

        return ImmutablePractitionerViewDTO.builder()
                .license(license)
                .unevaluatedTreatments(unevaluatedTreatments)
                .evaluatedTreatment(evaluatedTreatments)
                .build();

    }
}
