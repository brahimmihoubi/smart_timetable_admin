import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ExportView } from 'src/sections/export/view/export-view';

// ----------------------------------------------------------------------

const metadata = { title: `Export | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExportView />
    </>
  );
}
