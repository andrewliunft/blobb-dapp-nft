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

  uint256 constant public mintPrice = 0.01 ether; //0.01
  uint256 constant public attackPrice = 0.02 ether; //0.02
  uint256 constant public healPrice = 0.001 ether; //0.001
  uint256 constant public maxSupply = 1000;

  event NewBlobb(uint indexed newBlobID, address indexed newOwner);
  //Single event for Attack and Heal. In front-end if the newHP is greater than the one stored, the Action is an Heal an Attack instead.
  event Action(uint indexed toBlobID, uint indexed madeFrom, uint newHP, uint newTotAttks, uint kingOfBlobbs);
  
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
    uint blobType;
    mapping(uint => bytes) values;
  }

  mapping(uint256 => Blob) public blobs;
  mapping(address => uint256) public ownedBlob;

  uint public totalDeadBlobs;
  mapping(uint => uint) public deadBlobs;

  mapping(uint256 => uint[6]) public blobbColors;
  //MY ID => IDX => ACTOR ID: If ACTOR ID is equal to MY ID, it means that it is a heal, an attack instead.
  mapping(uint256 => mapping(uint256 => uint256)) public blobbHistory;

  uint public theKingOfBlobbs;
  uint public kingsTreasure;

  //upload func -> 0.0236 ETH
  // constructor() ERC721 ("BLOBB", "BLOBB") {} //LESS IN DEPLOY COSTS

  //upload in constructor & update func -> 0.0256 ETH
  constructor(bytes[] memory _svg) ERC721 ("BLOBB", "BLOBB") { _svgChunks.uploadSVG(_svg); } //LESS IN CONTRACT SIZE

  // function uploadSVG(bytes[] memory _svg) external onlyOwner { _svgChunks.uploadSVG(_svg); }
  function updateSVGChunk(uint _nChunkIDX, bytes memory _nChunk) external onlyOwner { _svgChunks.updateSVGChunk(_nChunkIDX, _nChunk); }
  function setIsContractEnabled(bool _isContractEnabled) external onlyOwner { isContractEnabled = _isContractEnabled; }
  function getTotalBlobbsNumber() public view returns(uint) { return _blobIDs.current(); }
  function checkActionsConditions() private view {
    require(isContractEnabled); //"Contract is stopped!"
    require(theKingOfBlobbs == 0); //"The Battle is over!"
    ownerOf(ownedBlob[msg.sender]);
  }
  function checkMintConditions(address _blobCreator, uint[6] memory _colors) private view {
    require(isContractEnabled); //"Contract is stopped!"
    require(_blobIDs.current() < maxSupply); //"Max exceeded!"
    for(uint256 i = 0; i < _colors.length; i++) { require(_colors[i] <= 255); } //"Invalid colors!"
    require(ownedBlob[_blobCreator] == 0); //"You already OWN a Blobb!"
  }
  

  function getImageURI(uint256 _blobID) public view returns(string memory) {
    bytes memory svg = _svgChunks.getSVGChunk(0);
    for(uint i = 1; i < _svgChunks.getTotalChunksNumber(); i++) {
      svg = abi.encodePacked(svg, blobs[_blobID].values[i-1], _svgChunks.getSVGChunk(i));
    }
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

  function _newDefaultBlob(uint256 _blobID, address _creator, uint[6] memory _colors, uint _blobType) internal {
    Blob storage blob = blobs[_blobID];
    blob.blobID = _blobID;
    blob.birthday = block.timestamp;
    blob.hp = 10;
    blob.totalAttacks = 10;
    blob.creator = _creator;
    blob.owner = _creator;
    blob.blobType = _blobType;
    if(_blobType == 4) _colors[0] = 256; //TO UNDERSTAND IF IT IS MULTICOLOR
    blobbColors[_blobID] = _colors;

    bytes memory _startRGB = abi.encodePacked(_colors[0].toString(), ",", _colors[1].toString(), ",", _colors[2].toString());
    bytes memory _endRGB = abi.encodePacked(_colors[3].toString(), ",", _colors[4].toString(), ",", _colors[5].toString());
    bytes memory _b1 = bytes("1");
    // bytes memory _gradient = _blobID > 50 ? bytes("T") : bytes("C"); //10
    
    blob.values[0] = _startRGB; //FIRST COLOR
    blob.values[1] = _endRGB; //SECOND COLOR
    blob.values[2] = _b1; //HP TO ALPHA VALUE
    blob.values[3] = _blobID > 50 ? bytes("T") : bytes("C"); //GOLD OR WHITE GRADIENT
    if(_blobType < 4) blob.values[4] = _b1; //MULTI COLOR BLOBB ANIMATION
    if(_blobType == 0 || _blobType == 2) blob.values[5] = _b1; //CIRCLE LEVEL ANIMATED
    blob.values[6] = _b1; //VERIFIED OPACITY
    blob.values[7] = bytes("0"); //CROWN OPACITY
    blob.values[8] = bytes("10"); //EXP CIRCLE BAR
    blob.values[9] = _b1; //LEVEL NUMBER
    blob.values[10] = bytes(_blobID.toString()); //BLOB ID
    blob.values[11] = abi.encodePacked(SVGChunksTool.substring(_creator.toHexString(), 0, 5), "...", SVGChunksTool.substring(_creator.toHexString(), 38, 42)); //OWNER ADDRESS
    if(_blobType < 2) blob.values[12] = _b1; //STROKE GRADIENT ANIMATED


    // if(_blobType == 0 || _blobType == 2) blob.values[0] = _b1; //CIRCLE LEVEL ANIMATED
    // blob.values[1] = _b1; //VERIFIED
    // blob.values[2] = bytes("0"); //CROWN OPACITY
    // blob.values[3] = _gradient; //GOLD OR WHITE EXP BAR GRADIENT
    // blob.values[4] = bytes("10"); //EXP CIRCLE BAR
    // blob.values[5] = _gradient; //GOLD OR WHITE LEVEL GRADIENT
    // blob.values[6] = _b1; //LEVEL NUMBER
    // blob.values[7] = bytes(_blobID.toString()); //BLOB ID
    // blob.values[8] = abi.encodePacked(SVGChunksTool.substring(_creator.toHexString(), 0, 5), "...", SVGChunksTool.substring(_creator.toHexString(), 38, 42)); //OWNER ADDRESS
    // blob.values[9] = _startRGB; //FIRST COLOR
    // blob.values[10] = _b1; //ALPHA FIRST COLOR
    // blob.values[11] = _endRGB; //SECOND COLOR
    // blob.values[12] = _b1; //ALPHA SECOND COLOR
    // blob.values[13] = _startRGB; //STROKE FIRST COLOR
    // blob.values[14] = _endRGB; //STROKE SECOND COLOR
    // if(_blobType < 2) blob.values[15] = _b1; //STROKE GRADIENT ANIMATED
  }

  function _updateValue(uint _blobID, uint _vIDX, bytes memory _value) internal {
    blobs[_blobID].values[_vIDX] = _value;
  }

  function getBlobURI(uint256 _blobID) public view returns(string memory) {
    Blob storage blob = blobs[_blobID];
    return string(abi.encodePacked("data:application/json;base64,",Base64.encode(abi.encodePacked(
      '{"name":"BLOBB #', _blobID.toString(), '","description":"BLOBBs On-Chain Battle!","attributes":[{"trait_type":"HP","value":', blob.hp.toString(), '},{"trait_type":"LEVEL","max_value":99,"value":', blob.totalAttacks < 1000 ? (blob.totalAttacks/10).toString() : "99", '},{"trait_type":"FEATURES","value":"', blob.blobType == 4 ? "MULTI-COLOR" : blob.blobType.toString() ,'"},{"trait_type":"TEXT","value":"', _blobID > 50 ? "DEFAULT" : "GOLD" ,'"}],"image":"', getImageURI(_blobID), '"}'
    ))));
  }

  function mintBlob(uint[6] memory _colors, uint _blobType) public payable {
    checkMintConditions(msg.sender, _colors);
    require(msg.value == mintPrice + (0.0025 ether * _blobType)); //"Wrong MINT value!"
    require(_blobType < 4);
    kingsTreasure += 0.0025 ether; //5 MATIC
    _mintBlob(msg.sender, _colors, _blobType);
  }
  function mintGiftBlob(address _creatorAddress, uint[6] memory _colors, uint _blobType) external onlyOwner {
    checkMintConditions(_creatorAddress, _colors);
    _mintBlob(_creatorAddress, _colors, _blobType);
  }

  function _mintBlob(address _creatorAddress, uint[6] memory _colors, uint _blobType) internal {
    _blobIDs.increment();
    uint256 newBlobID = _blobIDs.current();
    _safeMint(_creatorAddress, newBlobID);

    _newDefaultBlob(newBlobID, _creatorAddress, _colors, _blobType);
    ownedBlob[_creatorAddress] = newBlobID;

    _setTokenURI(newBlobID, getBlobURI(newBlobID));
    emit NewBlobb(newBlobID, _creatorAddress);
  }

  function attackBlob(uint256 _blobID) public payable {
    checkActionsConditions();
    Blob storage blob = blobs[_blobID];
    uint attackerBlobID = ownedBlob[msg.sender];
    Blob storage attackerBlob = blobs[attackerBlobID];

    require(ownedBlob[msg.sender] != _blobID); //"You can't ATTACK your own Blobb!"
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

    bytes memory _b1 = bytes("1");
    if(totalDeadBlobs == maxSupply-1) { //999
      theKingOfBlobbs = attackerBlobID;
      //CROWN OPACITY -> 7
      _updateValue(attackerBlobID, 7, _b1);
    }

    //ATTACKED BLOBB METADATA UPDATE
    bytes memory _hpToAlpha = blob.hp == 10 ? _b1 : abi.encodePacked(".", blob.hp.toString());
      //HP TO ALPHA VALUE -> 2
    _updateValue(_blobID, 2, _hpToAlpha);

    //ATTACKER BLOBB METADATA UPDATE
    
      //EXP CIRCLE BAR -> 8
    _updateValue(attackerBlobID, 8, attackerBlob.totalAttacks < 1000 ? abi.encodePacked((10 - attackerBlob.totalAttacks % 10).toString()) : bytes("0"));
      //LEVEL NUMBER -> 9
    _updateValue(attackerBlobID, 9, attackerBlob.totalAttacks < 1000 ? abi.encodePacked((attackerBlob.totalAttacks/10).toString()) : bytes("99"));

    blobbHistory[_blobID][blob.totalActions] = attackerBlobID;

    _setTokenURI(_blobID, getBlobURI(_blobID));
    _setTokenURI(attackerBlobID, getBlobURI(attackerBlobID));

    emit Action(_blobID, attackerBlobID, blob.hp, attackerBlob.totalAttacks, theKingOfBlobbs);
  }

  function healBlob(uint256 _blobID) public payable {
    checkActionsConditions();
    Blob storage blob = blobs[_blobID];
    require(ownedBlob[msg.sender] == _blobID); //"Not your BLOBB!"
    require(blob.hp != 0, "Your Blobb is dead!");
    require(blob.hp < 10, "Your Blobb has FULL HP!");
    require(msg.value == healPrice, "Wrong HEAL value!");

    blob.hp++;
    blob.totalActions++;

    //HEALED BLOBB METADATA UPDATE
    bytes memory _hpToAlpha = blob.hp == 10 ? bytes("1") : abi.encodePacked(".", blob.hp.toString());
      //HP TO ALPHA VALUE -> 2
    _updateValue(_blobID, 2, _hpToAlpha);

    blobbHistory[_blobID][blob.totalActions] = ownedBlob[msg.sender];

    _setTokenURI(_blobID, getBlobURI(_blobID));

    emit Action(_blobID, 0, blob.hp, blob.totalAttacks, theKingOfBlobbs);
  }

  function _transfer(address from, address to, uint256 tokenId) internal virtual override {
    require(balanceOf(to) == 0, "Blobb Owner!");
    super._transfer(from, to, tokenId);

    delete ownedBlob[from];
    ownedBlob[to] = tokenId;

    Blob storage blob = blobs[tokenId];
    blob.owner = to;

    //TRANSFERED BLOBB METADATA UPDATE
      //VERIFIED OPACITY -> 6
    _updateValue(tokenId, 6, blob.owner == blob.creator ? bytes("1") : bytes("0"));
      //OWNER ADDRESS -> 11
    _updateValue(tokenId, 11, abi.encodePacked(SVGChunksTool.substring(to.toHexString(), 0, 5), "...", SVGChunksTool.substring(to.toHexString(), 38, 42))); //OWNER ADDRESS

    _setTokenURI(tokenId, getBlobURI(tokenId));
  }

  function withdraw(uint _forTheKing) external onlyOwner {
    require(theKingOfBlobbs != 0 || _forTheKing == 0);
    (bool success, ) = payable(_forTheKing == 1 ? blobs[theKingOfBlobbs].owner : owner()).call{value: _forTheKing == 1 ? kingsTreasure : address(this).balance - kingsTreasure}("");
    // (bool success, ) = payable(owner()).call{value: address(this).balance - kingsTreasure}("");
    require(success);
    kingsTreasure = _forTheKing == 1 ? 0 : kingsTreasure; 
    // require(payable(owner()).send(address(this).balance));
  }
  
  receive() external payable {}
}