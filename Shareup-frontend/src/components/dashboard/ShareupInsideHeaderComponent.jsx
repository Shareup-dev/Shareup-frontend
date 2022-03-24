import React, { useState, useEffect, useContext } from "react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useHistory } from "react-router-dom";
import AuthService from "../../services/auth.services";
import Form from "react-bootstrap/Form";
import FriendsService from "../../services/FriendService";
import UserService from "../../services/UserService";
import { BiUserPlus } from "react-icons/bi";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import { useSelector } from "react-redux";
import { store } from "../../app/store";
import { setSearchTerm } from "../../app/searchSlice";

import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Badge from "@mui/material/Badge";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';



const ResponsiveAppBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  let history = useHistory();

  const [user, setUser] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [searchedFriendsList, setSearchedFriendsList] = useState([]);
  const [showUserSettings, setShowUserSettings] = useState(false);

  const searchTerm = useSelector((state) => state.search);

  const KeyPressHandler = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      history.push("/searchFeed");
    }
  };

  const currentUserGet = async () => {
    await UserService.getUserByEmail(
      AuthService.getCurrentUser().username
    ).then((res) => {
      setUser(res.data);
    });
  };

  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then(
      (res) => {
        setFriendsList(res.data);
      }
    );
  };

  const handleShowFriendsList = (event) => {
    if (event.target.value === "") {
      setSearchedFriendsList([]);
    } else {
      let temp = [];
      friendsList.map((u) => {
        const email = u.email.toLowerCase();
        const firstname = u.firstName.toLowerCase();
        const lastname = u.lastName.toLowerCase();
        const searchedvalue = event.target.value.toLowerCase();
        if (
          email.includes(searchedvalue) ||
          firstname.includes(searchedvalue) ||
          lastname.includes(searchedvalue)
        ) {
          temp.push(u);
        }
      });
      setSearchedFriendsList(temp);
      console.log(temp);
    }
  };

  const handleLogout = (event) => {
    AuthService.logout();
    history.push("/");
  };

  useEffect(() => {
    getFriendsList();
  }, [searchedFriendsList]);

  useEffect(() => {
    currentUserGet();
  }, []);

  const onUnfocus = () => {
    console.log("hello");
    if (showUserSettings === true) {
      setShowUserSettings(false);
    }
  };
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const pages = [ 
    <a className="top-home" href="/newsfeed" title="Home"> <i className="las la-home" aria-hidden="true" /><span>Feed</span></a>,
    <a className="top-friends" href="/friends" title="Friends"><i className="las la-user-plus" aria-hidden="true" /><span>Friends</span></a>, 
    <a className="top-groups" href="/groups" title="GROUPS"><i className="la la-users" aria-hidden="true" /><span>Groups</span></a>, 
    <a className="top-sharepoint" href="/shareFeed" title="SharePoint"><i className="la la-share-alt" aria-hidden="true" /><span>Share</span></a>, 
    <a className="top-swappoint" href="/swapFeed" title="SwapPoint"><i className="las la-sync-alt" aria-hidden="true" /><span>Swap</span></a>
    ];
  const navSettings = [
    <a href="/profile"><i className="ti-user" />Change Status</a>,
    <a href="/profile"><i className="ti-user" />Profile</a>,
    <a href="/editprofile" title="notif"><i className="ti-pencil-alt" />Edit Profile</a>,
    <a href="Activity" title="notif"><i className="ti-target" />Activity Log</a>,
    <a href="Security" title="notif"><i className="ti-settings" />Account Setting</a>,
    <a href="#!" title="Logout" onClick={handleLogout}><i className="ti-power-off" />Logout</a>,
  ];

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.40),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(2)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('xs')]: {
        width: '7ch',
        '&:focus': {
          width: '10ch',
        },
      },
    },
  }));
  return (
    <AppBar position="fixed" style={{ background: '#fff' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 5, display: { xs: "none", md: "flex" } }}
          >
            <a style={{ marginTop: "10px" }} title="notif" href="/newsfeed">
              <img
                src="../assets/images/Mainlogo.png"
                alt=""
              />
            </a>
          </Typography>
          <Search  sx={{ mr: 8, display: { xs: "none", md: "flex" } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Search  sx={{ mr: 7.5,flexGrow: 0.5, display: { xs: "flex", md: "none" } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
     
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 3, display: { xs: "flex", md: "none" } }}
          >
            <a  style={{ marginTop: "10px" }} title="notif" href="/newsfeed">
              <img src="../assets/images/Mainlogo.png" alt="" />
            </a>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 1, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open navSettings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  <img
                    onClick={() => setShowUserSettings(!showUserSettings)}
                    src={
                      user.profilePicturePath
                        ? fileStorage.baseUrl + user.profilePicturePath
                        : "../assets/images/resources/admin.jpg"
                    }
                    style={{
                      maxWidth: "51.5px",
                      maxHeight: "51.5px",
                      width: "51.5px",
                      height: "51.5px",
                    }}
                    alt=""
                  />
                </Avatar>
              </IconButton>
            </Tooltip>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"

            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ mr: 1 }}

            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {navSettings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

      
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
