import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LevelListView } from 'src/sections/levels/view';

const metadata = { title: `Levels | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LevelListView />
    </>
  );
}
