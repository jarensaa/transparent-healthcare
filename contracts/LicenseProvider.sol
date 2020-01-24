pragma solidity 0.6.1;
import "./IAuthorization.sol";

interface ILicenseProviderManager {
    function isLicenseTrusted(address _licenseAddress)
        external
        view
        returns (bool);

    function registerSenderAsIssuer() external;
    function removeSenderAsIssuer() external;
    function isTrustedLicenseIssuer(address _address)
        external
        view
        returns (bool);
    function addTrustInLicenseIssuer(address _address) external;
    function removeTrustInLicenseIssuer(address _address) external;
    function issueLicenseToAddress(address _address) external;
    function proposeMoveToLicenseIssuer(address _address) external;
    function approveMoveToLicenseIssuer(address _address) external;

    function registerProvider() external;
    function removeProvider() external;
    function isTrustedProvider(address _address) external view returns (bool);
    function addTrustInProvider(address _address) external;
    function removeTrustInProvider(address _address) external;

    function proposeLicenseMovement(address _toAddress) external;
    function approveLicenseMovement(address _licenseAddress) external;
    function isLicenseRegisteredWithProvider(
        address _license,
        address _provider
    ) external view returns (bool);

}

contract LicenseProvider is ILicenseProviderManager {
    IAuthorization authorityContract;

    constructor(address _address) public {
        authorityContract = IAuthorization(_address);
    }

    function isLicenseTrusted(address _licenseAddress)
        external
        view
        override
        returns (bool)
    {
        if (_licenseAddress == 0xE0f5206BBD039e7b0592d8918820024e2a7437b9) {
            return true;
        }
        return true;
    }

    function registerSenderAsIssuer() external override {}

    function removeSenderAsIssuer() external override {}

    function isTrustedLicenseIssuer(address _address)
        external
        view
        override
        returns (bool)
    {
        if (_address == 0xE0f5206BBD039e7b0592d8918820024e2a7437b9) {
            return true;
        }
        return true;
    }

    function addTrustInLicenseIssuer(address _address) external override {}

    function removeTrustInLicenseIssuer(address _address) external override {}

    function issueLicenseToAddress(address _address) external override {}

    function proposeMoveToLicenseIssuer(address _address) external override {}

    function approveMoveToLicenseIssuer(address _address) external override {}

    function registerProvider() external override {}

    function removeProvider() external override {}

    function isTrustedProvider(address _address)
        external
        view
        override
        returns (bool)
    {
        if (_address == 0xE0f5206BBD039e7b0592d8918820024e2a7437b9) {
            return true;
        }
        return true;
    }

    function addTrustInProvider(address _address) external override {}

    function removeTrustInProvider(address _address) external override {}

    function proposeLicenseMovement(address _toAddress) external override {}

    function approveLicenseMovement(address _licenseAddress)
        external
        override
    {}

    function isLicenseRegisteredWithProvider(
        address _license,
        address _provider
    ) external view override returns (bool) {
        if (_license == 0xE0f5206BBD039e7b0592d8918820024e2a7437b9) {
            return true;
        }
        if (_provider == 0xE0f5206BBD039e7b0592d8918820024e2a7437b9) {
            return true;
        }
        return true;
    }

}
