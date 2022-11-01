import { useState, useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";

import moment from "moment/moment";

// import axios from "axios";

import { initializeApp } from "firebase/app";

// import {
//   getFirestore, collection, addDoc, serverTimestamp,
//   getDocs, query, orderBy
// }
//   from "firebase/firestore";

import {
  getFirestore, collection, addDoc, serverTimestamp,
  onSnapshot, query, orderBy
}
  from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment, faShare, faSun, faMoon } 
from "@fortawesome/free-solid-svg-icons";


import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyDQBg1ZuoPblhr945VwxcjC1x5lXHvQxew",
  authDomain: "facebookpostdbase.firebaseapp.com",
  projectId: "facebookpostdbase",
  storageBucket: "facebookpostdbase.appspot.com",
  messagingSenderId: "358498773032",
  appId: "1:358498773032:web:95988e84473bb50b64ad1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const Posts = ({ isLit, postTitle, postText, postedOn }) => (
  <div className={(isLit) ? 'post' : 'post postDark'}>
    <span className={(isLit) ? 'lit' : 'dark'}>
      {
        moment(
          (postedOn)
            ? postedOn * 1000
            : undefined
        )
          .format('Do MMMM, h:mm a')
      }
    </span>
    <h1 className={(isLit) ? 'lit' : 'dark'}>
      {postTitle}
    </h1>

    {/* {console.log("postText: ", postText)} */}

    <p className={(isLit) ? 'lit' : 'dark'}>
      {postText}
    </p><hr />
    {/* <img className="post-pic" src={imageurl} alt="news" /> */}

    <div>
      <hr />
    </div>
    <div className={(isLit) ? 'postFooter lit' : 'postFooter dark'}>
      <div><FontAwesomeIcon icon={faThumbsUp} /> Like</div>
      <div><FontAwesomeIcon icon={faComment} /> Comment</div>
      <div><FontAwesomeIcon icon={faShare} /> Share</div>
    </div>

    <div>
      <hr />
    </div>
  </div>

);

function App() {

  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [isLit, setIsLit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);


  useEffect(
    () => {

      // const getPosts = async () => {
      //   setIsLoading(true);
      //   const fetchQuery = query(collection(db, "posts"),
      //     orderBy("postedOn", "desc"));

      //   const querySnapshot = await getDocs(fetchQuery);
      //   const posts = [];

      //   querySnapshot.forEach((doc) => {
      //     // doc.data() is never undefined for query doc snapshots
      //     console.log(doc.id, " => ", doc.data());

      //     posts.push({ id: doc.id, ...doc.data() });

      //     setIsLoading(false);

      //   });
      //   setPosts(posts);

      // }

      // getPosts();

      let unsubscribe = null;
      setIsLoading(true);
      const getRealtimeData = () => {

        const fetchQuery = query(collection(db, "posts"),
          orderBy("postedOn", "desc"));
        unsubscribe = onSnapshot(fetchQuery, (querySnapshot) => {
          const posts = [];
          querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
            console.log("local posts: ", posts);
          });
          setPosts(posts);
          console.log("posts: ", posts);
          setIsLoading(false);
        });

      }

      getRealtimeData();

      return () => {
        console.log("Cleanup function");
        unsubscribe();
      }

    }, []);

  console.log("posts: ", posts);

  const savetPosts = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        postTitle: title,
        postText: postText,
        postedOn: serverTimestamp()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className={
      (isLit) ? 'App lit' : 'App dark'
    }>

      <div className={(isLit) ? 'head lit' : 'head dark'}>
        <div className="headText" >
          <h1 className=
            {
              (isLit)
                ? 'pagehead lit'
                : 'pagehead dark'
            }>Facebook page
          </h1>
        </div>
        <div className="headButton" >
          <button className={(isLit) ? 'button lit' : 'button dark'}
            onClick={() => { setIsLit(!isLit) }}>
            {
              (isLit)
                ? <FontAwesomeIcon icon={faSun} size='2x' title='Light mode' />
                : <FontAwesomeIcon icon={faMoon} size='2x' title='Dark mode' />
            }
          </button>
        </div>

      </div>

      <div className={
        (isLit) ? 'formContainer lit' : 'formContainer dark'
      }>
        <form className={
          (isLit) ? 'pForm lit' : 'pForm dark'
        }
          onSubmit={savetPosts}>

          <input type="text" name="title" id="title"
            onChange={
              (e) => {
                setTitle(e.target.value);
              }
            }
            placeholder="Post title..." />

          <textarea name="post" id="post"
            onChange={
              (e) => {
                setPostText(e.target.value);
              }
            }
            placeholder="What's in your mind..." />

          <button
            className={
              (isLit)
                ? 'postBtnLit'
                : 'postBtnDark'
            }
            type="submit">Post</button>
        </form>
      </div>

      <div className={(isLit) ? 'main lit' : 'main dark'}>

        <div className="loading">
          {
            (isLoading)
              ? <div className="loader">
                <span>Loading posts...</span>
                <ImSpinner9 className="spinner" />
              </div>
              : ""
          }
        </div>

        {
          posts.map((eachPost, i) => (
            <div key={i}>
              {/* {console.log(eachPost.postText)} */}
              <Posts
                isLit={isLit}
                postTitle={eachPost?.postTitle}
                postText={eachPost?.postText}
                postedOn={eachPost?.postedOn?.seconds}
              ></Posts>
            </div>
          ))
        }

      </div>
    </div>
  );
}

export default App;
