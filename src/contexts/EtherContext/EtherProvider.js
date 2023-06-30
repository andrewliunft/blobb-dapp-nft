import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useState,
} from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import Blobb from "../../artifacts/contracts/Blobb.sol/Blobb.json";

let { networkConfig } = require("../../helper-data.js");
let { POPUPS_TYPES } = require("../../popups-types");

//POLYGON ADDRESS: 0x0BE7Cc803BD24358652a7C9078a6F54514Da13a0
const CONTRACT_ADDRESS = "0xC8E265bD660Ba1F97c2D65132E2011794F0648b9"; //"0x7C485eA3EeEd1BEf1C46A98a794C9eD6dd90EfAC - 0xab332Fe99cF084b000C1c75F005Ef12eFDB2571b - 0xaDBd17B51aaF3348Efe68078d6DA4AaF0A1Ab487"

const wsAlchemySettings = {
  apiKey: process.env.REACT_APP_ALCHEMY_POLYGON_ID, // ALCHEMY_ID - ALCHEMY_POLYGON_ID
  network: Network.MATIC_MUMBAI, //MATIC_MAINNET - MATIC_MUMBAI
};

const EtherContext = createContext();

const ACTIONS = { INIT: "init", SET: "set", RESET: "reset" };
const initialState = {
  account: null,
  provider: null,
  alchemy: null,
  signer: null,
  chain: null,
  contract: null,
  pending: null,
  popups: [],
};
const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case ACTIONS.INIT:
      return { ...state, ...data };
    case ACTIONS.SET:
      return { ...state, ...data };
    case ACTIONS.RESET:
      return { ...state, ...initialState };
    default:
      return state;
    // throw new Error("Undefined reducer action type")
  }
};

export function EtherProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [asyncPopup, setAsyncPopup] = useState(null);

  const init = useCallback(async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const alchemy = new Alchemy(wsAlchemySettings);
      const account = accounts[0];
      const signer = provider.getSigner();
      const chain = (await provider.getNetwork()).chainId;
      // console.log("Balance", ethers.utils.formatEther(await provider.getBalance(CONTRACT_ADDRESS)), chain)

      let contract;
      try {
        contract = new ethers.Contract(CONTRACT_ADDRESS, Blobb.abi, signer);
      } catch (err) {
        console.error(err);
      }
      dispatch({
        type: ACTIONS.INIT,
        data: { account, provider, alchemy, signer, contract, chain },
      });
    } else alert("Install MetaMask!");
  }, []);

  const connect = async () => {
    // console.log("CONNECT", state)
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });
  };

  const switchChain = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ethers.utils.hexValue(networkConfig.networks[0]) }],
    });
  };

  const disconnect = useCallback(() => {
    // console.log("DISCONNECT")
    dispatch({ type: ACTIONS.RESET });
  }, []);

  const walletRequest = async (tName, tDesc, tFunc, successPopup) => {
    if (state.pending) return;

    const pending = { txName: tName, txDesc: tDesc };
    dispatch({ type: ACTIONS.SET, data: { pending } });
    try {
      await tFunc();
      const pending = null;
      dispatch({ type: ACTIONS.SET, data: { pending } });
      if (successPopup) setAsyncPopup([successPopup]);
    } catch (err) {
      console.error(err);
      // pushNewPopup(err.code === -32603 ? POPUPS_TYPES.FUNDS : err.code === "ACTION_REJECTED" ? POPUPS_TYPES.REJECTED : POPUPS_TYPES.FAILED)
      const pending = null;
      dispatch({ type: ACTIONS.SET, data: { pending } });
      const pType =
        err.code === -32603
          ? POPUPS_TYPES.FUNDS
          : err.code === "ACTION_REJECTED"
          ? POPUPS_TYPES.REJECTED
          : POPUPS_TYPES.FAILED;
      setAsyncPopup([pType]);
    }
  };

  useEffect(() => {
    if (asyncPopup) pushNewPopup(asyncPopup[0]);
  }, [asyncPopup]);

  const pushNewPopup = (popupType) => {
    // const popups = [...state.popups]
    // console.log("BEFOR PUSH: ", state.popups)
    const idxValue = state.popups.length
      ? state.popups[state.popups.length - 1].idx + 1
      : 0;
    const popups = state.popups.concat({ idx: idxValue, pType: popupType });
    // console.log("AFTER PUSH: ", popups)
    dispatch({ type: ACTIONS.SET, data: { popups } });
  };

  const popFirstPopup = () => {
    // console.log("BEFOR POP: ", state.popups)
    const popups = state.popups.find((popup) => popup.idx > 0)
      ? state.popups.map((popup) => {
          return { ...popup, ...{ idx: popup.idx - 1 } };
        })
      : [];
    // console.log("AFTER POP: ", popups)
    dispatch({ type: ACTIONS.SET, data: { popups } });
  };

  useEffect(() => {
    if (!window.ethereum) return alert("No provider found! Install Metamask");

    //FIRST OPENING
    const tryInit = async () => {
      try {
        await init();
        dispatch({ type: ACTIONS.INIT, data: { init: true } });
      } catch (err) {
        console.error(err);
      }
    };
    // console.log("TRY INIT")
    tryInit();

    //EVENTS HANDLER
    // console.log("EVENTS")
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = (changed) => {
      // 0x13881 mumbai
      // console.log("EVENT OCCOURS", state, changed, changed.length, changed.length > 0)
      changed.length > 0 ? init() : disconnect();
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () =>
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
  }, [init, disconnect]);

  const funcs = {
    connectWallet: connect,
    switchWalletChain: switchChain,
    newWalletRequest: walletRequest,
    pushPopup: setAsyncPopup,
    popPopup: popFirstPopup,
  };

  return (
    <EtherContext.Provider value={{ state, dispatch, funcs }}>
      {children}
    </EtherContext.Provider>
  );
}

export default EtherContext;
