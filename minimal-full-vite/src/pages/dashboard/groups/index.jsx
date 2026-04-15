import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GroupListView } from 'src/sections/groups/view';

const metadata = { title: `Groups | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GroupListView />
    </>
  );
}
