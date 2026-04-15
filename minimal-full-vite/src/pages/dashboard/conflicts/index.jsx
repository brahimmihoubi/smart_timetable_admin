import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ConflictListView } from 'src/sections/conflicts/view/conflict-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Conflict Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ConflictListView />
    </>
  );
}
