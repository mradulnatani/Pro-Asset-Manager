"use client";
import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SiGoogle } from "react-icons/si";
import { twMerge } from "tailwind-merge";
import { signIn } from "next-auth/react";
export default function LoginPage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
    };
    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
            <h2 className="font-bold text-xl text-neutral-800 ">
                Welcome to IMC Asset Manager
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2">
                Login to IMC Asset Manager
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">First name</Label>
                        <Input id="firstname" placeholder="Tyler" type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input id="lastname" placeholder="Durden" type="text" />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] "
                    type="submit"
                >
                    Sign up &rarr;
                    <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col space-y-4">
                    <Label htmlFor="google">Login using Google</Label>
                    <BubbleButton className="rounded flex w-full justify-center py-3" onClick={() => signIn('google', { callbackUrl: '/assets' })}>
                        <SiGoogle />
                    </BubbleButton>
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const BubbleButton = ({ children, className, ...rest }: ButtonProps) => {
    return (
        <button
            className={twMerge(
                `
          relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-md 
          border border-zinc-700 bg-gradient-to-br from-zinc-600 to-zinc-900
          px-3 py-1.5
          text-zinc-50 transition-all duration-300
          
          before:absolute before:inset-0
          before:-z-10 before:translate-y-[200%]
          before:scale-[2.5]
          before:rounded-[100%] before:bg-zinc-100
          before:transition-transform before:duration-500
          before:content-[""]
  
          hover:scale-105 hover:text-zinc-900
          hover:before:translate-y-[0%]
          active:scale-100`,
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

type ButtonProps = {
    children: ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
