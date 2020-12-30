import React, { useEffect, useState } from "react";
import { Button, Input, Modal, makeStyles } from "@material-ui/core";
import "./App.css";
import Post from "./components/Post";
import ImageUpload from "./components/ImageUpload";
import { auth, db } from "./firebase";
import InstagramEmbed from "react-instagram-embed";

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
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  //MODAL STATE
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  //Posts state
  const [posts, setPosts] = useState([]);

  //Auth modal's state
  const [open, setOpen] = useState(false);

  //States from sign up inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //State of login
  const [openSignIn, setOpenSignIn] = useState(false);

  //State of the user
  const [user, setUser] = useState(null);

  //Loads the data from firestore
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  //Listen changes of auth users
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in..
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  //function to Sing Up
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  //fuction to Log Out
  const logOut = () => {
    auth.signOut();
  };

  //function to Open the modal
  const handleOpen = () => {
    setOpen(true);
  };
  //function to Close the modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="App">
        {/* *********************THE MODAL OF SIGN UP ************************ */}
        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            {/* FORM SIGN UP */}
            <form className="app__signup">
              <div align="center">
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
              </div>

              {/* INPUTS FROM SING UP MODAL */}
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* LOGIN BUTTON */}
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>
        {/* *********************************************************************** */}

        {/* *********************THE MODAL OF SIGN IN ************************ */}
        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            {/* FORM SIGN UP */}
            <form className="app__signup">
              <div align="center">
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
              </div>

              {/* INPUTS FROM SING IN MODAL */}
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* LOGIN BUTTON */}
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </div>
        </Modal>
        {/* ********************************************************************* */}

        {/* THE HEADER */}
        <div className="app__header">
          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />

          {user ? (
            <Button onClick={logOut}>Log Out</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={handleOpen}>Sign Up</Button>
            </div>
          )}
        </div>

        <div className="app__posts">
          <div className="app__postsLeft">
            {/* Loop of each post */}
            {posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            ))}
          </div>
          <div className="app__postsRight">
            <InstagramEmbed
              url="https://www.instagram.com/p/BtuRVDtnjIN/"
              maxWidth={320}
              hideCaption={false}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
        </div>

        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Sorry you need to login to upload</h3>
        )}
      </div>
    </>
  );
};

export default App;
