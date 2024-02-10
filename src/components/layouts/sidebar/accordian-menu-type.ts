export interface MenuItem {
  open: number;
  text: string;
  icon: JSX.Element; // Assuming JSX.Element is imported from 'react'
  items: SubMenuItem[];
}

export interface SubMenuItem {
  subText: string;
  subIcon: JSX.Element; // Assuming JSX.Element is imported from 'react'
  url: string;
}
