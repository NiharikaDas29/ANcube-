"use client";
import { useState } from "react";
import { Card, CardContent}  from "@/components/ui/card";
import  Input  from "@/components/ui/input";
import  Button  from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function Inputfield() {
  const [occasion, setOccasion] = useState("");
  const [size, setSize] = useState("medium");
  const [theme, setTheme] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);

  const generateDisplay = () => {
    setGeneratedContent(`Generated content for ${occasion} with ${size} size and ${theme} theme.`);
  };

  return (
    <div className="flex gap-4 flex-col md:flex-row justify-center items-center bg-gray-50 md:p-10 h-screen">
      {/* Input Section */}
      <div className="md:w-1/3 p-8 m-6 md:m-0 shadow-xl bg-white rounded-xl">
        <h2 className="text-xl font-sans font-bold mb-4">Customize Occasion</h2>
        <Input 
          placeholder="Enter occasion" 
          value={occasion} 
          onChange={(e) => setOccasion(e.target.value)} 
          className="mb-2" 
        />
        <Select onValueChange={setSize} value={size}>
          <SelectTrigger className="">Size: {size}</SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          placeholder="Enter theme" 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)} 
          className="mb-4" 
        />
        <Button onClick={generateDisplay}>Generate</Button>
      </div>

      {/* Display Section */}
      <div className="w-2/3 p-4 border-2 border-black bg-white rounded-xl flex items-center justify-center h-fit m-5">
        {generatedContent ? (
          <Card className="w-full p-4">
            <CardContent>
              <p>{generatedContent}</p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-gray-500">No content generated yet.</p>
        )}
      </div>
    </div>
  );
}
