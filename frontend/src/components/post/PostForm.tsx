
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { usePost } from "@/context/PostContext";

const PostForm: React.FC = () => {
  const { createPost, isLoading } = usePost();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.title.trim()) {
        return toast.error("Title is required");
      }
      
      if (!formData.description.trim()) {
        return toast.error("Description is required");
      }
      
      // Process tags (convert comma-separated string to array)
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag !== "");
      
      // Submit post
      await createPost({
        title: formData.title,
        description: formData.description,
        image: formData.image || undefined,
        tags,
      });
      
      // Redirect to home page on success
      navigate("/home");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center">Create New Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Add a title..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What's on your mind?"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              name="tags"
              placeholder="friends, adventure, travel"
              value={formData.tags}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Add relevant tags to help others discover your post
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex w-full justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/home")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostForm;
