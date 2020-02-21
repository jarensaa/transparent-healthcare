package xyz.rensaa.providerservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import xyz.rensaa.providerservice.dto.ContractAddresses;

@SpringBootApplication
public class ProviderApplication {

	@Autowired
	ContractAddresses addresses;

	public static void main(String[] args) {
		SpringApplication.run(ProviderApplication.class, args);
	}

}