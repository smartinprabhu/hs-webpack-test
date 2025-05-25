const COLUMNS = [
  // {
  //   Header: 'Portal id',
  //   accessor: 'employee_id_seq',
  // },
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Employee name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Role',
    accessor: 'user_role_id[1]',
  },
  {
    Header: 'Neighbourhood groups',
    accessor: 'neighbour_groups_ids.length',
  },
];

export default COLUMNS;
