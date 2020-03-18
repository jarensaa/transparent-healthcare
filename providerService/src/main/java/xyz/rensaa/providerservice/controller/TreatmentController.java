package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.Treatments.*;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.TreatmentService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/treatments")
public class TreatmentController {

  @Autowired
  TreatmentService treatmentService;

  @Autowired
  KeyRepositoryService keyRepositoryService;

  @GetMapping
  public List<TreatmentContractDataDTO> getTreatments() {
    return treatmentService.getTreatments();
  }

  @GetMapping("/{address}")
  public Optional<TreatmentContractDataDTO> getTreatmentByAddress(@PathVariable("address") final String address) {
    return treatmentService.getTreatmentFromAddress(address);
  }

  @PostMapping("/{address}/license/approve")
  public boolean licenseApproveTreatment(@PathVariable("address") final String address,
                                         @RequestHeader("Authorization") final String bearerToken) {
    var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return treatmentService.licenseApproveTreatment(keyPair.getPrivateKey(), address);
  }

  @GetMapping("/patient")
  public List<TreatmentCombinedDataDTO> getTreatmentsForPatient(
          @RequestHeader("Authorization") final String bearerToken) {
    var address = keyRepositoryService.getPatientAddressFromBearerToken(bearerToken);
    return treatmentService.getTreatmentsForPatient(address);
  }

  @GetMapping("/proposals")
  public List<TreatmentPatientInfoDTO> getPatientTreatmentProposals(
          @RequestHeader("Authorization") final String bearerToken) {
    var patientAddress = keyRepositoryService.getPatientAddressFromBearerToken(bearerToken);
    return treatmentService.getTreatmentProposalsForPatient(patientAddress);
  }

  @GetMapping("/license")
  public List<TreatmentCombinedDataDTO> getTreatmentsForLicense(
          @RequestHeader("Authorization") final String bearerToken) {
    var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return treatmentService.getTreatmentsForLicense(keyPair.getAddress());
  }

  @PostMapping("/create")
  public boolean createTreatment(@RequestBody TreatmentCreationDTO treatmentCreationDTO,
                                 @RequestHeader("Authorization") final String bearerToken) {
    var licenseAddress = keyRepositoryService.getKeyFromBearerToken(bearerToken).getAddress();
    return treatmentService.createTreatmentProposal(licenseAddress, treatmentCreationDTO);
  }

  @PostMapping("/proposals/approve")
  public boolean patientApproveTreatment(@RequestBody TreatmentApprovePatientDTO approvePatientDTO,
                                         @RequestHeader("Authorization") final String bearerToken) {
    var patientAddress = keyRepositoryService.getPatientAddressFromBearerToken(bearerToken);
    return treatmentService.patientApproveTreatment(patientAddress,approvePatientDTO);
  }

}
