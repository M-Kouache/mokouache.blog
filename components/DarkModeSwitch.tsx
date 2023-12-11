import React, { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "../public/assets/icons/SunIcon";
import { MoonIcon } from "../public/assets/icons/MoonIcon";
import { useTheme } from "next-themes";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [toggleState, setToggleState] = useState<boolean>(true);
  useEffect(() => {
    if (theme === "light") {
      setToggleState(true);
      return;
    }
    setToggleState(false);
  }, [theme]);
  return (
    <Switch
      isSelected={toggleState}
      onValueChange={() =>
        theme === "light" ? setTheme("dark") : setTheme("light")
      }
      size="md"
      color="warning"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    ></Switch>
  );
}
