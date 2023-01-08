import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

import HomePage from './components/HomePage';
import BlobbHome from './components/BlobbHome';
import SearchBlobb from './components/SearchBlobb';
import SearchedBlobb from './components/SearchedBlobb';
import EnemyBlobbs from './components/EnemyBlobbs';
import MyHistory from './components/MyHistory';

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
              <Route path="/gh-pages-url/" element={ <HomePage /> } />
              <Route path="/gh-pages-url/bhome" element={ <BlobbHome /> } />
              <Route path="/gh-pages-url/bsearch" element={ <SearchBlobb /> } />
              <Route path="/gh-pages-url/bsearch/sblobb" element={ <SearchedBlobb /> } />
              <Route path="/gh-pages-url/benemy" element={ <EnemyBlobbs /> } /> 
              <Route path="/gh-pages-url/history" element={ <MyHistory /> } />
            </Routes>
          </Layout>
        </BlobbsProvider>
      </MyBlobProvider>
    </EtherProvider>
    
  );
}

export default App;
