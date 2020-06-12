import React, { Suspense } from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Loader from '../Loader/Loader'
import AuthContainer from '../Auth/AuthContainer'

const Main = React.lazy(() => import('../Main/Main'))

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
   root: {
      display: 'flex',
   },
   appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
      backgroundColor: '#4caf50'
   },
   drawer: {
      [theme.breakpoints.up('sm')]: {
         width: drawerWidth,
         flexShrink: 1,
      }
   },
   drawerPaper: {
      width: drawerWidth,
      backgroundColor: 'lightgrey',
   },
   // necessary for content to be below app bar
   toolbar: theme.mixins.toolbar,
   content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
   },
   }));

const theme = createMuiTheme({
   palette: {
      primary: {
         main: '#4caf50'
      }
   },
});

export default function ProfileDrawer() {
   const classes = useStyles();

   return (
      <div className={classes.root}>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
               <Toolbar>
                  <h2 style={{color:'#fff'}}>Crypto game</h2>
               </Toolbar>
            </AppBar>
            <main className={classes.content}>
               <div className={classes.toolbar} />
               <Suspense fallback={<Loader/>}>
                  <Main />
               </Suspense>   
            </main>
            <Drawer
               className={classes.drawer}
               variant="permanent"
               classes={{
                  paper: classes.drawerPaper,
               }}
               anchor="right"
            >
               <AuthContainer />
            </Drawer>
         </ThemeProvider>
      </div>
   );
}