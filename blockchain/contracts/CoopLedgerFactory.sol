pragma solidity ^0.8.19;

// Importation du contrat CoopLedger
import "./CoopLedger.sol";

/**
 * @title CoopFactory
 * @dev Usine pour le déploiement et la gestion des instances de coopératives.
 */
contract CoopLedgerFactory {
    
    struct CooperativeInfo {
        string name;
        address contractAddress;
        address owner;
        uint256 createdAt;
    }

    // Registre de toutes les coopératives créées via l'usine
    CooperativeInfo[] public allCooperatives;
    
    // Mapping pour retrouver rapidement les infos d'une coopérative par son adresse
    mapping(address => uint256) public addressToIndex;

    event CooperativeCreated(address indexed coopAddress, string name, address indexed owner);

    /**
     * @dev Crée une nouvelle instance de CoopLedger pour une coopérative.
     * @param _name Nom de la coopérative.
     * @param _voteThreshold Seuil financier déclenchant un vote obligatoire.
     */
    function createCooperative(string memory _name, uint256 _voteThreshold) external returns (address) {
        // 1. Déploiement d'une nouvelle instance du contrat CoopLedger
        // L'appelant devient l'owner du nouveau contrat
        CoopLedger newCoop = new CoopLedger(msg.sender, _voteThreshold);
        address newCoopAddress = address(newCoop);

        // 2. Enregistrement des informations dans l'usine
        allCooperatives.push(CooperativeInfo({
            name: _name,
            contractAddress: newCoopAddress,
            owner: msg.sender,
            createdAt: block.timestamp
        }));

        addressToIndex[newCoopAddress] = allCooperatives.length - 1;

        emit CooperativeCreated(newCoopAddress, _name, msg.sender);

        return newCoopAddress;
    }

    /**
     * @dev Retourne les détails d'une coopérative spécifique.
     */
    function getCooperativeDetails(address _coopAddress) external view returns (string memory name, address owner, uint256 createdAt) {
        uint256 index = addressToIndex[_coopAddress];
        require(index != 0 || allCooperatives[0].contractAddress == _coopAddress, "Cooperative non trouvee");
        
        CooperativeInfo storage info = allCooperatives[index];
        return (info.name, info.owner, info.createdAt);
    }

    /**
     * @dev Retourne la liste complète de toutes les coopératives.
     */
    function getAllCooperatives() external view returns (CooperativeInfo[] memory) {
        return allCooperatives;
    }

    /**
     * @dev Retourne le nombre total de coopératives créées.
     */
    function getTotalCooperatives() external view returns (uint256) {
        return allCooperatives.length;
    }
}
