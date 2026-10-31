import {useEffect} from 'react';
import {Footer, Header} from './components/Chrome';
import {ShopHome} from './components/ShopHome';
import {Gallery} from './components/Gallery';
import {AtelierPage} from './components/AtelierPage';
import {Admin} from './components/Admin';
import {useReducedMotion} from './hooks/useReducedMotion';
import {usePathname} from './lib/router';
import {startScroll} from './lib/scroll';

export default function App() {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);

  const path = usePathname();
  const route = path.replace(/\/$/, '') || '/';
  // The shop pages and the editor are light; the atelier page is dark.
  const light = route !== '/atelier';

  const page =
    route === '/gallery' ? <Gallery /> : route === '/atelier' ? <AtelierPage /> : route === '/admin' ? <Admin /> : <ShopHome />;

  return (
    <>
      <Header light={light} />
      <main>{page}</main>
      <Footer />
    </>
  );
}