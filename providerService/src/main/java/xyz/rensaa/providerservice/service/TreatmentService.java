package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.utils.Convert;
import xyz.rensaa.providerservice.LicenseProvider;
import xyz.rensaa.providerservice.Treatment;
import xyz.rensaa.providerservice.contracts.CTreatmentFactory;
import xyz.rensaa.providerservice.dto.Treatments.*;
import xyz.rensaa.providerservice.exceptions.NoContentException;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;
import xyz.rensaa.providerservice.exceptions.UnauthorizedException;
import xyz.rensaa.providerservice.model.Treatments.TreatmentData;
import xyz.rensaa.providerservice.model.Treatments.TreatmentDataBuilder;
import xyz.rensaa.providerservice.model.Treatments.TreatmentLicenseAssignment;
import xyz.rensaa.providerservice.model.Treatments.TreatmentProposal;
import xyz.rensaa.providerservice.repository.TreatmentDataRepository;
import xyz.rensaa.providerservice.repository.TreatmentLicenseAssignmentRepository;
import xyz.rensaa.providerservice.repository.TreatmentProposalRepository;
import xyz.rensaa.providerservice.repository.TreatmentProviderHireRepository;
import xyz.rensaa.providerservice.service.utils.CryptoService;

import javax.xml.bind.DatatypeConverter;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class TreatmentService {

  @Autowired
  CTreatmentFactory cTreatmentFactory;

  @Autowired
  LicenseService licenseService;

  @Autowired
  Treatment defaultTreatmentContract;

  @Autowired
  LicenseProvider defaultLicenseProviderContract;

  @Autowired
  TreatmentProposalRepository treatmentProposalRepository;

  @Autowired
  TreatmentProviderHireRepository treatmentProviderHireRepository;

  @Autowired
  TreatmentDataRepository treatmentDataRepository;

  @Autowired
  TreatmentLicenseAssignmentRepository treatmentLicenseAssignmentRepository;

  @Autowired
  KeyRepositoryService keyRepositoryService;

  @Autowired
  Web3Service web3Service;

  @Autowired
  ContractGasProvider contractGasProvider;

  @Value("services.treatmentprovider.hostname")
  String hostname;

  public Optional<TreatmentContractDataDTO> getTreatmentFromAddress(final String address) {
    try {
      final var isInstanced = defaultTreatmentContract.isTreatmentInstanced(address).send();
      if (!isInstanced) return Optional.empty();

      final var treatmentData = defaultTreatmentContract.getTreatmentData(address).send();
      return Optional.of(ImmutableTreatmentContractDataDTO.builder()
          .address(address)
          .approvingLicenseAddress(treatmentData.component1())
          .treatmentProviderAddress(treatmentData.component2())
          .fullDataHash(DatatypeConverter.printHexBinary(treatmentData.component3()))
          .fullDataURL(treatmentData.component4())
          .isSpent(treatmentData.component5())
          .build());

    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<TreatmentContractDataDTO> getTreatments() {
    try {
      List<String> treatmentAddresses = defaultTreatmentContract.getTreatmentAddresses().send();

      return treatmentAddresses.stream()
              .map(this::getTreatmentFromAddress)
              .filter(Optional::isPresent)
              .map(Optional::get)
              .collect(Collectors.toList());

    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<TreatmentCombinedDataDTO> getTreatmentsForPatient(final String patientAddress) {
    var fullTreatments = treatmentDataRepository.findAllByPatientAddress(patientAddress);

    return fullTreatments.stream()
            .map(treatmentData -> ImmutableTreatmentFullDataDTO.builder()
              .treatmentKeySignature(treatmentData.getTreatmentKeySignature())
              .patientKeySignature(treatmentData.getPatientKeySignature())
              .patientAddress(treatmentData.getPatientAddress())
              .address(treatmentData.getTreatmentAddress())
              .fullDescription(treatmentData.getFullDescription())
              .build())
            .map(fullTreatmentDataDTO -> {
              var contractData = getTreatmentFromAddress(fullTreatmentDataDTO.address());
              return ImmutableTreatmentCombinedDataDTO.builder()
                      .treatmentAddress(fullTreatmentDataDTO.address())
                      .fullData(fullTreatmentDataDTO)
                      .contractData(contractData)
                      .build();
            }).collect(Collectors.toList());
  }

  public List<TreatmentContractDataDTO> getTreatmentContractDataForLicense(final String licenseAddress) {
    try {
      List<String> treatmentAddresses = defaultTreatmentContract.getTreatmentsForLicense(licenseAddress).send();

      return treatmentAddresses.stream()
              .map(this::getTreatmentFromAddress)
              .filter(Optional::isPresent)
              .map(Optional::get)
              .collect(Collectors.toList());
    } catch (Exception e){
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<TreatmentCombinedDataDTO> getTreatmentsForLicense(final String licenseAddress) {

    // First, find all treatments assigned to the license
    var treatmentsAssignedToLicense  = treatmentLicenseAssignmentRepository
            .findAllByLicenseAddress(licenseAddress)
            .stream()
            .map(TreatmentLicenseAssignment::getTreatmentAddress)
            .map(String::toLowerCase)
            .collect(Collectors.toSet());

    // Find all treatments on the blockchain signed by the license, or assigned to it.
    var treatmentsOnBlockchain = getTreatments();
    var treatmentsRelevantToLicense =  treatmentsOnBlockchain.stream()
            .filter(treatmentContractDataDTO ->
                    treatmentContractDataDTO.approvingLicenseAddress().equals(licenseAddress) ||
                            treatmentsAssignedToLicense.contains(treatmentContractDataDTO.address())
            )
            .collect(Collectors.toList());

    var relevantAddressesSet = treatmentsRelevantToLicense.stream()
            .map(TreatmentContractDataDTO::address)
            .collect(Collectors.toSet());

    var fullDataMap = treatmentDataRepository
            .findAllById(relevantAddressesSet).stream()
            .collect(Collectors.toMap(TreatmentData::getTreatmentAddress, t -> t));

    return treatmentsRelevantToLicense.stream().map(treatmentContractDataDTO -> {
        var fullData = fullDataMap.getOrDefault(treatmentContractDataDTO.address(), null);
        Optional<TreatmentFullDataDTO> fullDataDTO = Optional.empty();
        if (fullData != null ) {
          fullDataDTO = Optional.of(ImmutableTreatmentFullDataDTO.builder()
                  .address(fullData.getTreatmentAddress())
                  .fullDescription(fullData.getFullDescription())
                  .patientAddress(fullData.getPatientAddress())
                  .patientKeySignature(fullData.getPatientKeySignature())
                  .treatmentKeySignature(fullData.getTreatmentKeySignature())
                  .build()
          );
        }
        return ImmutableTreatmentCombinedDataDTO.builder()
                .contractData(treatmentContractDataDTO)
                .fullData(fullDataDTO)
                .treatmentAddress(treatmentContractDataDTO.address())
                .build();
    }).collect(Collectors.toList());
  }

  public boolean createTreatmentProposal(String licenseAddress, TreatmentCreationDTO treatmentCreationDTO) {
    var isTrustedLicense = licenseService.isLicenseTrusted(licenseAddress);
    if(!isTrustedLicense) throw new UnauthorizedException("Address is not a trusted license");

    var tempId = UUID.randomUUID().toString();

    var treatmentProviderHire = treatmentProviderHireRepository
            .findById(treatmentCreationDTO.treatmentProviderToken())
            .orElseThrow(UnauthorizedException::new);

    var treatmentProposal = new TreatmentProposal(
            tempId,
            licenseAddress.toLowerCase(),
            treatmentCreationDTO.patientAddress().toLowerCase(),
            treatmentCreationDTO.treatmentDescription(),
            treatmentProviderHire.getProviderKeyToken());

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
            treatmentApprovePatientDTO.treatmentAddress().toLowerCase();

    boolean treatmentKeySignatureIsValid = CryptoService.verifyEthSignature(
            dataSignedByTreatmentKey,
            treatmentApprovePatientDTO.treatmentKeySignature(),
            treatmentApprovePatientDTO.treatmentAddress());

    boolean patientKeySignatureIsValid = CryptoService.verifyEthSignature(
            dataSignedByPatientKey,
            treatmentApprovePatientDTO.patientKeySignature(),
            patientAddress
    );

    if (!treatmentKeySignatureIsValid || !patientKeySignatureIsValid) {
      throw new UnauthorizedException("Invalid signatures");
    }

    var treatmentProviderKey = keyRepositoryService.getKeyFromToken(treatment.getTreatmentProviderToken());
    var treatmentContractInstance = cTreatmentFactory.fromPrivateKey(treatmentProviderKey.getPrivateKey());

    var dataHash = CryptoService.getPackedEthHash(treatment.getDescription());

    var transactionUpfrontCost = contractGasProvider.getGasLimit().multiply(contractGasProvider.getGasPrice());

    try {

      var isLicenseStillTrusted = defaultLicenseProviderContract.isLicenseTrusted(treatment.getLicenseAddress()).send();
      if (!isLicenseStillTrusted) throw new UnauthorizedException("Issuing license is not trusted anymore.");

      treatmentContractInstance.createTreatment(
              treatmentApprovePatientDTO.treatmentAddress(),
              dataHash,
              hostname).send();
      var treatmentData = new TreatmentDataBuilder()
              .setTreatmentAddress(treatmentApprovePatientDTO.treatmentAddress().toLowerCase())
              .setPatientAddress(patientAddress.toLowerCase())
              .setFullDescription(treatment.getDescription())
              .setPatientKeySignature(treatmentApprovePatientDTO.patientKeySignature())
              .setTreatmentKeySignature(treatmentApprovePatientDTO.treatmentKeySignature())
              .build();
      var licenseAssignment = new TreatmentLicenseAssignment(
              treatmentApprovePatientDTO.treatmentAddress().toLowerCase(),
              treatment.getLicenseAddress().toLowerCase());
      treatmentDataRepository.save(treatmentData);
      treatmentProposalRepository.deleteById(treatment.getTempId());
      treatmentLicenseAssignmentRepository.save(licenseAssignment);

      web3Service.sendEth(treatmentProviderKey.getPrivateKey(),
              treatmentApprovePatientDTO.treatmentAddress(),
              transactionUpfrontCost);
    } catch (Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException("Failed to create treatment: " + e.getMessage());
    }

    return true;
  }

  public boolean licenseApproveTreatment(String licensePrivateKey, String treatmentAddress) {
    try {
      cTreatmentFactory.fromPrivateKey(licensePrivateKey).approveTreatment(treatmentAddress).send();
      return true;
    } catch (Exception e){
      throw new TransactionFailedException(e.getMessage());
    }
  }
}
