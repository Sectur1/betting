import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom'
import { Typography,Paper,useMediaQuery, FormControl, InputLabel,Snackbar, OutlinedInput, Button, IconButton, TextField, LinearProgress, CardContent,Card } from "@material-ui/core"
import {VisibilityOff, Visibility, AccountBox, AccountBoxRounded, Phone} from '@material-ui/icons'
import CloseIcon from '@material-ui/icons/Close'
import {useStyles} from './styles'
import {url} from './index'

export function UserProfile(props){
    const [indicator,setIndicator]=useState({open:false,info:''}),[user,setUser]=useState({}),history=useHistory(),
    [loading,setLoading]=useState(true),desktop = useMediaQuery('(min-width:561px)'),classes=useStyles()
    useEffect(()=>{
        fetch(url+`/${document.location}`,{credentials:'include'}).then(data=>data.json().then(res=>{
            if(res.data){
                setUser(res.data)
                setLoading(false)
            }else{
                history.push('/pagenotfound404')
                setIndicator({open:true,info:'An error occurred'})
            }
        }))
    },[props.location,history])
    return <>
        <Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
            <React.Fragment>
                <IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
                <CloseIcon />
                </IconButton>
            </React.Fragment>
            }/>
        {loading&&<LinearProgress aria-busy={true} style={{top:'60%',position:'fixed'}}/>}
        {user.username&&<Paper style={{margin:desktop?'10% 8%':'15% 0%',padding:'15px'}}>
            <Card style={{marginBottom:'10%'}}>
                <Typography className={classes.text}>User info</Typography>
                <CardContent><Typography className={classes.text}>UserName: {user.username}</Typography></CardContent>
                <CardContent><Typography className={classes.text}>Name: {user.name}</Typography></CardContent>
                <CardContent><Typography className={classes.text}>Phone: {user.phone}</Typography></CardContent>
            </Card>
            <Card style={{marginBottom:'10%'}}>
                <Typography className={classes.text} >bets</Typography>
                {user.bets&&user.bets.map((bet,index)=>
                <CardContent key={index}>
                    <Button component={Link} variant='outlined' color='primary' style={{width:'100%'}} to={{pathname:`/bet/${bet._id}`,value:bet}}>{bet.title}
                        <Typography className={classes.text}> Stake{bet.stake}</Typography>
                    </Button>
                    {bet.creator===user.username&&<Button component={Link} variant='outlined' color='primary' style={{width:'100%'}} to={{pathname:`/bet/${bet._id}`,value:bet}}>{bet.title}
                        <Typography className={classes.text}> Stake{bet.stake}</Typography>
                        <Button component={Link} variant='outlined' color='primary' to={{pathname:`/bet/${bet._id}`,value:bet}}>End bet</Button>
                    </Button>}
                </CardContent>)}
            </Card>
        </Paper>}
    </>
}

export function SignUp(props){
    const classes = useStyles(), [showpassword,setShowpassword]=useState(false),[userValue, setUserValue] = useState(''),[formConfirm, setConfirm] = useState(false),
    [indicator,setIndicator]=useState({open:false,info:''}),[passwordConfirm,setpasswordConfirm]=useState(false),date = new Date(),desktop = useMediaQuery('(min-width:561px)')
    
    function confirmUsername(event){
        setUserValue(event.target.value)
       fetch(url+'/confirm/username',{method:'POST',cors:'no-cors',body:event.target.value}).then((data)=>data.json().then(res=>{
           if(res.data==='ok'){
                setConfirm(true)
                setIndicator({open:true,info:'Yes! You can have that username'});
       }   else{
           setIndicator({open:true,info:'Username already taken'});
           setConfirm(false)}        
       })).catch((err)=>{setIndicator({open:true,info:'An Error occured'})})
   }
   function check(){var confirmpassword = document.getElementById("confirm-password");
        var password = document.getElementById("password")
        confirmpassword.value === password.value&&setpasswordConfirm(true)
    }
    function submit(event){
        setIndicator({open:false})
        if(formConfirm&&passwordConfirm){
            setIndicator({open:false})
            fetch(url+'/signup',{method: 'POST',body:new FormData(event.target)}).then(data=> {data.json().then(res=>{
                if(res.err){
                    setIndicator({open:true,info:'Username Already Exists'})
                }else{
                    document.cookie = 'loggedin=true;Expires=Wed, 31 Dec 2025 23:59:59 GMT'
                    document.cookie = `session=${res.data.session};Expires=Wed, 31 Dec 2025 23:59:59 GMT`
                    document.location = '/';
                }
                })}).catch(err=>{console.log(err);setIndicator({open:true,info:'Sorry An Error occurred try again'})})
        }else{
            window.scrollTo(100,100);setIndicator({open:true,info:'Username Already Exists'})
        }
    }
    return <div >
        <Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
            <React.Fragment>
                <IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
                <CloseIcon />
                </IconButton>
            </React.Fragment>
            }/>
        <Paper style={{margin:desktop?'10% 8%':'15% 5%',padding:'15px'}}>
            <form autoComplete='true' method='post' onSubmit={(event)=>{event.preventDefault();formConfirm?submit(event):setIndicator({open:true,info:"Some fields weren't filled correctly"})}}>
                <Typography className={classes.text}>SignUp</Typography>
                <FormControl fullWidth>
                    <InputLabel  htmlFor="username" >Username</InputLabel>
                        <OutlinedInput id='username' required autoComplete="username" label='Username' minLength='4' name="username"
                        onChange={confirmUsername} value={userValue} endAdornment={<IconButton><AccountBox /></IconButton>}/>
                    </FormControl><br />
                    <FormControl fullWidth margin='normal'>
                    <InputLabel minLength='8' htmlFor="password" >Password</InputLabel>
                        <OutlinedInput id='password' minLength='8' required autoComplete="current-password" type={showpassword ? 'text' : 'password'} label='password'  name="password"
                            endAdornment={<IconButton onClick={()=>{showpassword?setShowpassword(false):setShowpassword(true)}}>
                            {showpassword?<Visibility />:<VisibilityOff/>}</IconButton>}/>
                    </FormControl><br />
                    <FormControl fullWidth margin='normal'>
                    <InputLabel minLength='8' htmlFor="confirm-password" >Confirm password</InputLabel>
                        <OutlinedInput minLength='8' error={passwordConfirm?false:true} id='confirm-password' required autoComplete="current-password" type={showpassword ? 'text' : 'password'} label='password'  name="password"
                        onChange={check} endAdornment={<IconButton onClick={()=>{showpassword?setShowpassword(false):setShowpassword(true)}}>
                            {showpassword?<Visibility />:<VisibilityOff/>}</IconButton>} />
                    </FormControl><br />
                    <FormControl fullWidth margin='normal'>
                        <InputLabel  htmlFor="name" >Name</InputLabel>
                        <OutlinedInput id='name' endAdornment={<IconButton><AccountBoxRounded /></IconButton>} autoComplete='name' name='name' placeholder='Name' label='Name' required/>
                    </FormControl>
                    <TextField autoComplete="bday-day" label='Date of Birth' type="date" InputLabelProps={{shrink: true}} name='dob' required maxDate={`01-01-${date.getFullYear()-13}`}
                        variant='outlined'  margin='normal'  style={{width:'100%'}} /><br />
                    <FormControl fullWidth margin='normal'>
                        <InputLabel  htmlFor="phone" >Phone</InputLabel>
                        <OutlinedInput id='phone' endAdornment={<IconButton><Phone /></IconButton>} autoComplete='phone' name='phone' placeholder='Phone Number (Optional)' label='Phone' />
                    </FormControl><br /> 
                    <Button type='submit' variant='contained' color='primary'>SignUp</Button>
            </form>
            <Button  component={Link} to='/login' color='primary' style={{margin:'5%'}}>Or Login</Button>
        </Paper>
    </div>
}

export function Login(props){
    const classes = useStyles(),[showpassword,setShowpassword]=useState(false),[indicator,setIndicator]=useState({open:false,info:''}),desktop=useMediaQuery('(min-width:561px)')

    function submitForm(event){
        event.preventDefault()
        setIndicator({open:true, info:'Logging you in'})
        fetch(url+'/login',{method:'post',body:new FormData(event.target),credentials:'include'}).then(data=> {data.json().then(res=>{
            if(res.err){
                setIndicator({info:'Invalid username or Email',open:true});
            }else{
                document.cookie = 'loggedin=true;Expires=Wed, 31 Dec 2025 23:59:59 GMT'
                document.cookie = `sessionid=${res.data.sessionid};Expires=Wed, 31 Dec 2025 23:59:59 GMT;HttpOnly`
                document.cookie = `session=${res.data.session};Expires=Wed, 31 Dec 2025 23:59:59 GMT`
                document.location = '/';
            }
        })}).catch(err=>{setIndicator({info:'An error occurred',open:true});console.log(err)})
    }
    return <div >
        <Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
            <React.Fragment>
                <IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
                <CloseIcon />
                </IconButton>
            </React.Fragment>
            }/>
        <Paper style={{margin:desktop?'10% 8%':'5%',padding:'15px'}}>
            <form onSubmit={submitForm}>
                <Typography className={classes.text}>SignUp</Typography>
                <FormControl fullWidth margin='normal'>
                    <InputLabel htmlFor='username'>Username</InputLabel>
                    <OutlinedInput  id='username' variant='filled' name='username' required placeholder='Username' />
                </FormControl>
                
                <FormControl fullWidth margin='normal'>
                        <InputLabel minLength='8' htmlFor="password" >Password</InputLabel>
                        <OutlinedInput id='password' minLength='8' required autoComplete="current-password" type={showpassword ? 'text' : 'password'} label='Password'  name="password"
                        endAdornment={<IconButton onClick={()=>{showpassword?setShowpassword(false):setShowpassword(true)}}>
                            {showpassword?<Visibility />:<VisibilityOff/>}</IconButton>}/>
                    </FormControl><br />
                    <Button variant={'contained'} type='submit' color='primary'>Login</Button>
            </form>
            <Button  component={Link} to='/signup' color='primary' style={{margin:'5%'}}>Or SignUp</Button>
        </Paper>
    </div>
}