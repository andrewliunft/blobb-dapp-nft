// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./OnChainSVG.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Blobb is ERC721URIStorage, OnChainSVG {
  using Strings for uint256;
  using Strings for address;
  using Counters for Counters.Counter;

  bool public isContractEnabled;
  Counters.Counter private _blobIDs;

  uint256 constant public mintPrice = 0.01 ether;
  uint256 constant public attackPrice = 0.02 ether;
  uint256 constant public healPrice = 0.001 ether;
  uint256 constant public revivalPrice = 0.05 ether;

  event NewBlobb(uint256 indexed newBlobID, address indexed newOwner);
  //Single event for Attack and Heal. In front-end if the newHP is greater than the one stored, the Action is an Heal an Attack instead.
  event Action(uint256 indexed toBlobID, address indexed madeFrom, uint256 newHP);
  
  struct Blob {
    uint256 blobID;
    uint256 birthday;
    uint256 hp;
    uint256 totalActions;
    uint256 kills;
    uint256 deathDate;
    address creator;
    address owner;
    address lastHit;
    mapping(uint => bytes) values;
  }

  mapping(uint256 => Blob) public blobs;
  mapping(address => uint256) public ownedBlob;

  uint public totalDeadBlobs;
  mapping(uint => uint) public deadBlobs;

  mapping(uint256 => uint[6]) public blobbColors;
  //MY ID => IDX => ACTOR ID: If ACTOR ID is equal to MY ID, it means that it is a heal, an attack instead.
  mapping(uint256 => mapping(uint256 => uint256)) public blobbHistory;

  constructor() ERC721 ("BLOBB", "BLBB") {}

  function setIsContractEnabled(bool _isContractEnabled) external onlyOwner { isContractEnabled = _isContractEnabled; }
  function getTotalBlobbsNumber() public view returns(uint) { return _blobIDs.current(); }
  function checkConditions() private view {
    require(isContractEnabled, "Contract is stopped!");
    ownerOf(ownedBlob[msg.sender]);
  }

  function getImageURI(uint256 _blobID) public view returns(string memory) {
    bytes memory svg = _getSVGChunk(0);
    for(uint i = 1; i < _getChunksNumber(); i++) {
      svg = abi.encodePacked(svg, blobs[_blobID].values[i-1], _getSVGChunk(i));
    }
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

  function _newDefaultBlob(uint256 _blobID, uint[6] memory _colors) internal {
    Blob storage blob = blobs[_blobID];
    blob.blobID = _blobID;
    blob.birthday = block.timestamp;
    blob.hp = 10;
    blob.creator = msg.sender;
    blob.owner = msg.sender;
    blobbColors[_blobID] = _colors;

    bytes memory _startRGB = abi.encodePacked(_colors[0].toString(), ",", _colors[1].toString(), ",", _colors[2].toString());
    bytes memory _endRGB = abi.encodePacked(_colors[3].toString(), ",", _colors[4].toString(), ",", _colors[5].toString());
    bytes memory _b1 = bytes("1");
    blob.values[0] = blob.owner == blob.creator ? _b1 : bytes("0");
    blob.values[1] = abi.encodePacked(substring(msg.sender.toHexString(), 0, 5), "...", substring(msg.sender.toHexString(), 38, 42));
    blob.values[2] = _startRGB;
    blob.values[3] = _b1;
    blob.values[4] = _endRGB;
    blob.values[5] = _b1;
    blob.values[6] = _startRGB;
    blob.values[7] = _endRGB;
  }

  function _updateValue(uint256 _blobID) internal {
    Blob storage blob = blobs[_blobID];
    bytes memory dotHP = abi.encodePacked(".", blob.hp.toString());
    bytes memory _b1 = bytes("1");
    blob.values[0] = blob.owner == blob.creator ? _b1 : bytes("0");
    blob.values[3] = blob.hp == 10 ? _b1 : dotHP;
    blob.values[5] = blob.hp == 10 ? _b1 : dotHP;
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

  function mintBlob(uint[6] memory _colors) public payable {
    require(isContractEnabled, "Contract is stopped!");
    for(uint256 i = 0; i < _colors.length; i++) { require(_colors[i] <= 255); }
    require(ownedBlob[msg.sender] == 0, "You already OWN a Blobb!");
    require(msg.value >= mintPrice, "Wrong MINT value!");

    _blobIDs.increment();
    uint256 newBlobID = _blobIDs.current();
    _safeMint(msg.sender, newBlobID);

    _newDefaultBlob(newBlobID, _colors);
    ownedBlob[msg.sender] = newBlobID;

    _setTokenURI(newBlobID, getBlobURI(newBlobID));
    emit NewBlobb(newBlobID, msg.sender);
  }

  function attackBlob(uint256 _blobID) public payable {
    checkConditions();
    Blob storage blob = blobs[_blobID];
    require(msg.sender != blob.owner, "You can't ATTACK your own Blobb!");
    require(blob.hp != 0, "Blobb is dead!");
    uint killing = blob.hp == 1 ? 1 : 0;
    require(msg.value >= attackPrice * (killing == 1 ? 10 : 1), "Wrong ATTACK value!");

    blob.hp -= 1;
    blob.lastHit = msg.sender;
    blob.totalActions += 1;
    
    if(killing == 1) {
      blob.kills++;
      totalDeadBlobs++;
      deadBlobs[totalDeadBlobs] = _blobID;
    }

    _updateValue(_blobID);

    blobbHistory[_blobID][blob.totalActions] = ownedBlob[msg.sender];

    _setTokenURI(_blobID, getBlobURI(_blobID));

    
    emit Action(_blobID, msg.sender, blob.hp);
  }

  function healBlob(uint256 _blobID) public payable {
    checkConditions();
    Blob storage blob = blobs[_blobID];
    require(msg.sender == blob.owner, "You can't HEAL Blobbs you don't own!");
    require(blob.hp != 0, "Your Blobb is dead!");
    require(blob.hp < 10, "Your Blobb has FULL HP!");
    require(msg.value >= healPrice, "Wrong HEAL value!");

    blob.hp += 1;
    blob.totalActions += 1;

    _updateValue(_blobID);

    blobbHistory[_blobID][blob.totalActions] = ownedBlob[msg.sender];

    _setTokenURI(_blobID, getBlobURI(_blobID));

    emit Action(_blobID, msg.sender, blob.hp);
  }

  function _transfer(address from, address to, uint256 tokenId) internal virtual override {
    super._transfer(from, to, tokenId);

    delete ownedBlob[from];
    ownedBlob[to] = tokenId;
    blobs[tokenId].owner = to;
    _updateValue(tokenId);
    _setTokenURI(tokenId, getBlobURI(tokenId));
  }
}