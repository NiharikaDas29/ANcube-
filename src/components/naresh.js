"use client";

import { useState } from "react";

const PostGini = () => {
  const [event, setEvent] = useState("");
  const [keypoints, setKeypoints] = useState("");
  const [theme, setTheme] = useState("professional");
  const [size, setSize] = useState("1:1");
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const generatePosts = () => {
    if (!event || !keypoints) {
      alert('Please provide event details and key points');
      return;
    }

    // Define image dimensions based on selected size
    let width, height;
    switch(size) {
      case "1:1": width = 800; height = 800; break;
      case "1:2": width = 800; height = 1600; break;
      case "1:3": width = 800; height = 2400; break;
      default: width = 800; height = 800;
    }

    // Create different image URLs for variety
    const imageUrls = [
      `/api/placeholder/${width}/${height}?text=${encodeURIComponent(event)}`,
      `/api/placeholder/${width}/${height}?text=${encodeURIComponent("Join us!")}`,
      `/api/placeholder/${width}/${height}?text=${encodeURIComponent("Don't miss out")}`,
      `/api/placeholder/${width}/${height}?text=${encodeURIComponent("Special event")}`
    ];

    // Create post text templates based on theme
    const getPostText = (index) => {
      const keypointsText = keypoints.trim();
      
      switch(theme) {
        case "professional":
          const professionalTemplates = [
            `We're excited to announce our upcoming ${event}. ${keypointsText} #ProfessionalEvent`,
            `Join us for an exceptional ${event} experience. ${keypointsText} #BusinessGrowth`,
            `Elevate your professional journey at our ${event}. ${keypointsText} #CareerDevelopment`,
            `Don't miss this opportunity: ${event}. ${keypointsText} #IndustryLeaders`
          ];
          return professionalTemplates[index];
          
        case "casual":
          const casualTemplates = [
            `Hey there! Don't miss our ${event}! ${keypointsText} #GoodTimes`,
            `Swing by our awesome ${event}! ${keypointsText} #JoinTheFun`,
            `Looking for weekend plans? Check out our ${event}. ${keypointsText} #WeekendVibes`,
            `Bring your friends to our laid-back ${event}. ${keypointsText} #ChillVibes`
          ];
          return casualTemplates[index];
          
        case "funny":
          const funnyTemplates = [
            `Ready for some fun? Our ${event} is coming up! ${keypointsText} 😂 #LaughOutLoud`,
            `Warning: Our ${event} may cause extreme happiness! ${keypointsText} 🤣 #FunTimes`,
            `We promise our ${event} is more exciting than watching paint dry! ${keypointsText} 😆 #GoodHumor`,
            `Last time we had this ${event}, someone laughed so hard they... well, let's keep it PG! ${keypointsText} 😜 #CantStopLaughing`
          ];
          return funnyTemplates[index];
          
        case "motivational":
          const motivationalTemplates = [
            `Transform your life at our inspirational ${event}. ${keypointsText} ✨ #ChangeYourLife`,
            `Believe in yourself and join our ${event}. ${keypointsText} 🌟 #YourPotential`,
            `Every journey begins with a single step. Take that step at our ${event}. ${keypointsText} 🚀 #DreamBig`,
            `Unlock your true potential at our life-changing ${event}. ${keypointsText} 💪 #NeverGiveUp`
          ];
          return motivationalTemplates[index];
          
        default:
          const defaultTemplates = [
            `Join us for our upcoming ${event}. ${keypointsText}`,
            `Don't miss our special ${event}. ${keypointsText}`,
            `We're hosting an amazing ${event}. ${keypointsText}`,
            `Be part of our incredible ${event}. ${keypointsText}`
          ];
          return defaultTemplates[index];
      }
    };

    // Generate 4 posts
    const newPosts = Array.from({ length: 4 }, (_, index) => ({
      id: Date.now() + index,
      text: getPostText(index),
      image: imageUrls[index],
      theme,
      size
    }));

    // Update the state with the new posts
    setGeneratedPosts(newPosts);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const handleEditPost = (post) => {
    setEditingPost({...post});
    setIsDialogOpen(true);
  };

  const saveEditedPost = () => {
    if (!editingPost) return;

    const updatedPosts = generatedPosts.map(post => 
      post.id === editingPost.id ? editingPost : post
    );

    setGeneratedPosts(updatedPosts);
    setIsDialogOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 shadow-md">
        <h2 className="text-blue-500 text-xl font-bold mb-4">PostGini</h2>
        <ul className="space-y-3">
          {[
            "Home",
            "My Posts",
            "Generate Post",
            "AI Image Generator",
            "Post Analytics",
            "AI Video Generator",
            "Chat with AI",
            "AI Text Editor",
            "AI Content Detector",
            "Custom GPTs",
            "Settings",
            "Logout",
          ].map((item, index) => (
            <li
              key={index}
              className="cursor-pointer text-gray-700 hover:text-blue-500"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800">
          AI POWERED SOCIAL MEDIA MAGIC
        </h1>

        {/* Form */}
        <div className="mt-6 space-y-4">
          {/* Event Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Occasion or Event
            </label>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="Enter event (e.g., Product Launch, Birthday, Webinar)"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Key Points */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Key Points to Cover
            </label>
            <textarea
              value={keypoints}
              onChange={(e) => setKeypoints(e.target.value)}
              rows="3"
              placeholder="Enter key points for the post"
              className="w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="funny">Funny</option>
              <option value="motivational">Motivational</option>
            </select>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="1:1">1:1</option>
              <option value="1:2">1:2</option>
              <option value="1:3">1:3</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePosts}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
          >
            Generate 4 Posts
          </button>
        </div>

        {/* Generated Posts Display */}
        {generatedPosts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Generated Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <img 
                      src={post.image} 
                      alt={`Event: ${event}`} 
                      className="w-full h-auto object-cover rounded-md mb-3"
                    />
                    <p className="text-sm text-gray-700 mb-3">{post.text}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-500">Theme: {post.theme}</span>
                        <span className="text-xs text-gray-500 ml-2">Size: {post.size}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => copyToClipboard(post.text)}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        {isDialogOpen && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Social Media Post</h3>
              <textarea
                value={editingPost.text}
                onChange={(e) => setEditingPost({...editingPost, text: e.target.value})}
                rows="6"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              ></textarea>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingPost(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedPost}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostGini;