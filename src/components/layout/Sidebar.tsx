import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Rule,
  BusinessCenter,
  Payment,
  Workflow,
  People,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
}

const Sidebar = ({ open, drawerWidth }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.roles.includes('Admin');
  const isManagerOrAdmin = user?.roles.includes('Manager') || isAdmin;

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Incentive Rules', icon: <Rule />, path: '/incentive-rules' },
    { text: 'Deals', icon: <BusinessCenter />, path: '/deals' },
    { text: 'Payouts', icon: <Payment />, path: '/payouts' },
    { text: 'Workflows', icon: <Workflow />, path: '/workflows' },
  ];

  const adminMenuItems = [
    { text: 'Users', icon: <People />, path: '/users' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {isManagerOrAdmin && (
        <>
          <Divider />
          <List>
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  disabled={!isAdmin && item.path === '/settings'}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
};

export default Sidebar;
