
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { usePost, type Post } from "@/context/PostContext";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { likePost, addComment, deletePost } = usePost();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  
  const isLiked = user ? post.likes.includes(user.id) : false;
  const canDelete = user && post.creator.id === user.id;
  
  const handleLike = () => {
    if (user) {
      likePost(post.id);
    }
  };
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && user) {
      addComment(post.id, commentText);
      setCommentText("");
    }
  };
  
  const handleDelete = () => {
    if (canDelete) {
      deletePost(post.id);
    }
  };

  return (
    <Card className="post-card overflow-hidden mb-6">
      <CardHeader className="p-4 flex flex-row items-center space-x-3 space-y-0">
        <Link to={`/profile/${post.creator.id}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.creator.profileImage} />
            <AvatarFallback>{post.creator.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${post.creator.id}`} className="font-medium">
              {post.creator.username}
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          <h3 className="text-sm font-semibold mt-1">{post.title}</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-4">
          <p className="text-sm mb-3">{post.description}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-accent text-accent-foreground">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex flex-col space-y-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`} 
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes.length}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center text-gray-500" 
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-5 w-5 mr-1" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
          {canDelete && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500" 
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {showComments && (
          <div className="w-full">
            {post.comments.length > 0 && (
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.creator.profileImage} />
                      <AvatarFallback>{comment.creator.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-accent rounded-lg py-1 px-3">
                        <span className="font-medium mr-2">{comment.creator.username}</span>
                        <span>{comment.text}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleAddComment} className="flex space-x-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">Post</Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
