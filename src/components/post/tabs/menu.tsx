import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Switch,
} from "@material-tailwind/react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";
import { SocialIcon } from "../common";

function SocialsMenu() {
  const { content } = useStore((state) => ({
    content: state.content,
  }));
  const [menuOpen, setMenuOpen] = useState<boolean>();

  // const uniqueSocials = content.filter((item) => item.unique);

  if (!content.length) return null;

  return (
    <Menu open={menuOpen} dismiss={{ enabled: !menuOpen, outsidePress: true }}>
      <MenuHandler>
        <IconButton
          className="ml-2 !h-[30px] w-36 rounded-full"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          <IoIosArrowDown />
        </IconButton>
      </MenuHandler>
      <MenuList>
        {content.map((item) => {
          if (item.socialType === SocialType.Default) return null;
          return (
            <MenuItem key={item.id}>
              <MenuItems
                type={item.socialType}
                name={item.name}
                id={item.id}
                unique={item.unique}
              />
            </MenuItem>
          );
        })}
        {/* <MenuItem>Menu Item 1</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
        <MenuItem>Menu Item 3</MenuItem> */}
      </MenuList>
    </Menu>
  );
}

export default SocialsMenu;

const MenuItems = ({
  type,
  name,
  id,
  unique,
}: {
  type: string;
  name: string;
  id: string;
  unique: boolean;
}) => {
  const { setContent, content } = useStore((state) => ({
    setContent: state.setContent,
    content: state.content,
  }));

  const [checked, setChecked] = useState<boolean>(unique);

  const handleChange = () => {
    let updatedContent = [...content];
    if (unique) {
      setChecked(false);
      updatedContent = content.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            unique: false,
          };
        }
        return item;
      });
    } else {
      setChecked(true);
      console.log(content[0]?.content);
      updatedContent = content.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            content: content[0]?.content || "",
            unique: true,
          };
        }
        return item;
      });
    }
    setContent(updatedContent);
  };

  return (
    <div key={type}>
      <div
        className="flex justify-between gap-2 align-middle"
        // onClick={(event) => {
        //   // event.stopPropagation();
        //   handleChange();
        // }}
      >
        <div
          className={`flex gap-2 align-middle ${
            type === "LENS" ? " " : "py-1"
          }`}
        >
          <div className={`${type === "LENS" ? "" : "pl-[7px]"}`}>
            <SocialIcon type={type} />
          </div>
          <span className={`${type === "LENS" ? "mt-[5px]" : ""}`}>{name}</span>
        </div>
        <Switch
          checked={checked}
          onChange={() => {
            handleChange();
          }}
          className="text-primary"
          crossOrigin={undefined}
        />
      </div>
    </div>
  );
};
