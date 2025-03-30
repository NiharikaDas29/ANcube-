"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Loader2, RefreshCw, Download } from 'lucide-react';

const HotelSocialMediaGenerator = () => {
  const [hotelName, setHotelName] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [promptDetails, setPromptDetails] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});

  const generatePostsWithGemini = async () => {
    // Validate inputs
    if (!hotelName || !eventDetails || !promptDetails) {
      alert('Please fill in hotel name, event details, and prompt');
      return;
    }

    setLoading(true);
    try {
      // Call our server-side API route
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelName,
          eventDetails,
          promptDetails,
          count: 4
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API error:', data);
        if (response.status === 401) {
          alert('API key error. Please check your configuration.');
          return;
        }
        if (response.status === 429) {
          alert('API quota exceeded. Please try again later.');
          return;
        }
        throw new Error(data.error || `API request failed: ${response.status}`);
      }

      console.log('Received response:', data);
      
      // Create initial posts with placeholder images
      const initialPosts = data.posts.map((text, index) => ({
        id: index,
        text: text,
        image: `/api/placeholder/800/600?text=Generating+Image`,
        imagePrompt: ""
      }));
      
      setGeneratedPosts(initialPosts);
      
      // Generate images for each post
      initialPosts.forEach((post) => {
        generateImageForPost(post.id, post.text);
      });
      
    } catch (error) {
      console.error("Error generating content:", error);
      alert(error.message || "Failed to generate content. Please try again.");
      setLoading(false);
    }
  };

  const generateImageForPost = async (postId, postText) => {
    setImageLoading(prev => ({ ...prev, [postId]: true }));
    
    try {
      const imagePrompt = `Create a vibrant, professional social media image for a hotel post about: "${eventDetails}" at "${hotelName}". The post text is: "${postText.substring(0, 100)}...". Make it visually appealing and suitable for social media marketing.`;
      
      // Call our server-side API route for image generation
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt
        })
      });

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the post with the generated image
      setGeneratedPosts(currentPosts => 
        currentPosts.map(post => 
          post.id === postId ? { ...post, image: data.imageUrl || `/api/placeholder/800/600?text=Hotel+Event`, imagePrompt } : post
        )
      );
    } catch (error) {
      console.error("Error generating image:", error);
      // Update with a placeholder image on error
      setGeneratedPosts(currentPosts => 
        currentPosts.map(post => 
          post.id === postId ? { ...post, image: `/api/placeholder/800/600?text=Image+Generation+Failed` } : post
        )
      );
    } finally {
      setImageLoading(prev => ({ ...prev, [postId]: false }));
      
      // Check if all images are generated
      const allImagesGenerated = Object.values({ ...imageLoading, [postId]: false }).every(status => !status);
      if (allImagesGenerated) {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const handleEditPost = (post) => {
    setEditingPost({...post});
  };

  const saveEditedPost = () => {
    if (!editingPost) return;

    const updatedPosts = generatedPosts.map(post => 
      post.id === editingPost.id ? editingPost : post
    );

    setGeneratedPosts(updatedPosts);
    setEditingPost(null);
  };

  const regeneratePost = async (postId) => {
    const post = generatedPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Set loading state for this specific post
    setImageLoading(prev => ({ ...prev, [postId]: true }));
    
    try {
      // Create a more specific prompt based on the current post
      const prompt = `Rewrite this social media post for ${hotelName} about their event: ${eventDetails}.
                     Make it more engaging and unique while keeping the same general theme.
                     Original post: "${post.text}"
                     Additional context: ${promptDetails}
                     Include emojis and appropriate hashtags.`;

      const response = await fetch('/api/regenerate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          hotelName,
          eventDetails,
          promptDetails
        })
      });

      if (!response.ok) {
        throw new Error(`Post regeneration failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const newText = data.candidates[0].content.parts[0].text;
        
        // Update the post with the new text
        setGeneratedPosts(currentPosts => 
          currentPosts.map(p => 
            p.id === postId ? { ...p, text: newText, image: `/api/placeholder/800/600?text=Regenerating+Image` } : p
          )
        );
        
        // Generate a new image for the updated post
        generateImageForPost(postId, newText);
      }
    } catch (error) {
      console.error("Error regenerating post:", error);
      alert("Failed to regenerate post. Please try again.");
      setImageLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const regenerateImage = async (postId) => {
    const post = generatedPosts.find(p => p.id === postId);
    if (!post) return;
    
    setImageLoading(prev => ({ ...prev, [postId]: true }));
    
    // Update with loading placeholder
    setGeneratedPosts(currentPosts => 
      currentPosts.map(p => 
        p.id === postId ? { ...p, image: `/api/placeholder/800/600?text=Regenerating+Image` } : p
      )
    );
    
    // Generate a new image
    await generateImageForPost(postId, post.text);
  };

  // New function to download an image
  const downloadImage = async (postId) => {
    const post = generatedPosts.find(p => p.id === postId);
    if (!post || !post.image || post.image.includes('/api/placeholder')) {
      alert('No valid image available to download');
      return;
    }
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // If the image is a data URL, we can directly download it
      if (post.image.startsWith('data:')) {
        link.href = post.image;
      } else {
        // Otherwise, we need to fetch the image first
        const response = await fetch(post.image);
        const blob = await response.blob();
        link.href = URL.createObjectURL(blob);
      }
      
      // Set filename for download
      link.download = `${hotelName.replace(/\s+/g, '-')}_post_${postId}.jpg`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <div className='h-fit flex items-center justify-center p-4'>
      <Card className="w-full h-fit max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Hotel Social Media Post Generator with Gemini AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hotelName" className="block mb-2 text-sm font-medium">
                  Hotel Name
                </label>
                <Input 
                  id="hotelName"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="Enter hotel name"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="eventDetails" className="block mb-2 text-sm font-medium">
                  Event/Occasion Details
                </label>
                <Input 
                  id="eventDetails"
                  value={eventDetails}
                  onChange={(e) => setEventDetails(e.target.value)}
                  placeholder="Describe the event or occasion"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="promptDetails" className="block mb-2 text-sm font-medium">
                Additional Prompt Details
              </label>
              <Textarea
                id="promptDetails"
                value={promptDetails}
                onChange={(e) => setPromptDetails(e.target.value)}
                placeholder="Specify tone, style, target audience, or any specific details to include"
                className="w-full"
                rows={3}
              />
            </div>

            <Button 
              onClick={generatePostsWithGemini} 
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading || Object.values(imageLoading).some(status => status)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Posts & Images...
                </>
              ) : (
                'Generate AI Social Media Posts'
              )}
            </Button>

            {generatedPosts.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {generatedPosts.map((post) => (
                  <Card key={post.id} className="border">
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <div className="relative w-full h-70 bg-gray-100 rounded-md mb-3">
                          {imageLoading[post.id] ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                          ) : (
                            <>
                              <img 
                                src={post.image} 
                                alt={`Generated Event Image`} 
                                className="w-full h-70 object-cover rounded-md"
                              />
                              {/* Download button overlay */}
                              <Button
                                      variant="secondary"
                                      size="sm"
                                       className="absolute bottom-2 right-2 bg-white/80 hover:bg-white shadow-sm flex items-center gap-1"
                                      onClick={() => downloadImage(post.id)}
                                      disabled={post.image.includes('/api/placeholder')}
>
  <Download className="h-4 w-4" /> Save
</Button>
                            </>
                          )}
                        </div>
                        <p className="text-sm">{post.text}</p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => regeneratePost(post.id)}
                          disabled={imageLoading[post.id]}
                        >
                          {imageLoading[post.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Regenerate Post"
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => regenerateImage(post.id)}
                          disabled={imageLoading[post.id]}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" /> Image
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPost(post)}
                        >
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(post.text)}
                        >
                          Copy Post
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      {editingPost && (
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Social Media Post</DialogTitle>
            </DialogHeader>
            <Textarea 
              value={editingPost.text}
              onChange={(e) => setEditingPost({...editingPost, text: e.target.value})}
              className="w-full h-48"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPost(null)}>
                Cancel
              </Button>
              <Button onClick={saveEditedPost}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HotelSocialMediaGenerator;