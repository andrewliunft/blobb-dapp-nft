// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SVGChunksTool.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Blobb is ERC721URIStorage, Ownable {
  using Strings for uint256;
  using Strings for address;
  using SVGChunksTool for SVGChunksTool.SVGChunks;
  using Counters for Counters.Counter;

  bool public isContractEnabled;

  SVGChunksTool.SVGChunks private _svgChunks;
  Counters.Counter private _blobIDs;

  uint256 constant public mintPrice = 0.01 ether;
  uint256 constant public attackPrice = 0.02 ether;
  uint256 constant public healPrice = 0.001 ether;
  uint256 constant public maxSupply = 1000;

  event NewBlobb(uint indexed newBlobID, address indexed newOwner);
  //Single event for Attack and Heal. In front-end if the newHP is greater than the one stored, the Action is an Heal an Attack instead.
  event Action(uint indexed toBlobID, uint indexed madeFrom, uint newHP, uint newTotAttks);
  
  struct Blob {
    uint256 blobID;
    uint256 birthday;
    uint256 hp;
    uint256 totalActions;
    uint256 totalAttacks;
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

  uint theKingOfBlobb = 0;

  constructor() ERC721 ("BLOBB", "BLOBB") {} //LESS IN DEPLOY COSTS
  // constructor(bytes[] memory _svg) ERC721 ("BLOBB", "BLOBB") { _svgChunks.uploadSVG(_svg); } //LESS IN CONTRACT SIZE

  function uploadSVG(bytes[] memory _svg) external onlyOwner { _svgChunks.uploadSVG(_svg); }
  function setIsContractEnabled(bool _isContractEnabled) external onlyOwner { isContractEnabled = _isContractEnabled; }
  function getTotalBlobbsNumber() public view returns(uint) { return _blobIDs.current(); }
  function checkConditions() private view {
    require(isContractEnabled, "Contract is stopped!");
    require(theKingOfBlobb == 0, "The Battle is over!");
    ownerOf(ownedBlob[msg.sender]);
  }

  function getImageURI(uint256 _blobID) public view returns(string memory) {
    bytes memory svg = _svgChunks.getSVGChunk(0);
    for(uint i = 1; i < _svgChunks.getTotalChunksNumber(); i++) {
      svg = abi.encodePacked(svg, blobs[_blobID].values[i-1], _svgChunks.getSVGChunk(i));
    }
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

  function _newDefaultBlob(uint256 _blobID, uint[6] memory _colors) internal {
    Blob storage blob = blobs[_blobID];
    blob.blobID = _blobID;
    blob.birthday = block.timestamp;
    blob.hp = 10;
    blob.totalAttacks = 10;
    blob.creator = msg.sender;
    blob.owner = msg.sender;
    blobbColors[_blobID] = _colors;

    bytes memory _startRGB = abi.encodePacked(_colors[0].toString(), ",", _colors[1].toString(), ",", _colors[2].toString());
    bytes memory _endRGB = abi.encodePacked(_colors[3].toString(), ",", _colors[4].toString(), ",", _colors[5].toString());
    bytes memory _b1 = bytes("1");
    
    blob.values[0] = _b1; //VERIFIED
    blob.values[1] = bytes("10"); //EXP CIRCLE BAR
    blob.values[2] = _b1; //LEVEL NUMBER
    blob.values[3] = bytes(_blobID.toString()); //BLOB ID
    blob.values[4] = abi.encodePacked(SVGChunksTool.substring(msg.sender.toHexString(), 0, 5), "...", SVGChunksTool.substring(msg.sender.toHexString(), 38, 42)); //OWNER ADDRESS
    blob.values[5] = _startRGB; //FIRST COLOR
    blob.values[6] = _b1; //ALPHA FIRST COLOR
    blob.values[7] = _endRGB; //SECOND COLOR
    blob.values[8] = _b1; //ALPHA SECOND COLOR
    blob.values[9] = _startRGB; //STROKE FIRST COLOR
    blob.values[10] = _endRGB; //STROKE SECOND COLOR
  }

  function _updateValue(uint _blobID, uint _vIDX, bytes memory _value) internal {
    blobs[_blobID].values[_vIDX] = _value;
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
    require(_blobIDs.current() < maxSupply, "Max exceeded!");
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
    uint attackerBlobID = ownedBlob[msg.sender];
    Blob storage attackerBlob = blobs[attackerBlobID];

    require(msg.sender != blob.owner, "You can't ATTACK your own Blobb!");
    require(attackerBlob.hp != 0, "Your Blobb is dead!");
    require(blob.hp != 0, "Blobb is dead!");
    uint killing = blob.hp == 1 ? 1 : 0;
    require(msg.value >= attackPrice * (killing == 1 ? 2 : 1), "Wrong ATTACK value!");

    blob.hp -= 1;
    blob.lastHit = msg.sender;
    blob.totalActions++;
    
    attackerBlob.totalAttacks++;

    if(killing == 1) {
      attackerBlob.kills++;
      attackerBlob.totalAttacks += 9;
      blob.deathDate = block.timestamp;
      totalDeadBlobs++;
      deadBlobs[totalDeadBlobs] = _blobID;
    }

    if(totalDeadBlobs == 999) {
      // kingOfBlobb(attackerBlobID);
      theKingOfBlobb = _blobID;
      _updateValue(_blobID, 8, bytes("1"));
    }

    //ATTACKED BLOBB METADATA UPDATE
    bytes memory _hpToAlpha = blob.hp == 10 ? bytes("1") : abi.encodePacked(".", blob.hp.toString());
      //ALPHA FIRST COLOR -> 6
    _updateValue(_blobID, 6, _hpToAlpha);
      //ALPHA SECOND COLOR -> 8
    _updateValue(_blobID, 8, _hpToAlpha);

    //ATTACKER BLOBB METADATA UPDATE
    
      //EXP CIRCLE BAR -> 1
    _updateValue(attackerBlobID, 1, attackerBlob.totalAttacks < 1000 ? abi.encodePacked((10 - attackerBlob.totalAttacks % 10).toString()) : bytes("0"));
      //LEVEL NUMBER -> 2
    _updateValue(attackerBlobID, 2, attackerBlob.totalAttacks < 1000 ? abi.encodePacked((attackerBlob.totalAttacks/10).toString()) : bytes("99"));

    blobbHistory[_blobID][blob.totalActions] = attackerBlobID;

    _setTokenURI(_blobID, getBlobURI(_blobID));
    _setTokenURI(attackerBlobID, getBlobURI(attackerBlobID));

    emit Action(_blobID, attackerBlobID, blob.hp, attackerBlob.totalAttacks);
  }

  function healBlob(uint256 _blobID) public payable {
    checkConditions();
    Blob storage blob = blobs[_blobID];
    require(msg.sender == blob.owner, "You can't HEAL Blobbs you don't own!");
    require(blob.hp != 0, "Your Blobb is dead!");
    require(blob.hp < 10, "Your Blobb has FULL HP!");
    require(msg.value >= healPrice, "Wrong HEAL value!");

    blob.hp++;
    blob.totalActions++;

    //HEALED BLOBB METADATA UPDATE
    bytes memory _hpToAlpha = blob.hp == 10 ? bytes("1") : abi.encodePacked(".", blob.hp.toString());
      //ALPHA FIRST COLOR -> 6
    _updateValue(_blobID, 6, _hpToAlpha);
      //ALPHA SECOND COLOR -> 8
    _updateValue(_blobID, 8, _hpToAlpha);

    blobbHistory[_blobID][blob.totalActions] = ownedBlob[msg.sender];

    _setTokenURI(_blobID, getBlobURI(_blobID));

    emit Action(_blobID, 0, blob.hp, blob.totalAttacks);
  }

  function _transfer(address from, address to, uint256 tokenId) internal virtual override {
    require(balanceOf(to) == 0, "Blobb Owner!");
    super._transfer(from, to, tokenId);

    delete ownedBlob[from];
    ownedBlob[to] = tokenId;

    Blob storage blob = blobs[tokenId];
    blob.owner = to;

    //TRANSFERED BLOBB METADATA UPDATE
      //VERIFIED -> 0
    _updateValue(tokenId, 0, blob.owner == blob.creator ? bytes("1") : bytes("0"));
      //OWNER ADDRESS -> 4
    _updateValue(tokenId, 4, abi.encodePacked(SVGChunksTool.substring(to.toHexString(), 0, 5), "...", SVGChunksTool.substring(to.toHexString(), 38, 42))); //OWNER ADDRESS

    _setTokenURI(tokenId, getBlobURI(tokenId));
  }

  function withdraw() external onlyOwner {
    require(payable(owner()).send(address(this).balance));
  }
}