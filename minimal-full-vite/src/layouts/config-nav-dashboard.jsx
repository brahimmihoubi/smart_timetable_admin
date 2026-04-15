import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Timetable', path: paths.dashboard.calendar, icon: ICONS.calendar },
      { title: 'Buildings', path: paths.dashboard.buildings, icon: ICONS.tour },
      { title: 'Rooms', path: paths.dashboard.rooms, icon: ICONS.tour },
      { title: 'Departments', path: paths.dashboard.departments, icon: ICONS.user },
      { title: 'Groups', path: paths.dashboard.groups, icon: ICONS.user },
      { title: 'Levels', path: paths.dashboard.levels, icon: ICONS.label },
      { title: 'Courses', path: paths.dashboard.courses, icon: ICONS.course },
      { title: 'Teachers', path: paths.dashboard.teachers, icon: ICONS.user },
      { title: 'Conflicts', path: paths.dashboard.conflicts, icon: ICONS.disabled },
      { title: 'Export', path: paths.dashboard.export, icon: ICONS.file },
    ],
  },
];
