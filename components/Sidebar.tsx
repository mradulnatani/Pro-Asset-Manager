"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconMail,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Dashboard from "./Dashboard";

export function SidebarDashboard() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-black h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Resouce Analyze",
      href: "#resource",
      icon: (
        <IconSettings className="text-black h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Maintenance",
      href: "#maintenance",
      icon: (
        <IconMail className="text-black h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/settings",
      icon: (
        <IconUserBolt className="text-black h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full flex-1 min-w-full mx-auto border border-neutral-200 overflow-hidden min-h-full")}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Aniruddh",
                href: "https://icantcode.fyi",
                icon: (
                  <Image
                    src="/ani.jpg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src='/favicon.ico' className='w-10 h-10' />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black whitespace-pre"
      >
        IMC
      </motion.span>
    </Link>
  );
};
