import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RoomListView } from 'src/sections/rooms/view';

const metadata = { title: `Rooms | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RoomListView />
    </>
  );
}
