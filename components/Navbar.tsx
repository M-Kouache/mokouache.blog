import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import DarkModeSwitch from "./DarkModeSwitch";
import Image from "next/image";
import {
  GitHubLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import {
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  X_URL,
} from "../lib/constants";

export default function Navigationbar() {
  const menuItems = ["/ Blog", "/ Portfolio"];

  return (
    <Navbar className="mb-5" isBordered>
      {/*<NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>*/}

      <NavbarContent className="sm:hidden pr-3" justify="end">
        <NavbarBrand>
          <div className="rounded-2xl overflow-hidden border-2 border-white">
            <Image
              src="/assets/images/koumo-logo.png"
              alt="website brand logo"
              width={40}
              height={40}
            />
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarBrand>
          <Link href="/">
            <div className="rounded-r-2xl border-2 border-white overflow-hidden">
              <Image
                src="/assets/images/koumo-logo.png"
                alt="website brand logo"
                width={40}
                height={40}
              />
            </div>
          </Link>
        </NavbarBrand>
        {/*<NavbarItem>
          <Link color="foreground" href="#">
            / Blog
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page" color="warning">
            / Protfolio
          </Link>
        </NavbarItem>*/}
      </NavbarContent>

      <NavbarContent justify="center" className="pt-1">
        <NavbarItem className="mx-1">
          <Link href={LINKEDIN_URL} target="_blank" color="foreground">
            <LinkedInLogoIcon width={30} height={30} />
          </Link>
        </NavbarItem>
        <NavbarItem className="mx-1">
          <Link href={GITHUB_URL} target="_blank" color="foreground">
            <GitHubLogoIcon width={30} height={30} />
          </Link>
        </NavbarItem>
        <NavbarItem className="mx-1">
          <Link href={X_URL} target="_blank" color="foreground">
            <TwitterLogoIcon width={30} height={30} />
          </Link>
        </NavbarItem>
        <NavbarItem className="mx-1">
          <Link href={INSTAGRAM_URL} target="_blank" color="foreground">
            <InstagramLogoIcon width={30} height={30} />
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
      </NavbarContent>

      {/*<NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>*/}
    </Navbar>
  );
}
