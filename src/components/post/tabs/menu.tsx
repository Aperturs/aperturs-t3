import {
    IconButton,
    Menu,
    MenuHandler,
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
    <Menu open={menuOpen} dismiss={{ enabled: false }}>
      <MenuHandler>
        <IconButton
          className="!h-[30px] w-36 rounded-full"
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
            <div key={item.id}>
              <MenuItem type={item.type} name={item.name} id={item.id} />
            </div>
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

const MenuItem = ({
  type,
  name,
  id,
}: {
  type: string;
  name: string;
  id: number;
}) => {
  const { setContent, content } = useStore((state) => ({
    setContent: state.setContent,
    content: state.content,
  }));

  const handleChange = () => {
    console.log("content",content);
    let updatedContent = [...content]
    if(content.some((contentItem) => contentItem.id === id)){
        updatedContent = content.filter((contentItem) => !(contentItem.id === id))
    }
    else{
        updatedContent.push({
            id: id,
            socialType: type,
            name: name,
            content: "",
          });
    }
    // const updatedContent = content.filter(
    //   (contentItem) =>
    //     !(contentItem.id === id)
    // );
    console.log("Updated content after filtering:", updatedContent);

    // if (
    //   !updatedContent.some(
    //     (contentItem) =>
    //       contentItem.id === id
    //   )
    // ) {
    //   updatedContent.push({
    //     id: updatedContent.length,
    //     socialType: type,
    //     name: name,
    //     content: "",
    //   });
    // }
    // else

    setContent(updatedContent);
  };

  return (
    <div key={type}>
      <div className="flex justify-between gap-2 align-middle">
        <div className="flex gap-2 align-middle">
          <SocialIcon type={type} />
          <span className="mt-1">{name}</span>
        </div>
        <Switch onChange={handleChange} className="text-primary" />
      </div>
    </div>
  );
};
