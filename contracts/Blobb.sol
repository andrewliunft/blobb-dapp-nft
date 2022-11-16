// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Blobb is ERC721URIStorage, Ownable {
  using Strings for uint256;
  using Counters for Counters.Counter;

  bool public isContractEnabled;
  Counters.Counter private _blobIDs;

  uint256 public mintPrice;
  uint256 public attackPrice;
  uint256 public healPrice;
  uint256 public revivalPrice;

  event Attack(address indexed attacker, address indexed attackedOwner, uint256 toBlobID);
  event Kill(address indexed killer, address indexed killedOwner, uint256 toBlobID);

  struct Blob {
    uint256 blobID;
    uint256 life;
    uint256 hp;
    address creator;
    address lastHit;
    bool isDead;
  }

  struct BlobStats {
    mapping(uint256 => uint256) birthDates;
    mapping(uint256 => uint256) deathDates;

    uint256 totalAttacks;
    mapping(address => uint256) addressAttacks;
    mapping(uint256 => address) attacksHistory;
    uint256 totalKills;
    mapping(address => uint256) addressKills;
    mapping(uint256 => address) killsHistory;
    uint256 totalHealings;
    mapping(uint256 => uint256) lifeHealings;
    uint256 revivals;
  }

  struct OwnerStats {
    uint256 inflictedAttacks;
    mapping(uint256 => uint256) blobAttacks;
    uint256 inflictedKills;
    mapping(uint256 => uint256) blobKills;  
  }

  mapping(uint256 => Blob) public blobs;
  mapping(uint256 => BlobStats) public blobStats;
  mapping(address => OwnerStats) public ownerStats;
  mapping(address => uint256) public ownedBlob;

  modifier actionsRequires(uint256 _blobID) {
    require(isContractEnabled, "Contract is stopped!");
    require(_exists(_blobID), "Blobb doesn't exist!");
    _;
  }

  constructor() ERC721 ("BLOBB", "BLBB") {
    mintPrice = 0.01 ether;
    attackPrice = 0.02 ether;
    healPrice = 0.001 ether;
    revivalPrice = 0.05 ether;
  }

  function setIsContractEnabled(bool _isContractEnabled) external onlyOwner { isContractEnabled = _isContractEnabled; }
  function getCurrentBlobID() external view returns(uint256) { return _blobIDs.current(); }

  function getImageURI(uint256 _blobID) public view returns(string memory) {
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 125" fill="none">',
        '<style type="text/css">',
          '#pink-blob {',
            'animation: spin infinite 10s linear;',
            'transform-origin: center center;',
          '}',
          '@keyframes spin {',
            'from {',
              'transform: rotate(0deg) scale(', blobs[_blobID].hp == 10 ? "1" : string(abi.encodePacked(".", blobs[_blobID].hp.toString())), ');',
            '}',
            'to {',
              'transform: rotate(360deg) scale(', blobs[_blobID].hp == 10 ? "1" : string(abi.encodePacked(".", blobs[_blobID].hp.toString())), ');',
            '}',
          '}',
        '</style>',
        '<g>',
          '<rect width="100%" height="100%"/>',
          '<g id="pink-blob">',
            '<rect width="100" height="100" rx="20%" fill="', blobs[_blobID].hp == 10 ? "green" : "red", '" x="12.5" y="12.5"/>',
          '</g>',
        '</g>',
      '</svg>'
    ))));
  }

  function _newDefaultBlob(uint256 _blobID, address _creator) internal pure returns(Blob memory) {
    return Blob(_blobID, 1, 10, _creator, address(0), false);
  }

  function getBlobURI(uint256 _blobID) public view returns(string memory) {
    return string(abi.encodePacked("data:application/json;base64,",Base64.encode(abi.encodePacked(
      '{',
        '"name": "BLOBB #', _blobID.toString(), '",',
        '"description": "BLOBB number ', _blobID.toString(), '!",',
        // '"attributes": [{"trait_type": "Background", "value": "Hyper aquatic"}, {"trait_type": "Torso", "value": "Heavy"}]',
        '"image": "', getImageURI(_blobID), '"',
      '}'
    ))));
  }

  function mintBlob() public payable {
    require(isContractEnabled, "Contract is stopped!");
    require(ownedBlob[msg.sender] == 0, "You already OWN a Blobb!");
    require(msg.value == mintPrice, "Wrong MINT value!");

    _blobIDs.increment();
    uint256 newBlobID = _blobIDs.current();
    _safeMint(msg.sender, newBlobID);

    blobs[newBlobID] = _newDefaultBlob(newBlobID, msg.sender);
    ownedBlob[msg.sender] = newBlobID;

    blobStats[newBlobID].birthDates[blobs[newBlobID].life] = block.timestamp;

    _setTokenURI(newBlobID, getBlobURI(newBlobID));
  }

  function attackBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender != blobs[_blobID].creator, "You can't ATTACK your own Blobb!");
    require(!blobs[_blobID].isDead, "Blobb is DEAD!");
    require(blobs[_blobID].hp > 1, "Blobb is dying!");
    require(msg.value == attackPrice, "Wrong ATTACK value!");

    blobs[_blobID].hp -= 1;
    blobs[_blobID].lastHit = msg.sender;

    blobStats[_blobID].totalAttacks += 1;
    blobStats[_blobID].addressAttacks[msg.sender] += 1;
    blobStats[_blobID].attacksHistory[blobStats[_blobID].totalAttacks] = msg.sender;

    ownerStats[msg.sender].inflictedAttacks += 1;
    ownerStats[msg.sender].blobAttacks[_blobID] += 1;

    _setTokenURI(_blobID, getBlobURI(_blobID));
    emit Attack(msg.sender, blobs[_blobID].creator, _blobID);
  }

  function killBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender != blobs[_blobID].creator, "You can't KILL your own Blobb!");
    require(!blobs[_blobID].isDead, "Blobb is DEAD!");
    require(blobs[_blobID].hp == 1, "Blobb isn't dying!");
    require(msg.value == attackPrice * 10, "Wrong KILL value!");

    blobs[_blobID].hp -= 1;
    blobs[_blobID].lastHit = msg.sender;
    blobs[_blobID].isDead = true;

    blobStats[_blobID].totalKills += 1;
    blobStats[_blobID].addressKills[msg.sender] += 1;
    blobStats[_blobID].killsHistory[blobStats[_blobID].totalKills] = msg.sender;

    blobStats[_blobID].deathDates[blobs[_blobID].life] = block.timestamp;

    ownerStats[msg.sender].inflictedKills += 1;
    ownerStats[msg.sender].blobKills[_blobID] += 1;

    _setTokenURI(_blobID, getBlobURI(_blobID));
    emit Kill(msg.sender, blobs[_blobID].creator, _blobID);
  }

  function healBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender == blobs[_blobID].creator, "You can't HEAL Blobbs you don't own!");
    require(!blobs[_blobID].isDead, "Your Blobb is DEAD!");
    require(blobs[_blobID].hp < 10, "Your Blobb has FULL HP!");
    require(msg.value == healPrice, "Wrong HEAL value!");

    blobs[_blobID].hp += 1;

    blobStats[_blobID].totalHealings += 1;
    blobStats[_blobID].lifeHealings[blobs[_blobID].life] += 1;

    _setTokenURI(_blobID, getBlobURI(_blobID));
  }

  function reviveBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender == blobs[_blobID].creator, "You can't REVIVE Blobbs you don't own!");
    require(blobs[_blobID].isDead, "Your Blobb is not DEAD!");
    require(msg.value == revivalPrice, "Wrong REVIVAL value!");

    blobs[_blobID].hp = 10;
    blobs[_blobID].isDead = false;
    blobs[_blobID].life += 1;

    blobStats[_blobID].birthDates[blobs[_blobID].life] = block.timestamp;

    _setTokenURI(_blobID, getBlobURI(_blobID));
  }
}