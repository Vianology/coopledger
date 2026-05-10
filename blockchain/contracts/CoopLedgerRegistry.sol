// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CoopLedgerRegistry
 * @dev Registre centralisé pour toutes les coopératives CoopLedger.
 * Permet d'ancrer les preuves de transactions et de votes.
 */
contract CoopLedgerRegistry {
    address public platformAdmin;

    struct Proof {
        bytes32 cooperativeId;
        bytes32 receiptHash;     // SHA256 du reçu JSON chiffré
        string lighthouseCid;   // CID Lighthouse (IPFS/Filecoin)
        uint256 amount;
        uint8 proofType;        // 0 = COTISATION, 1 = RETRAIT, 2 = VOTE_RESULT
        uint256 timestamp;
    }

    // Mapping pour vérifier si un CID a déjà été enregistré
    mapping(string => bool) public registeredCids;

    // Historique des preuves par coopérative
    mapping(bytes32 => Proof[]) private coopProofs;

    event ProofRecorded(bytes32 indexed cooperativeId, string lighthouseCid, uint8 proofType);

    modifier onlyAdmin() {
        require(msg.sender == platformAdmin, "Reserved to platform admin");
        _;
    }

    constructor() {
        platformAdmin = msg.sender;
    }

    /**
     * @dev Enregistre une nouvelle preuve sur la blockchain.
     */
    function recordProof(
        bytes32 _cooperativeId,
        bytes32 _receiptHash,
        string memory _lighthouseCid,
        uint256 _amount,
        uint8 _proofType
    ) external onlyAdmin {
        require(!registeredCids[_lighthouseCid], "CID already registered");

        Proof memory newProof = Proof({
            cooperativeId: _cooperativeId,
            receiptHash: _receiptHash,
            lighthouseCid: _lighthouseCid,
            amount: _amount,
            proofType: _proofType,
            timestamp: block.timestamp
        });

        coopProofs[_cooperativeId].push(newProof);
        registeredCids[_lighthouseCid] = true;

        emit ProofRecorded(_cooperativeId, _lighthouseCid, _proofType);
    }

    /**
     * @dev Vérifie l'authenticité d'un reçu via son CID.
     */
    function verifyProof(string memory _lighthouseCid) external view returns (bool) {
        return registeredCids[_lighthouseCid];
    }

    /**
     * @dev Récupère le nombre de preuves pour une coopérative.
     */
    function getCoopProofCount(bytes32 _cooperativeId) external view returns (uint256) {
        return coopProofs[_cooperativeId].length;
    }

    /**
     * @dev Récupère une preuve spécifique par index.
     */
    function getCoopProof(bytes32 _cooperativeId, uint256 _index) external view returns (Proof memory) {
        require(_index < coopProofs[_cooperativeId].length, "Index out of bounds");
        return coopProofs[_cooperativeId][_index];
    }

    /**
     * @dev Transfert de l'administration.
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        platformAdmin = _newAdmin;
    }
}
