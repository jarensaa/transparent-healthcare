package xyz.rensaa.providerservice.service;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.RemoteFunctionCall;
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

  private static final BigInteger wei = new BigInteger("1000000000000000000");
  private static final DecimalFormat decimalFormat = new DecimalFormat("#.##");
  @Autowired
  Logger logger;
  @Autowired
  List<Credentials> credentials;
  @Autowired
  private Web3j web3j;

  public static void submitTransaction(final RemoteFunctionCall transactioncall) {
    try {
      transactioncall.send();
    } catch (final Exception e) {
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public double getAddressBalance(final String address) {
    final double balance = getAddressBalanceInWei(address).doubleValue() / wei.doubleValue();
    return Double.parseDouble(decimalFormat.format(balance));
  }

  public BigInteger getAddressBalanceInWei(final String address) {
    try {
      return web3j
          .ethGetBalance(address, DefaultBlockParameterName.LATEST)
          .sendAsync()
          .get().getBalance();
    } catch (final InterruptedException | ExecutionException e) {
      logger.error("Get balance failed. ", e);
      throw new TransactionFailedException();
    }
  }

  public void sendEth(final String sendingPrivateKey, final String toAddress, final BigInteger wei) {
    try {
      Transfer.sendFunds(web3j, Credentials.create(sendingPrivateKey), toAddress, new BigDecimal(wei), Convert.Unit.WEI).send();
    } catch (final Exception e) {
      logger.error("Send eth failed", e);
      throw new TransactionFailedException();
    }
  }
}
