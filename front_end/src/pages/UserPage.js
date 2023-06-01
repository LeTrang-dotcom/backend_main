import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useParams } from "react-router-dom";
// import { sentenceCase } from 'change-case';
// import { useState } from 'react';


import { useEffect, useState } from "react";
import axios from "axios";

import * as React from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Link,
  Box,
  Modal,
} from '@mui/material';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
// ----------------------------------------------------------------------

// 1
const TABLE_HEAD = [
  { id: 'user_id', label: 'ID', alignRight: false },
  { id: 'user_name', label: 'Full Name', alignRight: false },
  { id: 'user_image', label: 'Avatar', alignRight: false},
  { id: 'user_email', label: 'Email', alignRight: false},
  { id: '' },

];

// ----------------------------------------------------------------------
// function ChildModal() {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <Link onClick={handleOpen} color="error" underline="none">
//             {'Delete'}
//       </Link>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="child-modal-title"
//         aria-describedby="child-modal-description"
//       >
//         <Box sx={{ ...style}}>
//           <h2 id="child-modal-title">Warning!</h2>
//           <p id="child-modal-description">
//             Are you sure you want to delete it?
//           </p>
//           <Button  variant="contained" onClick={handleClose} color='secondary' sx={{ml: 22, mr:1}}>Close</Button>
//           <Button variant="contained" onClick={handleClose} color="error" >Delete</Button>
//         </Box>
//       </Modal>
//     </>
//   );
// }
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.user_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

const [users, setUsers] = useState([]);

useEffect(() => {
  loadUsers();
}, []);
const loadUsers = async () => {
  const result = await axios.get("http://localhost:8080/users/getAll");
  setUsers(result.data);
};
const deleteUser = async (id) => {
  await axios.delete(`http://localhost:8080/users/delete/${id}`);
  loadUsers();
  handleClose();
};
  

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  function ChildModal() {

    const deleteUser = async (id) => {
      await axios.delete(`http://localhost:8080/users/delete/${id}`);
      loadUsers();
      handleClose();
    };
    return (
      <>
        <Link onClick={handleOpen} color="error" underline="none">
              {'Delete'}
        </Link>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style}}>
            <h2 id="child-modal-title">Warning!</h2>
            <p id="child-modal-description">
              Are you sure you want to delete it?
            </p>
            <Button  variant="contained" onClick={handleClose} color='secondary' sx={{ml: 22, mr:1}}>Close</Button>
            <Button variant="contained" onClick={deleteUser} color="error" >Delete</Button>
          </Box>
        </Modal>
      </>
    );
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

    
    return (
      <>
        <Helmet>
          <title> User | Minimal UI </title>
        </Helmet>
  
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              User
            </Typography>
            <Button variant="contained" href='/api/users/add' startIcon={<Iconify icon="eva:plus-fill" />}>
              New User
            </Button>
          </Stack>
  
          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
            
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      // const { id, name, image, email } = row;
                      const selectedUser = selected.indexOf(row.user_name) !== -1;
                      
                      return (
                        
                        <TableRow hover key={row.user_id} tabIndex={-1} selected={selectedUser}>
                          {/* <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                          </TableCell> */}
                          <TableCell align = "left">{row.user_id}</TableCell>
                          <TableCell align = "left">{row.user_name}</TableCell>
  
                          <TableCell align = "left" component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={row.user_name} src={row.user_image} />
                            </Stack>
                          </TableCell>
  
                          <TableCell align="left">{row.user_email}</TableCell>
  
  
                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* {users.map((user) => {
                        return (
                          <TableRow hover key={user.userId} tabIndex={-1} >
                            <TableCell align = "left">{user.user_id}</TableCell>
                            <TableCell align = "left">{user.user_name}</TableCell>
    
                            <TableCell align = "left" component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={user.user_name} src={user.user_image} />
                              </Stack>
                            </TableCell>
    
                            <TableCell align="left">{user.user_email}</TableCell>
    
    
                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                <Iconify icon={'eva:more-vertical-fill'} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                    })} */}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
  
                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>
  
                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>
  
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
  
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} /> 
            <Link href="/api/users/edit" underline="none">
              {'Edit'}
            </Link>
          </MenuItem>
          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            <ChildModal/>
          </MenuItem>
        </Popover>
      </>
    );
  
  
}
