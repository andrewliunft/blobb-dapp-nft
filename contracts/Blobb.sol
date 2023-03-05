// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SVGChunksTool.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title Blobb
 * @author Sawyheart
 * @notice A BLOBB is a Dynamic On-Chain NFT that will change in its metadata and graphics based on the 
 * owner and other players Actions. Try to be the last standing BLOBB and win a unique item and a cash prize.
 */
contract Blobb is ERC721URIStorage, Ownable {
  using Strings for uint256;
  using Strings for address;
  using SVGChunksTool for SVGChunksTool.SVGChunks;
  using Counters for Counters.Counter;

  /// @dev Value that stops all the Contract functions except for the transfer() and withdraw().
  bool public isContractEnabled;

  /// @dev Where all the SVG chunks are stored and correctly and neatly separated to be merged with the proper values.
  SVGChunksTool.SVGChunks private _svgChunks;

  /// @dev Counter of the IDs minted to date.
  Counters.Counter private _blobIDs;

  /// @notice All the Actions prices.
  uint256 constant public mintPrice = 15 ether; //15 MATIC * blobType (1.5 MATIC)
  uint256 constant public attackPrice = 5 ether; //+ 2.5 MATIC if killing
  uint256 constant public healPrice = 2.5 ether; //0.001
  uint256 constant public maxSupply = 1000;

  /// @dev Event emitted when a new BLOBB is minted.
  event NewBlobb(uint indexed newBlobID, address indexed newOwner);

  /// @dev Event emitted when a BLOBB performs any action. 
  event Action(uint indexed toBlobID, uint indexed madeFrom, uint newHP, uint newTotAttks, uint kingOfBlobbs);
  
  /// @dev The BLOBB structure.
  struct Blob {
    uint256 blobID;
    uint256 birthday;
    uint256 hp;
    uint256 totalActions; /// @dev As the IDX of the blobbHistory mapping.
    uint256 totalAttacks; /// @dev To take track of the level of the BLOBB.
    uint256 kills;
    uint256 deathDate; 
    address creator;
    address owner;
    address lastHit;
    uint blobType;
    mapping(uint => bytes) values; /// @dev Ordered values to be inserted in the RAW SVG.
  }

  /// @dev A mapping of all BLOBBs.
  mapping(uint256 => Blob) public blobs;

  /// @dev A mapping of all BLOBBs' owners.
  mapping(address => uint256) public ownedBlob;

  /// @dev The number of all dead BLOBBs.
  uint public totalDeadBlobs;

  /// @dev A mapping of all dead BLOBBs in chronological order using totalDeadBlobs.
  mapping(uint => uint) public deadBlobs;

  /// @dev A mapping of the colors of all BLOBBs. [0-2]: start color, [3-5]: end color.
  mapping(uint256 => uint[6]) public blobbColors;

  /// @dev A mapping to reconstruct the action history of each BLOBB. id => idx => actorID: actorId == id -> HEAL Action, ATTACK instead. 
  mapping(uint256 => mapping(uint256 => uint256)) public blobbHistory;

  /// @dev Where the blobID of the KING OF BLOBBs will be stored.
  uint public theKingOfBlobbs;

  /// @dev amount of MATIC which will be withdrawn by the KING OF BLOBBs.
  uint public kingsTreasure;

  /// @dev A different constructor without the SVG chunks to stored: BETTER IN DEPLOY COSTS.
  // constructor() ERC721 ("BLOBB", "BLOBB") {}

  /** 
   * @dev Initializes the BLOBB contract by passing the SVG chunks to store in the SVGChunksTool instance _svgChunks.
   * BETTER IN CONTRACT SIZE.
   * @param _svg the SVG string chunks correctly separated and converted into Bytes in the deploy.js script.
   */
  constructor(bytes[] memory _svg) ERC721 ("BLOBB", "BLOBB") { 
    _svgChunks.uploadSVG(_svg);
  }

  // function uploadSVG(bytes[] memory _svg) external onlyOwner { _svgChunks.uploadSVG(_svg); }

  /**
   * @dev It allows me to replace a specific SVG chunk of SVGChunksTool instance _svgChunks.
   * @param _nChunkIDX The specific chunk that I will update.
   * @param _nChunk The new chunk that now will be used.
   */
  function updateSVGChunk(uint _nChunkIDX, bytes memory _nChunk) external onlyOwner { 
    _svgChunks.updateSVGChunk(_nChunkIDX, _nChunk);
  }

  /**
   * @dev Setter of isContractEnabled value.
   * @param _isContractEnabled New value to assign to the storage variable isContractEnabled.
   */
  function setIsContractEnabled(bool _isContractEnabled) external onlyOwner { 
    isContractEnabled = _isContractEnabled;
  }

  /// @dev Function to get the total BLOBBs number from the Counter.
  function getTotalBlobbsNumber() public view returns(uint) { 
    return _blobIDs.current();
  }

  /// @dev Common conditions to be met when a BLOBB invoke an action.
  function checkActionsConditions() private view {
    require(isContractEnabled); // "Contract is stopped!"
    require(theKingOfBlobbs == 0); // "The Battle is over!"
    ownerOf(ownedBlob[msg.sender]);
  }

  /// @dev Commmon conditions to be met when a user mint a new BLOBB.
  function checkMintConditions(address _blobCreator, uint[6] memory _colors) private view {
    require(isContractEnabled); // "Contract is stopped!"
    require(_blobIDs.current() < maxSupply); // "Max exceeded!"
    for(uint256 i = 0; i < _colors.length; i++) { require(_colors[i] <= 255); } // "Invalid colors!"
    require(ownedBlob[_blobCreator] == 0); // "You already OWN a Blobb!"
  }

  /**
   * @dev Where the SVG chunks are merged whit the BLOBB's values creating a single RAW SVG file and a full image URI.
   * @param _blobID The BLOBB id from which we will take the values.
   * @return string The new updated image URI for the BLOBB _blobID is returned in form of string. 
   */
  function getImageURI(uint256 _blobID) public view returns(string memory) {
    bytes memory svg = _svgChunks.getSVGChunk(0);
    for(uint i = 1; i < _svgChunks.getTotalChunksNumber(); i++) {
      svg = abi.encodePacked(svg, blobs[_blobID].values[i-1], _svgChunks.getSVGChunk(i));
    }
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

  /**
   * @dev The initialization of a BLOBB when is just minted, where all the Blob struct values are set up.
   * @param _blobID The ID of the new BLOBB. 
   * @param _creator The creator address of the new BLOBB. 
   * @param _colors The colors in RGB formats that the user choose for the BLOBB. 
   * @param _blobType The type of BLOBB that the user choose. 
   */
  function _newDefaultBlob(uint256 _blobID, address _creator, uint[6] memory _colors, uint _blobType) internal {
    Blob storage blob = blobs[_blobID];
    blob.blobID = _blobID;
    blob.birthday = block.timestamp;
    blob.hp = 10;
    blob.totalAttacks = 10;
    blob.creator = _creator;
    blob.owner = _creator;
    blob.blobType = _blobType;
    if(_blobType == 4) _colors[0] = 256; // TO EASILY UNDERSTAND IF IT IS MULTICOLOR IN MY DAPP.
    blobbColors[_blobID] = _colors;

    bytes memory _startRGB = abi.encodePacked(_colors[0].toString(), ",", _colors[1].toString(), ",", _colors[2].toString());
    bytes memory _endRGB = abi.encodePacked(_colors[3].toString(), ",", _colors[4].toString(), ",", _colors[5].toString());
    bytes memory _b1 = bytes("1");
    
    blob.values[0] = _startRGB; // FIRST COLOR
    blob.values[1] = _endRGB; // SECOND COLOR
    blob.values[2] = _b1; // HP TO ALPHA VALUE
    blob.values[3] = _blobID > 50 ? bytes("T") : bytes("C"); // GOLD OR WHITE GRADIENT
    if(_blobType < 4) blob.values[4] = _b1; // MULTI COLOR BLOBB ANIMATION
    if(_blobType == 0 || _blobType == 2) blob.values[5] = _b1; // CIRCLE LEVEL ANIMATED
    blob.values[6] = _b1; // VERIFIED OPACITY
    blob.values[7] = bytes("0"); // CROWN OPACITY
    blob.values[8] = bytes("10"); // EXP CIRCLE BAR
    blob.values[9] = _b1; // LEVEL NUMBER
    blob.values[10] = bytes(_blobID.toString()); // BLOB ID
    blob.values[11] = abi.encodePacked(SVGChunksTool.substring(_creator.toHexString(), 0, 5), "...", SVGChunksTool.substring(_creator.toHexString(), 38, 42)); // OWNER ADDRESS
    if(_blobType < 2) blob.values[12] = _b1; // STROKE GRADIENT ANIMATED
  }

  /**
   * @dev Update the values of a specific BLOBB, values that will update the graphic of the BLOBB when getImageURI() rebuild the new URI.
   * @param _blobID The ID of the BLOBB whose value we want to update.
   * @param _vIDX The index (key) of the mapping whose value is to be changed.
   * @param _value The new value we're going to put in the values mapping.
   */
  function _updateValue(uint _blobID, uint _vIDX, bytes memory _value) internal {
    blobs[_blobID].values[_vIDX] = _value;
  }

  /**
   * @dev Create the full URI to assign it to the token to properly diplay the NFT with its attributes.
   * @param _blobID The BLOBB for which and from which the URI is built. 
   */
  function getBlobURI(uint256 _blobID) public view returns(string memory) {
    Blob storage blob = blobs[_blobID];
    return string(abi.encodePacked("data:application/json;base64,",Base64.encode(abi.encodePacked(
      '{"name":"BLOBB #', _blobID.toString(), '","description":"BLOBBs On-Chain Battle!","attributes":[{"trait_type":"HP","value":', blob.hp.toString(), '},{"trait_type":"LEVEL","max_value":99,"value":', blob.totalAttacks < 1000 ? (blob.totalAttacks/10).toString() : "99", '},{"trait_type":"TYPE","value":"', blob.blobType == 4 ? "MULTI-COLOR" : blob.blobType.toString() ,'"},{"trait_type":"TEXT","value":"', _blobID > 50 ? "DEFAULT" : "GOLD" ,'"},{"trait_type":"STATUS","value":"', blob.hp == 0 ? "DEAD" : theKingOfBlobbs == _blobID ? "KING" : "ALIVE" ,'"},{"trait_type":"KILLS","value":"', blob.kills.toString() ,'"}],"image":"', getImageURI(_blobID), '"}'
    ))));
  }

  /**
   * @dev The mint public function callable by the users.
   * @param _colors The colors the user choose for the BLOBB.
   * @param _blobType The type the user choose for the BLOBB.
   */
  function mintBlob(uint[6] memory _colors, uint _blobType) public payable {
    checkMintConditions(msg.sender, _colors);
    require(msg.value == mintPrice + (1.5 ether * _blobType)); // "Wrong MINT value!"
    require(_blobType < 4); // The multicolor BLOBB is only giftable by me.
    kingsTreasure += 5 ether; // 5 MATIC will be saved for the KING OF BLOBBs.
    _mintBlob(msg.sender, _colors, _blobType);
  }

  /**
   * @dev My mint function where i can gift some BLOBBs.
   * @param _creatorAddress The address to which I'll gift the BLOBB.
   * @param _colors The colors of the BLOBB I'll gift.
   * @param _blobType The type of the BLOBB I'll gift.
   */
  function mintGiftBlob(address _creatorAddress, uint[6] memory _colors, uint _blobType) external onlyOwner {
    checkMintConditions(_creatorAddress, _colors);
    _mintBlob(_creatorAddress, _colors, _blobType);
  }

  /**
   * @dev The actual minting function, where all operations to mint a new NFT are performed:
   * -Incrementing the ID;
   * -Set all the BLOBB information we mentioned before;
   * -Build the URI of the new BLOBB and set it with the _setTokenURI() function of the ERC721 Smart Contract. 
   */
  function _mintBlob(address _creatorAddress, uint[6] memory _colors, uint _blobType) internal {
    _blobIDs.increment();
    uint256 newBlobID = _blobIDs.current();
    _safeMint(_creatorAddress, newBlobID);

    _newDefaultBlob(newBlobID, _creatorAddress, _colors, _blobType);
    ownedBlob[_creatorAddress] = newBlobID;

    _setTokenURI(newBlobID, getBlobURI(newBlobID));
    emit NewBlobb(newBlobID, _creatorAddress);
  }

  /**
   * @dev Attack the BLOBB, one of the action that a BLOBB NFT could perform. The attack involves changes to:
   * -The Blob struct;
   * -The BLOBB values with which we will build the RAW SVG and the image URI;
   * -The token URI where: image, attributes ecc will be updated.
   * And this is for both sides, the Attacker and the Attacked.
   * @param _blobID Which BLOBB ID the caller is directing the attack to. 
   */
  function attackBlob(uint256 _blobID) public payable {
    checkActionsConditions();
    Blob storage blob = blobs[_blobID];
    uint attackerBlobID = ownedBlob[msg.sender];
    Blob storage attackerBlob = blobs[attackerBlobID];

    require(ownedBlob[msg.sender] != _blobID); // "You can't ATTACK your own Blobb!"
    require(attackerBlob.hp != 0); // "Your Blobb is dead!"
    require(blob.hp != 0); // "Blobb is dead!"

    // Checking if the Attacker is killing the Attacked BLOBB.
    uint killing = blob.hp == 1 ? 1 : 0;
    require(msg.value >= attackPrice + (2.5 ether * killing), "Wrong ATTACK value!");

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

    // If totalDeadBlobs == maxSupply-1 it means that the Attacker kill the last BLOBB. Attacker BLOBB is the KING OF BLOBBs.
    if(totalDeadBlobs == maxSupply-1) { 
      theKingOfBlobbs = attackerBlobID;

      // CROWN OPACITY -> values[7]
      _updateValue(attackerBlobID, 7, _b1);
    }

    // ATTACKED BLOBB METADATA UPDATE
    bytes memory _hpToAlpha = blob.hp == 10 ? _b1 : abi.encodePacked(".", blob.hp.toString());

    // HP TO ALPHA VALUE -> values[2]
    _updateValue(_blobID, 2, _hpToAlpha);


    // ATTACKER BLOBB METADATA UPDATE
    
    // EXP CIRCLE BAR -> values[8]
    _updateValue(attackerBlobID, 8, attackerBlob.totalAttacks < 1000 ? abi.encodePacked((10 - attackerBlob.totalAttacks % 10).toString()) : bytes("0"));
    // LEVEL NUMBER -> values[9]
    _updateValue(attackerBlobID, 9, attackerBlob.totalAttacks < 1000 ? abi.encodePacked((attackerBlob.totalAttacks/10).toString()) : bytes("99"));


    blobbHistory[_blobID][blob.totalActions] = attackerBlobID;

    _setTokenURI(_blobID, getBlobURI(_blobID));
    _setTokenURI(attackerBlobID, getBlobURI(attackerBlobID));

    emit Action(_blobID, attackerBlobID, blob.hp, attackerBlob.totalAttacks, theKingOfBlobbs);
  }

  /**
   * @dev Heal the BLOBB, one of the action that a BLOBB NFT could perform. The Heal involves changes to:
   * -The Blob struct;
   * -The BLOBB values with which we will build the RAW SVG and the image URI;
   * -The token URI where: image, attributes ecc will be updated.
   * @param _blobID The BLOBB ID that will be Healed. 
   */
  function healBlob(uint256 _blobID) public payable {
    checkActionsConditions();
    Blob storage blob = blobs[_blobID];
    require(ownedBlob[msg.sender] == _blobID); // "Not your BLOBB!"
    require(blob.hp != 0); // "Your Blobb is dead!"
    require(blob.hp < 10); // "Your Blobb has FULL HP!"
    require(msg.value == healPrice, "Wrong HEAL value!");

    blob.hp++;
    blob.totalActions++;

    // HEALED BLOBB METADATA UPDATE
    bytes memory _hpToAlpha = blob.hp == 10 ? bytes("1") : abi.encodePacked(".", blob.hp.toString());

    // HP TO ALPHA VALUE -> values[2]
    _updateValue(_blobID, 2, _hpToAlpha);

    blobbHistory[_blobID][blob.totalActions] = ownedBlob[msg.sender];

    _setTokenURI(_blobID, getBlobURI(_blobID));

    emit Action(_blobID, 0, blob.hp, blob.totalAttacks, theKingOfBlobbs);
  }

  /**
   * @dev Handle the transfer of a BLOBB. All the information of a BLOBB will change to fit the new owner.
   * @param from The address from which the BLOBB originated.
   * @param to The new owner that will own the BLOBB.
   * @param tokenId The blobID which will be transferred.
   */
  function _transfer(address from, address to, uint256 tokenId) internal virtual override {
    require(balanceOf(to) == 0, "Blobb Owner!");
    super._transfer(from, to, tokenId);

    delete ownedBlob[from];
    ownedBlob[to] = tokenId;

    Blob storage blob = blobs[tokenId];
    blob.owner = to;

    // TRANSFERED BLOBB METADATA UPDATE

    // VERIFIED OPACITY -> values[6]
    _updateValue(tokenId, 6, blob.owner == blob.creator ? bytes("1") : bytes("0"));
    // OWNER ADDRESS -> values[11]
    _updateValue(tokenId, 11, abi.encodePacked(SVGChunksTool.substring(to.toHexString(), 0, 5), "...", SVGChunksTool.substring(to.toHexString(), 38, 42))); //OWNER ADDRESS

    _setTokenURI(tokenId, getBlobURI(tokenId));
  }

  /**
   * @dev The withdraw function.
   * @param _forTheKing To enable the king to obtain his prize. 
   */
  function withdraw(uint _forTheKing) external onlyOwner {
    require(theKingOfBlobbs != 0 || _forTheKing == 0);
    (bool success, ) = payable(_forTheKing == 1 ? blobs[theKingOfBlobbs].owner : owner()).call{value: _forTheKing == 1 ? kingsTreasure : address(this).balance - kingsTreasure}("");
    require(success);
    kingsTreasure = _forTheKing == 1 ? 0 : kingsTreasure; 
  }
}