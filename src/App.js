import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import BlobbHome from './components/BlobbHome';
import HomePage from './components/HomePage';

import { EtherProvider } from './contexts/EtherContext/EtherProvider';
import { MyBlobProvider } from './contexts/MyBlobContext/MyBlobProvider';


// mumbai contract: 0x7995988461F28D587f330ba286A31ddE5380F7f8
// goerli contract: 0xDEFF190389D304ba2Acf04bfF7783DAd19Da6EC8

function App() {
  
  const navigate = useNavigate()
  console.log(window)
  return (
    <EtherProvider>
      <MyBlobProvider>
        <Layout>
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/bhome" element={ <BlobbHome /> } />
            <Route path="/battack" element={ <div /> } />
          </Routes>
        </Layout>
      </MyBlobProvider>
    </EtherProvider>
    
  );
}

export default App;
