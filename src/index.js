import React,{useState,useEffect,useContext,useRef} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Route,BrowserRouter as Router, Switch,Link,useHistory} from 'react-router-dom';
import {createMuiTheme,ThemeProvider,AppBar, Toolbar, Button, BottomNavigation,BottomNavigationAction, Fab,Grid, Snackbar,IconButton,
Avatar,Popper,Paper,ClickAwayListener,MenuList,MenuItem,useMediaQuery,Card, CardContent, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import {useStyles} from './styles'
import {Home, Explore, Add, Person} from '@material-ui/icons'
import {Skeleton} from '@material-ui/lab'
import { UserProfile, Login, SignUp } from './user';
import {HomePage,Create, Bet,ExplorePage,ExploreDetails} from './home'


export const url = 'http://localhost:8080'
export const Context = React.createContext({})
const Provider = Context.Provider

export function skeletonFunc(num){
    let skeletons = []
    
    for(let i=0; i<num;i++){
        skeletons.push(
            <Grid item xs>
                <Skeleton variant='rect' height={210} width={420}  />
            </Grid>)
    }
    return skeletons
}

function NotFound404(props){
	const desktop = useMediaQuery('(min-width:561px)'),classes=useStyles(),history = useHistory()
	return <Card style={{margin:desktop?'10% 8%':'15% 0%',padding:'15px'}}>
			<Typography className={classes.text} color='primary' style={{fontSize:'20px'}}>404 page not found</Typography>
			<CardContent><Button variant='outlined' color='primary' component={Link} to='/' style={{width:'100%'}}>Go Home</Button> </CardContent>
			<CardContent><Button variant='outlined' color='primary' onClick={()=>history.goBack()} style={{width:'100%'}}>Go Back</Button> </CardContent>
		</Card> 
}


function Routing(props){
  const theme = createMuiTheme({pallete:{primary:{main:''}}}),[context, setContext] =useState({loading:false,user:{}})
  useEffect(()=>{
	fetch(url+'/user',{credentials:'include'}).then(data=>data.json().then(res=>{
		if(res.data){
			
			setContext({loading:false,user:res.data})
		}
	}).catch(err=>{console.log(err);setContext({user:''})})).catch(err=>{console.log(err);setContext({user:''})})
	
},[])
	return context.loading?<Grid container spacing={2}>{skeletonFunc(4).map(skel=>skel)}</Grid>
	: <Provider value={context}> <Router>
        <ThemeProvider theme={theme}>
			<NavBar />
			<Switch>
				<Route exact path='/' component={HomePage} />
				<Route exact path='/explore' component={ExplorePage} />
				<Route path='/bet/' component={Bet} />
				<Route exact path='/create' component={Create} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/signup' component={SignUp} />
				<Route exact path='/logout' component={LogOut} />
				<Route exact path='/pagenotfound404' component={NotFound404} />
				{/* <Route path='/:username' component={UserProfile} /> */}
				<Route path='/explore/:tag' component={ExploreDetails} />

			</Switch>
        </ThemeProvider>
    </Router> </Provider>
}

ReactDOM.render(<Routing />,
  document.getElementById('root')
);

function NavBar(props){
	const [navigationBar,setNavigationBar]=useState('home'),classes = useStyles(),history = useHistory(),[indicator,setIndicator]=useState({open:false,info:''}),
	context = useContext(Context),anchorRef = useRef(null),[open]=useState(false),[userMenu,setUserMenu]=useState(false)
	function handleListKeyDown(event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setUserMenu(false);
        }
      }
	return <> 
		<Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
            <React.Fragment>
                <IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
                <CloseIcon />
                </IconButton>
            </React.Fragment>
            }/>
		<div className={classes.root}>
			<AppBar position='fixed' color='default' className={classes.navbar} >
				<Toolbar>
					<Button component={Link} to='/' >Betting</Button>
					<div className={classes.grow} />
					{context.user.username?
						<Button ref={anchorRef} aria-controls={open ? 'user-menu' : undefined} aria-controls="user-menu" aria-haspopup="true" onClick={(event)=>setUserMenu(event.currentTarget)}>
                    	<Avatar src={context.user.dp} sizes='small' alt={context.user.username} className={classes.icon}/>
						</Button>
						:<Button component={Link} to='/login' color='primary' variant='contained' >Login</Button>}
				</Toolbar>
				<Popper id='user-menu' open={userMenu} onClose={()=>setUserMenu(null)} transition disablePortal anchorEl={anchorRef.current}>
                    <Paper>
                        <ClickAwayListener onClickAway={()=>setUserMenu(false)}>
                            <MenuList autoFocusItem={userMenu} onKeyDown={handleListKeyDown}>
                                <MenuItem><Link to={`/${context.user.username}`} style={{textDecoration:'none'}}>{context.user.username}</Link></MenuItem>
                                <MenuItem><Link to={`/logout`} style={{textDecoration:'none'}}>Logout</Link></MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Popper>
			</AppBar>
		</div>
		<Fab variant='extended' onClick={()=>history.push('/create')} color='primary' className={classes.extendedIcon} >
			<Add /> Create
		</Fab>
		<BottomNavigation showLabels value={navigationBar} onChange={(event,value)=>setNavigationBar(value)} className={classes.bottomNav}>
			<BottomNavigationAction onClick={()=>history.push('/')} value='home' label='Home' icon={<Home />} />
			<BottomNavigationAction onClick={()=>history.push('/explore')} value='explore' label='Explore' icon={<Explore />} />
			<BottomNavigationAction onClick={()=>history.push('/'+context.user.username)} value='user' label='Profile' icon={<Person />} />
		</BottomNavigation>
	</>
}

function LogOut(props){
	const [indicator,setIndicator]=useState({open:true,info:'Logging you out'}),history = useHistory()
	useEffect(()=>{
		fetch(url+'/logout',{credentials:'include'}).then(res=>res.json().then(data=>{
			setIndicator({info:"You're logged out. You'll be redirected to the logging page"})
			setTimeout(()=>history.push('/login',3000))
		})).catch(err=>{console.log(err)})
	},[])
	return <Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
		<React.Fragment>
			<IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
			<CloseIcon />
			</IconButton>
		</React.Fragment>
		}/>
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
