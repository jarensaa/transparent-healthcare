package xyz.rensaa.providerservice.providers;

import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;

public class GasProvider implements ContractGasProvider {

  private BigInteger gasPrice;
  private BigInteger gasLimit;

  public GasProvider(BigInteger gasPrice, BigInteger gasLimit) {
    this.gasPrice = gasPrice;
    this.gasLimit = gasLimit;
  }

  private GasProvider(Builder builder) {
    gasPrice = builder.gasPrice;
    gasLimit = builder.gasLimit;
  }

  @Override
  public BigInteger getGasPrice(String contractFunc) {
    return null;
  }

  @Override
  public BigInteger getGasPrice() {
    return null;
  }

  @Override
  public BigInteger getGasLimit(String contractFunc) {
    return null;
  }

  @Override
  public BigInteger getGasLimit() {
    return null;
  }

  public static final class Builder {
    private BigInteger gasPrice;
    private BigInteger gasLimit;

    public Builder() {
    }

    public Builder gasPrice(BigInteger val) {
      gasPrice = val;
      return this;
    }

    public Builder gasLimit(BigInteger val) {
      gasLimit = val;
      return this;
    }

    public GasProvider build() {
      return new GasProvider(this);
    }
  }
}
