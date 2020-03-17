package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.stereotype.Service;
import org.web3j.tuples.generated.Tuple5;
import xyz.rensaa.providerservice.Treatment;
import xyz.rensaa.providerservice.contracts.CTreatmentFactory;
import xyz.rensaa.providerservice.dto.ImmutableTreatmentMessage;
import xyz.rensaa.providerservice.dto.TreatmentMessage;
import xyz.rensaa.providerservice.dto.Treatments.*;
import xyz.rensaa.providerservice.exceptions.NoContentException;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;
import xyz.rensaa.providerservice.exceptions.UnauthorizedException;
import xyz.rensaa.providerservice.model.Treatments.TreatmentProposal;
import xyz.rensaa.providerservice.repository.TreatmentProposalRepository;
import xyz.rensaa.providerservice.service.utils.SignatureService;

import javax.xml.bind.DatatypeConverter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class TreatmentService {

  @Autowired
  CTreatmentFactory cTreatmentFactory;

  @Autowired
  LicenseService licenseService;

  @Autowired
  Treatment defaultTreatmentContract;

  @Autowired
  TreatmentProposalRepository treatmentProposalRepository;

  public TreatmentMessage getTreatmentFromAddress(final String address) {
    try {
      final var isInstanced = defaultTreatmentContract.isTreatmentInstanced(address).send();
      if (!isInstanced) throw new NoContentException();

      final var treatmentData = defaultTreatmentContract.getTreatmentData(address).send();
      return ImmutableTreatmentMessage.builder()
          .address(address)
          .approvingLicenseAddress(treatmentData.component1())
          .treatmentProviderAddress(treatmentData.component2())
          .fullDataHash(DatatypeConverter.printHexBinary(treatmentData.component3()))
          .fullDataURL(treatmentData.component4())
          .isSpent(treatmentData.component5())
          .build();

    } catch (final NoContentException e) {
      throw new NoContentException();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<TreatmentMessage> getTreatments() {
    try {
      final var treatmentsData = defaultTreatmentContract.getTreatmentsWithData().send();
      final var numTreatments = treatmentsData.component1().size();

      return IntStream.range(0, numTreatments).mapToObj(i ->
          ImmutableTreatmentMessage.builder()
              .address(treatmentsData.component1().get(i))
              .approvingLicenseAddress(treatmentsData.component2().get(i))
              .treatmentProviderAddress(treatmentsData.component3().get(i))
              .fullDataHash(DatatypeConverter.printHexBinary(treatmentsData.component4().get(i)))
              .fullDataURL(treatmentsData.component5().get(i))
              .isSpent(treatmentsData.component6().get(i))
              .build()
      ).collect(Collectors.toList());
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean createTreatmentProposal(String licenseAddress, TreatmentCreationDTO treatmentCreationDTO) {
    var isTrustedLicense = licenseService.isLicenseTrusted(licenseAddress);
    if(!isTrustedLicense) throw new UnauthorizedException("Address is not a trusted license");

    var tempId = UUID.randomUUID().toString();

    var treatmentProposal = new TreatmentProposal(
            tempId,
            licenseAddress,
            treatmentCreationDTO.patientAddress(),
            treatmentCreationDTO.treatmentDescription());

    treatmentProposalRepository.save(treatmentProposal);
    return true;
  }

  public List<TreatmentPatientInfoDTO> getTreatmentProposalsForPatient(String patientAddress) {
    return treatmentProposalRepository
      .findAllByPatientAddress(patientAddress)
      .stream()
      .map(treatmentProposal -> ImmutableTreatmentPatientInfoDTO.builder()
              .treatmentId(treatmentProposal.getTempId())
              .description(treatmentProposal.getDescription())
              .licenseAddress(treatmentProposal.getLicenseAddress())
              .build()
      ).collect(Collectors.toList());
  }

  public boolean patientApproveTreatment(String patientAddress, TreatmentApprovePatientDTO treatmentApprovePatientDTO) {

    var treatment = treatmentProposalRepository
            .findById(treatmentApprovePatientDTO.treatmentId())
            .orElseThrow(NoContentException::new);

    String dataSignedByTreatmentKey = treatment.getDescription().length() + treatment.getDescription();
    String dataSignedByPatientKey = dataSignedByTreatmentKey +
            treatmentApprovePatientDTO.treatmentAddress().length() +
            treatmentApprovePatientDTO.treatmentAddress();

    boolean treatmentKeySignatureIsValid = SignatureService.verifyEthSignature(
            dataSignedByTreatmentKey,
            treatmentApprovePatientDTO.treatmentKeySignature(),
            treatmentApprovePatientDTO.treatmentAddress());

    boolean patientKeySignatureIsValid = SignatureService.verifyEthSignature(
            dataSignedByPatientKey,
            treatmentApprovePatientDTO.patientKeySignature(),
            patientAddress
    );

    System.out.println("Received treatment patient approval");
    return true;
  }
}
