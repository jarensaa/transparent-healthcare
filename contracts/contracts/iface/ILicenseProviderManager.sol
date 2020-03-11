pragma solidity ^0.6.1;

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

    function proposeLicenseProviderMovement(address _toAddress) external;
    function approveLicenseProviderMovement(address _licenseAddress) external;
    function isLicenseRegisteredWithProvider(
        address _license,
        address _provider
    ) external view returns (bool);

    function getIsserOfLicense(address _licenseAddress)
        external
        view
        returns (address);

    function getProviderForLicense(address _licenseAddress)
        external
        view
        returns (address);

}
