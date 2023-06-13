import { useState } from 'react';

const Versions = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className='versions'>
      <li>Electron <code>{versions.electron}</code></li>
      <li>Chromium <code>{versions.chrome}</code></li>
      <li>Node <code>{versions.node}</code></li>
      <li>V8 <code>{versions.v8}</code></li>
    </ul>
  );
};

export default Versions;
