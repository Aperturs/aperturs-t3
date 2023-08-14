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
import { SocialIcon } from "../common";

function SocialsMenu() {
  const { selectedSocials } = useStore((state) => ({
    selectedSocials: state.selectedSocials,
  }));
  const [menuOpen, setMenuOpen] = useState<boolean>();

  if (!selectedSocials.length) return null;
  return (
    <Menu open={menuOpen} dismiss={{ enabled: false, outsidePress: true }}>
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
      <MenuList
        onSubmitCapture={() => {
          console.log("clicked");
        }}
      >
        {selectedSocials.map((item) => {
          return (
            <MenuItem key={item.id}>
              <MenuItems type={item.type} name={item.name} id={item.id} />
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
}: {
  type: string;
  name: string;
  id: number;
}) => {
  const { setContent, content, defaultContent } = useStore(
    (state) => ({
      setContent: state.setContent,
      content: state.content,
      defaultContent: state.defaultContent,
      selectedSocials: state.selectedSocials,
    })
  );
  const checkChecked = (id: number) => {
    return content.some((contentItem) => contentItem.id === id);
  };
  const [checked, setChecked] = useState<boolean>(checkChecked(id));
  const handleChange = () => {
    let updatedContent = [...content];
    if (content.some((contentItem) => contentItem.id === id)) {
      setChecked(false);
      updatedContent = content.filter(
        (contentItem) => !(contentItem.id === id)
      );
    } else {
      setChecked(true);
      updatedContent.push({
        id: id,
        socialType: type,
        name: name,
        content: defaultContent,
      });
    }
    setContent(updatedContent);
  };

  return (
    <div key={type}>
      <div className="flex justify-between gap-2 align-middle">
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
        />
      </div>
    </div>
  );
};
