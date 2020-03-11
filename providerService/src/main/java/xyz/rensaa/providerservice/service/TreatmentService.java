package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.tuples.generated.Tuple5;
import xyz.rensaa.providerservice.Treatment;
import xyz.rensaa.providerservice.contracts.CTreatmentFactory;
import xyz.rensaa.providerservice.dto.ImmutableTreatmentMessage;
import xyz.rensaa.providerservice.dto.TreatmentMessage;
import xyz.rensaa.providerservice.exceptions.NoContentException;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;

import javax.xml.bind.DatatypeConverter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class TreatmentService {

  @Autowired
  CTreatmentFactory cTreatmentFactory;

  @Autowired
  Treatment defaultTreatmentContract;

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
}
