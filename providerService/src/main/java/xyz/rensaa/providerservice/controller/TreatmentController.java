package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.TreatmentMessage;
import xyz.rensaa.providerservice.dto.Treatments.TreatmentApprovePatientDTO;
import xyz.rensaa.providerservice.dto.Treatments.TreatmentCreationDTO;
import xyz.rensaa.providerservice.dto.Treatments.TreatmentPatientInfoDTO;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.TreatmentService;

import java.util.List;

@RestController
@RequestMapping("/treatments")
public class TreatmentController {

  @Autowired
  TreatmentService treatmentService;

  @Autowired
  KeyRepositoryService keyRepositoryService;

  @GetMapping
  public List<TreatmentMessage> getTreatments() {
    return treatmentService.getTreatments();
  }

  @GetMapping("/{address}")
  public TreatmentMessage getTreatmentByAddress(@PathVariable("address") final String address) {
    return treatmentService.getTreatmentFromAddress(address);
  }

  @GetMapping("/proposals")
  public List<TreatmentPatientInfoDTO> getPatientTreatments(@RequestHeader("Authorization") final String bearerToken) {
    var patientAddress = keyRepositoryService.getPatientAddressFromBearerToken(bearerToken);
    return treatmentService.getTreatmentProposalsForPatient(patientAddress);
  }

  @PostMapping("/create")
  public boolean createTreatment(@RequestBody TreatmentCreationDTO treatmentCreationDTO,
                                 @RequestHeader("Authorization") final String bearerToken) {
    var licenseAddress = keyRepositoryService.getKeyFromBearerToken(bearerToken).getAddress();
    return treatmentService.createTreatmentProposal(licenseAddress, treatmentCreationDTO);
  }

  @PostMapping("/proposals")
  public boolean patientApproveTreatment(@RequestBody TreatmentApprovePatientDTO approvePatientDTO,
                                         @RequestHeader("Authorization") final String bearerToken) {
    var patientAddress = keyRepositoryService.getPatientAddressFromBearerToken(bearerToken);
    return treatmentService.patientApproveTreatment(patientAddress,approvePatientDTO);
  }

}
