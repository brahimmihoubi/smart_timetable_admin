import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DepartmentListView } from 'src/sections/departments/view';

const metadata = { title: `Departments | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DepartmentListView />
    </>
  );
}
