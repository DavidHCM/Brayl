import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import ScreenTraducir from './components/ScreenTraducir';
import ScreenArchivos from './components/ScreenArchivos';
import ScreenAcerca from './components/ScreenAcerca';

export default function App() {
  const [screen, setScreen] = useState('traducir');
  const [fs, setFs]         = useState(16);
  const [hc, setHc]         = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-hc', String(hc));
  }, [hc]);

  useEffect(() => {
    document.documentElement.style.setProperty('--fs', `${fs}px`);
  }, [fs]);

  return (
    <>
      <Nav screen={screen} setScreen={setScreen} fs={fs} setFs={setFs} hc={hc} setHc={setHc} />
      {screen === 'traducir' && <ScreenTraducir fs={fs} setScreen={setScreen} />}
      {screen === 'archivos' && <ScreenArchivos fs={fs} />}
      {screen === 'acerca'   && <ScreenAcerca   fs={fs} />}
    </>
  );
}
