import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TeacherListView } from 'src/sections/teachers/view';

const metadata = { title: `Teachers | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TeacherListView />
    </>
  );
}
