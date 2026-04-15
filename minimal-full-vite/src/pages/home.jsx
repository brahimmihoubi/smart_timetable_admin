import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Smart Timetable Admin: Optimized Academic Scheduling',
  description:
    'Powerful administrative dashboard for managing courses, teachers, and rooms with automated scheduling and real-time conflict detection.',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <HomeView />
    </>
  );
}
