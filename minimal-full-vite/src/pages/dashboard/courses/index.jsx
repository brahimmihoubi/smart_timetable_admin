import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CourseListView } from 'src/sections/courses/view';

const metadata = { title: `Courses | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CourseListView />
    </>
  );
}
