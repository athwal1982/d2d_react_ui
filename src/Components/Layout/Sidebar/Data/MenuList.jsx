import React from "react";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { BsFileEarmarkBarGraphFill, BsFillJournalBookmarkFill } from "react-icons/bs";
import { FaTicketAlt } from "react-icons/fa";
import { MdOutlineContacts } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";

const MenuList = [
  {
    id: "1",
    name: "Home",
    icon: <AiFillHome />,
    url: "/home",
    submenu: false,
  },
  {
    id: "2",
    name: "Ticket",
    icon: <FaTicketAlt />,
    url: "/ManageTicket",
    submenu: false,
  },
  {
    id: "3",
    name: "Setup",
    icon: <AiFillSetting />,
    submenu: [
      {
        id: "3-1",
        name: "User Management",
        url: "/UserManagement",
      },
      {
        id: "3-2",
        name: "Menu Management",
        url: "/MenuManagement",
      },
      {
        id: "3-4",
        name: "Profile Management",
        url: "/ProfileManagement",
      },
      {
        id: "3-5",
        name: "Regional Office",
        url: "/Regional Management",
      },
    ],
  },
  {
    id: "4",
    name: "Contacts",
    icon: <MdOutlineContacts />,
    url: "/home",
    submenu: false,
  },
  {
    id: "5",
    name: "Solutions",
    icon: <BsFillJournalBookmarkFill />,
    url: "/home",
    submenu: false,
  },
  {
    id: "6",
    name: "Forums",
    icon: <BiMessageDetail />,
    url: "/home",
    submenu: false,
  },
  {
    id: "7",
    name: "Reports",
    icon: <BsFileEarmarkBarGraphFill />,
    url: "/home",
    submenu: false,
  },
];

export default MenuList;
