import { 
    FaDollarSign, 
    FaUsers, 
    FaHome ,
    FaLaptopCode ,
    FaUserCircle , 
  } from "react-icons/fa";
  
  import img2 from '../assets/img2.png';

  
  export const SidebarData = [
    {
      heading: <h3 className="item-heading">Homepage</h3>,
      path: "/homepage",
    },
  
    {
      heading: <h3 className="item-heading">portfolio</h3>,
      path: "/portfolio",
    },
    {
      heading: <h3 className="item-heading">courses</h3>,
      path: "/categories",
    },
  {
  heading: "Design",
  isDesignPopup: true, 
}

  ];
  
  export const CardsData = [
    {
      title: "Earnings",
      color: {
        backGround: "linear-gradient(180deg,#5737ff,0%,#f4c507c5)",
        boxShadow: "0px 10xp 20px 0px #f4c507c5",
      },
      barValue: 70,
      value: "25,970",
      png: FaDollarSign,
      series: [
        {
          name: "Earnings",
          data: [31, 40, 200, 150, 100, 45],
        },
      ],
    },
  ];
  
  export const UpdateData = [
    {
      id: 1,
      img: img2,
      name: "deema :",
      noti: "good job",
      time: "25 secound ago",
    },
    {
      id: 2,
      img: img2,
      name: "eslam :",
      noti: "good job",
      time: "25 secound ago",
    },
    {
      id: 3,
      img: img2,
      name: "joudi :",
      noti: "good job",
      time: "25 secound ago",
    },
    {
      id: 4,
      img: img2,
      name: "joudi :",
      noti: "good job",
      time: "25 secound ago",
    },
    {
      id: 5,
      img: img2,
      name: "joudi :",
      noti: "good job",
      time: "25 secound ago",
    },
  ];
  