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

  struct Blob {
    uint256 blobID;
    uint256 life;
    uint256 hp;
    address creator;
    address lastHit;
    bool isDead;
  }
  mapping(uint256 => Blob) public blobs;
  mapping(address => Blob) public blobByOwner;
  mapping(string => Blob) public blobByName;

  mapping(uint256 => mapping(address => uint256)) public attacks;
  mapping(uint256 => mapping(address => uint256)) public kills;

  mapping(uint256 => mapping(uint256 => uint256)) public birthDates;
  mapping(uint256 => mapping(uint256 => uint256)) public deathDates;

  mapping(uint256 => mapping(uint256 => uint256)) public heals;
  mapping(uint256 => uint256) public revivals;

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
              'transform: rotate(0deg) scale(', _getFormattedBlobHP(_blobID), ');',
            '}',
            'to {',
              'transform: rotate(360deg) scale(', _getFormattedBlobHP(_blobID), ');',
            '}',
          '}',
        '</style>',
        '<g>',
          '<rect width="100%" height="100%"/>',
          '<g id="pink-blob">',
            '<rect width="100" height="100" rx="20%" fill="red" x="12.5" y="12.5"/>',
          '</g>',
        '</g>',
      '</svg>'
    ))));
  }

  function _getFormattedBlobHP(uint256 _blobID) internal view returns(string memory) {
    return (blobs[_blobID].hp/10).toString();
  }

  function _newDefaultBlob(uint256 _blobID, uint256 _hp, address _creator) internal pure returns(Blob memory) {
    return Blob({ 
      blobID: _blobID,
      life: 1,
      hp: _hp, 
      creator: _creator, 
      lastHit: address(0), 
      isDead: false
    });
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
    require(blobByOwner[msg.sender].creator == address(0), "You already OWN a Blobb!");
    require(msg.value == mintPrice, "Wrong MINT value!");

    _blobIDs.increment();
    uint256 newBlobID = _blobIDs.current();
    _safeMint(msg.sender, newBlobID);

    blobs[newBlobID] = _newDefaultBlob(newBlobID, 10, msg.sender);
    blobByOwner[msg.sender] = blobs[newBlobID];

    birthDates[newBlobID][blobs[newBlobID].life] = block.timestamp;

    _setTokenURI(newBlobID, getBlobURI(newBlobID));
  }

  function attackBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender != blobs[_blobID].creator, "You can't ATTACK your own Blobb!");
    require(!blobs[_blobID].isDead, "Blobb is DEAD!");
    require(blobs[_blobID].hp > 1, "Blobb is dying!");
    require(msg.value == attackPrice, "Wrong ATTACK value!");

    blobs[_blobID].hp -= 1;
    blobs[_blobID].lastHit = msg.sender;

    attacks[_blobID][msg.sender] += 1;

    _setTokenURI(_blobID, getBlobURI(_blobID));
  }

  function killBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender != blobs[_blobID].creator, "You can't KILL your own Blobb!");
    require(!blobs[_blobID].isDead, "Blobb is DEAD!");
    require(blobs[_blobID].hp == 1, "Blobb isn't dying!");
    require(msg.value == attackPrice * 10, "Wrong KILL value!");

    blobs[_blobID].hp -= 1;
    blobs[_blobID].lastHit = msg.sender;
    blobs[_blobID].isDead = true;

    kills[_blobID][msg.sender] += 1;

    deathDates[_blobID][blobs[_blobID].life] = block.timestamp;

    _setTokenURI(_blobID, getBlobURI(_blobID));
  }

  function healBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender == blobs[_blobID].creator, "You can't HEAL Blobbs you don't own!");
    require(!blobs[_blobID].isDead, "Your Blobb is DEAD!");
    require(blobs[_blobID].hp < 10, "Your Blobb has FULL HP!");
    require(msg.value == healPrice, "Wrong HEAL value!");

    blobs[_blobID].hp += 1;
    heals[_blobID][blobs[_blobID].life] += 1;

    _setTokenURI(_blobID, getBlobURI(_blobID));
  }

  function reviveBlob(uint256 _blobID) public payable actionsRequires(_blobID) {
    require(msg.sender == blobs[_blobID].creator, "You can't REVIVE Blobbs you don't own!");
    require(blobs[_blobID].isDead, "Your Blobb is not DEAD!");
    require(msg.value == revivalPrice, "Wrong REVIVAL value!");

    blobs[_blobID].hp = 10;
    blobs[_blobID].isDead = false;
    blobs[_blobID].life += 1;

    birthDates[_blobID][blobs[_blobID].life] = block.timestamp;

    _setTokenURI(_blobID, getBlobURI(_blobID));
  }
}