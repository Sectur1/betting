import {makeStyles} from '@material-ui/core'; 

export const useStyles = makeStyles(theme=>({
    root:{
        flexGrow:1
    },
    navbar:{
        backgroundColor:'white'
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
        bottom:'10%',
        position:'fixed',
        right:'3%',
    },
    bottomNav:{
        width:"100%",
        position:'fixed',
        bottom:0,
        zIndex:1000
      },
    grow:{
        flexGrow:1
    },
    container:{
        marginTop:'10%'
    },
    text:{
        ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    }
}))