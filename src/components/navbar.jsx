"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/components/lib/utils";

export default function NavbarDemo() {
  return (
    
    <div className="relative w-full flex items-center justify-center flex-col shadow-xl">
      <Navbar className="top-5 w-fit" />
    </div>
   
  );
}

function Navbar({
  className
}) {
  const [active, setActive] = useState(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Animated</HoveredLink>
            <HoveredLink href="/interface-design">Video</HoveredLink>
            
            
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="About us">
          <div className="text-sm grid md:grid-cols-2 gap-10 p-2 mx-auto">
            <ProductItem
              title="Amisha Patel"
              href="https://algochurn.com"
              src="/"
              description="Team Lead" />
            <ProductItem
              title="Niharika Das"
              href="https://tailwindmasterkit.com"
              src="/"
              description="AI-ML enthusiast and a Maths Genius" />
            <ProductItem
              title="Naresh Kumar"
              href="https://gomoonbeam.com"
              src="/"
              description="Research Lead and Web Developer" />
            <ProductItem
              title="Nupur Mahajan"
              href="https://userogue.com"
              src="/"
              description="Web developer" />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
        

        
      </Menu>

    </div>
  );
}
