pragma solidity 0.6.1;
import "./IAuthorization.sol";
import "./ILicenseProviderManager.sol";

contract LicenseProvider is ILicenseProviderManager {
    struct License {
        address trustingIssuer;
        address trustingProvider;
    }

    IAuthorization authorityContract;
    mapping(address => License) licenses;
    mapping(address => bool) isIssuer;
    mapping(address => address) issuerTrustedByAuthority;
    mapping(address => address[]) licensesIssuedByIssuer;
    mapping(address => mapping(address => bool)) issuerMoveProposed;
    mapping(address => mapping(address => bool)) providerMoveProposed;

    modifier addressIsLicense(address _address) {
        require(
            licenses[_address].trustingIssuer != address(0x0),
            "Target address does not have a license"
        );
        _;
    }

    modifier addressIsIssuer(address _address) {
        require(isIssuer[_address], "Target is not an issuer");
        _;
    }

    modifier addressIsNotIssuer(address _address) {
        require(!isIssuer[_address], "Target is allready a registed issuer");
        _;
    }

    modifier addressIsAuthority(address _address) {
        require(authorityContract.isAuthorized(msg.sender));
        _;
    }

    constructor(address _address) public {
        authorityContract = IAuthorization(_address);
    }

    function isLicenseTrusted(address _licenseAddress)
        external
        view
        override
        returns (bool)
    {
        return
            (
                authorityContract.isAuthorized(
                    licenses[_licenseAddress].trustingIssuer
                )
            ) &&
            (
                authorityContract.isAuthorized(
                    licenses[_licenseAddress].trustingProvider
                )
            );
    }

    function registerSenderAsIssuer()
        external
        override
        addressIsNotIssuer(msg.sender)
    {
        isIssuer[msg.sender] = true;
    }

    function removeSenderAsIssuer()
        external
        override
        addressIsIssuer(msg.sender)
    {
        delete isIssuer[msg.sender];
        delete issuerTrustedByAuthority[msg.sender];
    }

    function isTrustedLicenseIssuer(address _address)
        external
        view
        override
        returns (bool)
    {
        if (!isIssuer[_address]) return false;
        if (!authorityContract.isAuthorized(issuerTrustedByAuthority[_address]))
            return false;
        return true;
    }

    function addTrustInLicenseIssuer(address _address)
        external
        override
        addressIsAuthority(msg.sender)
    {
        issuerTrustedByAuthority[_address] = msg.sender;
    }

    function removeTrustInLicenseIssuer(address _address)
        external
        override
        addressIsAuthority(msg.sender)
    {
        require(
            issuerTrustedByAuthority[_address] == msg.sender,
            "issuer is not trusted by sending authority"
        );
        delete issuerTrustedByAuthority[_address];
    }

    function issueLicenseToAddress(address _address)
        external
        override
        addressIsIssuer(msg.sender)
    {
        licenses[_address] = License(msg.sender, address(0x0));
    }

    function proposeMoveToLicenseIssuer(address _address)
        external
        override
        addressIsLicense(msg.sender)
        addressIsIssuer(_address)
    {
        issuerMoveProposed[msg.sender][_address] = true;
    }

    function approveMoveToLicenseIssuer(address _address)
        external
        override
        addressIsLicense(_address)
        addressIsIssuer(msg.sender)
    {
        require(
            issuerMoveProposed[_address][msg.sender],
            "Move has not been proposed by license holder."
        );
        licenses[_address].trustingIssuer = msg.sender;
        delete issuerMoveProposed[_address][msg.sender];
    }

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
