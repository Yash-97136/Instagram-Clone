import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import './Post.css'
import firebase from 'firebase';
import {db} from './firebase';
import { Button } from '@material-ui/core';


const Post = ({postId, user, username,imageUrl,caption}) => {
    
    const [comments,setComments]=useState([]);
    const [comment, setComment] = useState('');

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe=db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot)=>{
                    setComments(snapshot.docs.map((doc)=>doc.data()));
                });
        }

        return ()=>{
            unsubscribe();
        }

    },[postId])

    const postComment=(event)=>{
        event.preventDefault();
        if(user){
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
    }else{
        alert("Sorry!!You need to sign in to add comments")
    }
    setComment('');
    }
    
    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" 
                alt={username} 
                src="/broken-image.jpg" />
                <h4 className="post__headerUsername">{username}</h4>
            </div>
            
            <img className="post__image" 
            src={imageUrl} />
            
            <p className="post__caption"><strong>{username} </strong>{caption}</p>
            
            <div className="post__comments">
                {comments.map((comment)=>(
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user&&(
                <form className="post__commentBox">
                <input type="text" 
                    className="post__input" 
                    placeholder="Add a comment"
                    value={comment}
                    onChange={e=>setComment(e.target.value)} />
                <button
                  className="post__button"
                  disabled={!comment}
                  type="submit"
                  onClick={postComment}
                >
                    Post</button>
            </form>

            )}

        </div>
    )
}

export default Post;
