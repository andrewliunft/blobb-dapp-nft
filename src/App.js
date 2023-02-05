import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

import HomePage from './components/HomePage';
import BlobbHome from './components/BlobbHome';
import SearchBlobb from './components/SearchBlobb';
import SearchedBlobb from './components/SearchedBlobb';
import EnemyBlobbs from './components/EnemyBlobbs';
import MyHistory from './components/MyHistory';
import Problem from './components/Problem';
import OwnerPage from './components/OwnerPage';

import { EtherProvider } from './contexts/EtherContext/EtherProvider';
import { MyBlobProvider } from './contexts/MyBlobContext/MyBlobProvider';
import { BlobbsProvider } from './contexts/BlobbsContext/BlobbsProvider';

// mumbai contract: 0x7995988461F28D587f330ba286A31ddE5380F7f8
// goerli contract: 0xDEFF190389D304ba2Acf04bfF7783DAd19Da6EC8

function App() {
  return (
    <EtherProvider>
      <MyBlobProvider>
        <BlobbsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={ <HomePage /> } />
              <Route path="/bhome" element={ <BlobbHome /> } />
              <Route path="/bsearch" element={ <SearchBlobb /> } />
              <Route path="/bsearch/sblobb" element={ <SearchedBlobb /> } />
              <Route path="/benemy" element={ <EnemyBlobbs /> } /> 
              <Route path="/history" element={ <MyHistory /> } />
              <Route path="/op" element={ <OwnerPage /> } />
              <Route path="*" element={ <Problem problem={404} /> } />
            </Routes>
          </Layout>
        </BlobbsProvider>
      </MyBlobProvider>
    </EtherProvider>
    
  );
}

export default App;
