import { useVirtualKeyboardVisible } from "hooks";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { BottomNavigation, Icon } from "zmp-ui";
import { CartIcon } from "./cart-icon";
import { TicketIcon } from "./icon/ticket";

type NavItemProps = {
  path: string
  label: string
  icon: ReactNode,
  activeIcon?: ReactNode
}

const tabs: Array<NavItemProps> = [
  {
    path: "/",
    label: "Trang chủ",
    icon: <Icon icon="zi-home" />,
    // activeIcon: <Icon icon="zi-home" />
  },
  {
    path: "/voucher",
    label: "Khuyến mãi",
    icon: <TicketIcon sizeClass="w-6 h-6" />,
    // activeIcon: <Icon icon="zi-notif" />,
  },
  // {
  //   path: "/notification",
  //   label: "Thông báo",
  //   icon: <Icon icon="zi-notif" />,
  //   // activeIcon: <Icon icon="zi-notif" />,
  // },
  {
    path: "/cart",
    label: "Giỏ hàng",
    icon: <CartIcon />,
    activeIcon: <CartIcon active />,
  },
  {
    path: "/contact",
    label: "Liên hệ",
    icon: <Icon icon="zi-chat" />,
    // activeIcon: <Icon icon="zi-user-solid" />,
  },
];

export const NO_BOTTOM_NAVIGATION_PAGES = ["/search", "/category", "/result"];

export const Navigation: FC = () => {
  const [activeTab, setActiveTab] = useState("/");
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();

  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (noBottomNav || keyboardVisible) {
    return <></>;
  }

  useEffect(() => {
    if (tabs.find((item) => item.path === location.pathname)) {
      setActiveTab(location.pathname);
    }
  }, [location]);

  return (
    <BottomNavigation
      id="footer"
      activeKey={activeTab}
      onChange={(key: string) => {
        setActiveTab(key)
      }}
      className="z-50"
    >
      {tabs.map(({ path, label, icon, activeIcon }) => (
        <BottomNavigation.Item
          key={path}
          label={label}
          icon={icon}
          activeIcon={activeIcon}
          onClick={() => navigate(path)}
        />
      ))}
    </BottomNavigation>
  );
};
