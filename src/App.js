import React, {useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username,setUsername]=useState('');
  const [user, setUser]=useState(null);
  const [openSignIn, setOpenSignIn]=useState(false);

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()
      })));
    })
  },[])

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser)
        setUser(authUser);
      }else{
        setUser(null);
      }
    })

    return ()=>{
      unsubscribe();
    }

  },[user,username])

  const handleSignUp=(event)=>{
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message))

    setOpen(false);
    setEmail('');
    setPassword('');
  }

  const handleSignIn=(event)=>{
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error)=>alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <div className="app__header">
                  <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
                </div>
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button onClick={handleSignUp}>SIGN UP</Button>
            </form>
          </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <div className="app__header">
                  <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
                </div>
              </center>

              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button onClick={handleSignIn}>SIGN In</Button>
            </form>
          </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" 
             src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
             alt="Instagram" />
          {user ? (
          <Button onClick={()=>auth.signOut()}>Log Out</Button>
            ):(
              <div className="app__loginContainer">
                <Button onClick={()=>setOpenSignIn(true)}>sign In</Button>
                <Button onClick={()=>setOpen(true)}>sign up</Button>
              </div>
              )
          }
      </div>
      

    {posts.map(({id,post})=>(
      <Post key={id} postId={id}
      username={post.username} 
      imageUrl={post.imageUrl}
      user={user}
      caption={post.caption} />
    ))}

    {user?.displayName ? (
            <ImageUpload username={user.displayName}/>
          ):(
            <h3>Sorry you need to login to upload posts!!!</h3>
          )}

    </div>
  );
}

export default App;
