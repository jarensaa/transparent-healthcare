package xyz.rensaa.providerservice.service;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.tx.Transfer;
import org.web3j.utils.Convert;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.DecimalFormat;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class Web3Service {

  @Autowired
  private Web3j web3j;

  @Autowired
  Logger logger;

  @Autowired
  List<Credentials> credentials;

  private static BigInteger wei = new BigInteger("1000000000000000000");
  private static DecimalFormat decimalFormat = new DecimalFormat("#.##");

  public double getAddressBalance(String address) {
    double balance = getAddressBalanceInWei(address).doubleValue()/wei.doubleValue();
    return Double.parseDouble(decimalFormat.format(balance));
  }

  public BigInteger getAddressBalanceInWei(String address) {
    try {
      return web3j
          .ethGetBalance(address, DefaultBlockParameterName.LATEST)
          .sendAsync()
          .get().getBalance();
    } catch (InterruptedException | ExecutionException e) {
      logger.error("Get balance failed. ", e);
      throw new TransactionFailedException();
    }
  }

  public void sendEth(String sendingPrivateKey, String toAddress, BigInteger wei) {
    try {
      Transfer.sendFunds(web3j,Credentials.create(sendingPrivateKey),toAddress, new BigDecimal(wei), Convert.Unit.WEI).send();
    } catch (Exception e) {
      logger.error("Send eth failed", e);
      throw new TransactionFailedException();
    }
  }
}
