import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

const metadata = { title: `Data Management | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <div style={{ padding: 24 }}>
        <h1>Data Management</h1>
      </div>
    </>
  );
}
