export interface IAppMenu {
  title: string;
  name?: string;
  icon: string;
  link?: string;
  children?: IAppMenu[];
}

const totalmenu: IAppMenu[] = [
  {
    title: 'Admin',
    name: 'admin',
    icon: 'user',
    children: [
      {
        title: 'User List',
        name: 'user-list',
        icon: 'appstore',
        link: '/admin/user',
      },
    ],
  },
  {
    title: 'Interview',
    name: 'interview',
    icon: 'user',
    children: [
      {
        title: 'Category Manage',
        icon: 'appstore',
        link: '/interview/category',
      },
      {
        title: 'Tag Manage',
        icon: 'appstore',
        link: '/interview/tag',
      },
      {
        title: 'Question Manage',
        icon: 'appstore',
        children: [
          {
            title: 'List',
            icon: 'bars',
            link: '/interview/question/list',
          },
          {
            title: 'Create',
            icon: 'plus',
            link: '/interview/question/create',
          },
        ],
      },
    ],
  },
];

export default totalmenu;
