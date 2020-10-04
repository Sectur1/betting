import React,{useEffect, useState,useContext} from 'react';
import {Link} from 'react-router-dom'
import {url, Context} from './index'
import {Paper, FormControl, InputLabel, useMediaQuery, TextField, OutlinedInput, Snackbar, IconButton, Button, Radio,RadioGroup, FormControlLabel,Typography,
FormLabel, Card, Grid, CardHeader,  CardActions,CardContent, ExpansionPanel, ExpansionPanelSummary,ExpansionPanelDetails,LinearProgress} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import {useStyles} from './styles'
import { Gamepad,Movie, SportsSoccer, Event} from '@material-ui/icons';

export function HomePage(props){
	const [bets,setBets]=useState({}),[indicator,setIndicator]=useState({open:false,info:''}),desktop = useMediaQuery('(min-width:561px)'),[loading,setLoading]=useState(false)
	
	function getData(page){
		if(page){

		}else{
			setLoading(false)
			fetch(url,{credentials:'include'}).then(data=>data.json().then(res=>{
				if(res.data){
					setBets({bets:res.data,page:res.page})
					setLoading(false)
				}else{
					setIndicator({open:true,info:res.err})
					setLoading(false)
				}
			})).catch(err=>{console.log(err);setLoading(false);setIndicator({open:true,info:'Sorry! An error occurred true again'});})
		}
	}
	useEffect(()=>{
		getData()
	},[props.location])
	return  <>
		<Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
		<React.Fragment>
			<IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
			<CloseIcon />
			</IconButton>
		</React.Fragment>
		}/>
		{loading&&<LinearProgress />}
		<div style={{margin:desktop?'10% 8%':'15% 0%',padding:'15px'}}>
			{bets.bets?<Grid container spacing={2}>
				{bets.bets.map((bet,index)=>
					<Grid xs={12} key={index} item>
						<Card>
							<CardHeader title={bet.title} subheader={bet.enddate} />

							<CardContent>
								{bet.description.length>200&&<ExpansionPanel >
								<ExpansionPanelSummary>{bet.description.substring(0,200)}</ExpansionPanelSummary>
								<ExpansionPanelDetails>{bet.description}</ExpansionPanelDetails>     
							</ExpansionPanel>}
								<CardActions>
									<Button component={Link} to={{pathname:'/bet/'+bet._id,value:bet}}>Place bet</Button>
								</CardActions>
							</CardContent>
						</Card>
					</Grid>
				)}
			</Grid>:
			<Button variant='contained' onClick={()=>getData()} color='primary'>Try again</Button>}
		</div>
	</>
}

export function Bet(props){
	const [bets,setBets]=useState({}),[indicator,setIndicator]=useState({open:false,info:''}),desktop = useMediaQuery('(min-width:561px)'),[loading,setLoading]=useState(false),context = useContext(Context),
	classes = useStyles()
	
	
	function getData(page){
		if(page){

		}else{
			setLoading(false)
			fetch(url+document.location.pathname,{credentials:'include'}).then(data=>data.json().then(res=>{
				if(res.data){
					setBets({bet:[res.data],page:res.page})
					setLoading(false)
				}else{
					setIndicator({open:true,info:res.err})
					setLoading(false)
				}
			})).catch(err=>{console.log(err);setLoading(false);setIndicator({open:true,info:'Sorry! An error occurred true again'});})
		}
	}
	
	useEffect(()=>{
		getData()
	},[props.location])
	
	
	function optionsIter(len,bet){
		let options = [],i=0
		
		while (i<len){
			options.push(bet[`option${i}`])
			i++
		}
		return options
	}
	
	function selectOption(data){
		fetch(url+'/selectoption',{method:'post',credentials:'include',body:JSON.stringify({bet:data.bet,option:data.option})}).then(data=>data.json().then(res=>{
			if(res.data){
				setIndicator({open:true,info:'Bet has been placed'})
			}else{
				setIndicator({open:true,info:'An error occurred'})
				console.log(res.err)
			}
		})).catch(err=>{console.log(err);setIndicator({open:true,info:'An error occurred'})})
	}
	return <>
		<Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
		<React.Fragment>
			<IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
			<CloseIcon />
			</IconButton>
		</React.Fragment>
		}/>
		{loading&&<LinearProgress />}
		<div style={{margin:desktop?'10% 8%':'15% 0%',padding:'15px'}}>
			{bets.bet?<Grid container spacing={2}>
				{bets.bet.map((bet,index)=>
					<Grid xs={12} key={index} item>
						<Card>
							<CardHeader title={bet.title} subheader={bet.enddate} />
							<CardContent>
								{bet.description.length>200&&<ExpansionPanel >
								<ExpansionPanelSummary>{bet.description.substring(0,200)}</ExpansionPanelSummary>
								<ExpansionPanelDetails>{bet.description}</ExpansionPanelDetails>     
							</ExpansionPanel>}
								<CardContent>
									{bet.beters&&bet.beters.includes(context.user.username)?<Typography className={classes.text}>You've already placed a bet</Typography>:
									optionsIter(bet.totaloptions,bet).map((option,index)=>
										<Button key={index} onClick={()=>selectOption({bet:bet._id,option:option})} style={{width:'100%',marginBottom:'10px'}} variant='outlined' color='primary' >{option}</Button>
									)}
								</CardContent>
								<Typography className={classes.text}>Total bets: {bet.beters.length}</Typography>
								<Typography className={classes.text}>Tags: {bet.tags}</Typography>
							</CardContent>
						</Card>
					</Grid>
				)}
			</Grid>:
			<Button variant='contained' onClick={()=>getData()} color='primary'>Try again</Button>}
		</div>
	</>
}
export function Create(props){
	const [indicator,setIndicator]=useState({open:false,info:''}), desktop = useMediaQuery('(min-width:561px)'),[options, setOptions]=useState([])

	function submit(event){
		event.preventDefault()
		fetch(url+'/create',{credentials:'include',method:'post',body:new FormData(event.target)}).then(data=>data.json().then(res=>{
			if(res.data){
				setIndicator({open:true,info:'Bet successfully created'})
				// event.target.reset()
			}else{
				setIndicator({open:true,info:res.err})
			}
		})).catch(err=>{console.log(err);setIndicator({open:true,info:'Sorry. An error occurred'})})
	}
	function removeOption(index){
		setOptions(options.filter)
	}
	function addOption(event){
		let optionsFields = document.getElementById('options')
		setOptions([...options,optionsFields.value])
		optionsFields.value = ''
	}
	return<> <Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
		<React.Fragment>
			<IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
			<CloseIcon />
			</IconButton>
		</React.Fragment>
		}/>
	<Paper style={{margin:desktop?'10% 8%':'15% 5%',padding:'15px'}}>
		<form autoComplete='true' method='post' onSubmit={(event)=>options.length>1?submit(event):setIndicator({open:true, info:'There should be at lease 2 options'})}>
			<FormControl fullWidth>
			<InputLabel  htmlFor="title" >Title</InputLabel>
				<OutlinedInput id='title' required autoComplete="title" label='Title' minLength='4' name="title"/>
			</FormControl><br />				
			<FormControl fullWidth margin='normal'>
				<InputLabel  htmlFor="description" >Description</InputLabel>
				<OutlinedInput id='description' autoComplete='description' name='description' placeholder='Bet Description' label='description' required/>
			</FormControl>
			<FormControl fullWidth margin='normal'>
				<InputLabel  htmlFor="tags" >Tags</InputLabel>
				<OutlinedInput id='tags' autoComplete='tags' name='tags' placeholder='Tags. Eg sports, Arsenal, Premier League' label='tags' required/>
			</FormControl>
			<TextField label='Stake' type="number" InputLabelProps={{shrink: true}} name='stake' required
				variant='outlined'  margin='normal'  style={{width:'100%'}} /><br />
			<TextField label='End Date (Optional)' type="date" InputLabelProps={{shrink: true}} name='enddate'
			variant='outlined'  margin='normal'  style={{width:'100%'}} /><br />
			<FormControl component='fieldset' fullWidth margin='normal'>
				<FormLabel component='legend'>Betters must confirm before bet ends</FormLabel>
				<RadioGroup  name='confirmbets' required>
					<FormControlLabel value='true' control={<Radio />} label='Confirm' />
					<FormControlLabel value='false' control={<Radio />} label="Don't Confirm" />
				</RadioGroup>
			</FormControl>
			{
				options.map((data,index)=><FormControl fullWidth margin='normal'>
				<OutlinedInput disabled value={data} endAdornment={<IconButton onClick={()=>removeOption(index)}><CloseIcon /></IconButton>}/>
			</FormControl>)
			}

			{
				options.map((data,index)=><input type='hidden' key={'optioninp'+index} value={data} name={`option${index}`} />)
			}
			<input type='hidden' value={options.length} name='totaloptions' />
			<FormControl fullWidth margin='normal'>
				<InputLabel  htmlFor="options" >Options</InputLabel>
				<OutlinedInput id='options' autoComplete='options' placeholder='Bet options eg. True, False, Win, Lose, Draw, Goal Goal' 
				label='tags' endAdornment={<Button color='primary' onClick={addOption}>Add Option</Button>}/>
			</FormControl>
			<Button type='submit' variant='contained' color='primary'>Create Bet</Button>
		</form>
		<Button  component={Link} to='/login' color='primary' style={{margin:'5%'}}>Or Login</Button>
	</Paper></>
}

export function ExplorePage(props){
	const [indicator,setIndicator]=useState({open:false,info:''}),desktop = useMediaQuery('(min-width:561px)')
	
	function tags(){
		return [{name:'sports',icon:<SportsSoccer fontSize='large' />},{name:'movies',icon:<Movie fontSize='large'/>},
		{name:'games',icon:<Gamepad fontSize='large'/>},{name:'Events',icon:<Event fontSize='large'/>},]
	}
	return <>
		<Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
		<React.Fragment>
			<IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
			<CloseIcon />
			</IconButton>
		</React.Fragment>
		}/>
	<Paper style={{margin:desktop?'10% 8%':'15% 5%',padding:'15px'}}>
		<Grid container>
			{tags().map((tag,index)=><Grid key={index} item xs={6}><Button style={{width:'100%'}} component={Link} to={{pathname:`/expore/${tag.name}`}}>
				<Card style={{width:'100%'}}>
					<CardContent>{tag.icon}</CardContent>
					<CardContent>{tag.name}</CardContent>	
				</Card>
				</Button></Grid>)}	
		</Grid>
	</Paper>
	</>
}
export function ExploreDetails(props){
	const [indicator,setIndicator]=useState({open:false,info:''}),desktop = useMediaQuery('(min-width:561px)'),[bets,setBets]=useState({})
	console.log(document.location.pathname)
	useEffect(()=>{
		fetch(url+props.location.pathname).then(data=>data.json().then(res=>{
			if(res.data){
				setBets(res.data)
			}else{
				setIndicator({open:true,info:'An error occurred'})
			}
		})).catch(err=>{setIndicator({open:true,info:'An error occurred'});console.log(err)})
	},[props.location])
	return <>
		<Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
		<React.Fragment>
			<IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
			<CloseIcon />
			</IconButton>
		</React.Fragment>
		}/>
		<Paper style={{margin:desktop?'10% 8%':'15% 5%',padding:'15px'}}>
			{bets.bets&&bets.bets.map((bet,index)=><Grid key={index} item xs={12}><Button style={{width:'100%'}} component={Link} to={{pathname:`/bet/${bet._id}`}}>
				<Card style={{width:'100%'}}>
					<CardContent>{bet.title}</CardContent>
					{bet.description.length>200&&<ExpansionPanel >
						<ExpansionPanelSummary>{bet.description.substring(0,200)}</ExpansionPanelSummary>
						<ExpansionPanelDetails>{bet.description}</ExpansionPanelDetails>     
					</ExpansionPanel>}	
				</Card>
				</Button></Grid>)}
		</Paper>
	</>
}

export function EndBet(props){
	const [bets,setBet]=useState([]),[indicator,setIndicator]=useState({info:"",open:false}),[loading,setLoading]=useState(true),desktop = useMediaQuery('(min-width:561px)'),classes = useStyles(),context = useContext(Context)
	
	function getData(){
		if(!props.location.value){
			fetch(url+document.location.pathname,{credentials:'include'}).then(data=>data.json().then(res=>{
				setLoading(false)
				if(res.data){
					setBet(res.bet)
				}else{
					console.log(res.err)
					setIndicator({open:true, info:'An Error occurred'})
				}
			}))
		}else{
			setBet(props.location.value)
		}
	}
	useEffect(()=>{
		getData()
	},[props.location])

	function optionsIter(len,bet){
		let options = [],i=0
		
		while (i<len){
			options.push(bet[`option${i}`])
			i++
		}
		return options
	}
	function selectOption(data){
		fetch(url+'/selectoption',{method:'post',credentials:'include',body:JSON.stringify({bet:data.bet,option:data.option})}).then(data=>data.json().then(res=>{
			if(res.data){
				setIndicator({open:true,info:'Bet has been placed'})
			}else{
				setIndicator({open:true,info:'An error occurred'})
				console.log(res.err)
			}
		})).catch(err=>{console.log(err);setIndicator({open:true,info:'An error occurred'})})
	}
	return <>
	<Snackbar message={indicator.info} open={indicator.open}  onClose={()=>setIndicator({open:false})}  action={
	<React.Fragment>
		<IconButton aria-label="close" color="inherit" onClick={()=>setIndicator({open:false})}>
		<CloseIcon />
		</IconButton>
	</React.Fragment>
	}/>
	{loading&&<LinearProgress />}
	<div style={{margin:desktop?'10% 8%':'15% 0%',padding:'15px'}}>
		{bets.bet?<Grid container spacing={2}>
			{bets.bet.map((bet,index)=>
				<Grid xs={12} key={index} item>
					<Card>
						<CardHeader title={bet.title} subheader={bet.enddate} />
						<CardContent>
							{bet.description.length>200&&<ExpansionPanel >
							<ExpansionPanelSummary>{bet.description.substring(0,200)}</ExpansionPanelSummary>
							<ExpansionPanelDetails>{bet.description}</ExpansionPanelDetails>     
						</ExpansionPanel>}
							<CardContent>
								{bet.beters&&bet.beters.includes(context.user.username)?<Typography className={classes.text}>You've already placed a bet</Typography>:
								optionsIter(bet.totaloptions,bet).map((option,index)=>
									<Button key={index} onClick={()=>selectOption({bet:bet._id,option:option})} style={{width:'100%',marginBottom:'10px'}} variant='outlined' color='primary' >{option}</Button>
								)}
							</CardContent>
							<Typography className={classes.text}>Total bets: {bet.beters.length}</Typography>
							<Typography className={classes.text}>Tags: {bet.tags}</Typography>
						</CardContent>
					</Card>
				</Grid>
			)}
		</Grid>:
		<Button variant='contained' onClick={()=>getData()} color='primary'>Try again</Button>}
	</div>
</>
}