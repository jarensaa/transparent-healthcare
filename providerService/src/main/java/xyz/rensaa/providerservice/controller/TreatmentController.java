package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.rensaa.providerservice.dto.TreatmentMessage;
import xyz.rensaa.providerservice.service.TreatmentService;

import java.util.List;

@RestController
@RequestMapping("/treatments")
public class TreatmentController {

  @Autowired
  TreatmentService treatmentService;

  @GetMapping
  public List<TreatmentMessage> getTreatments() {
    return treatmentService.getTreatments();
  }

  @GetMapping("/{address}")
  public TreatmentMessage getTreatmentByAddress(@PathVariable("address") final String address) {

    return treatmentService.getTreatmentFromAddress(address);
  }
}
