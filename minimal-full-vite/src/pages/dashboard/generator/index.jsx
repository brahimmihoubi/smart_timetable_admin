import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GeneratorView } from 'src/sections/generator/view/generator-view';

// ----------------------------------------------------------------------

const metadata = { title: `Schedule Generator - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GeneratorView />
    </>
  );
}
