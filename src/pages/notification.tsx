import { Divider } from "components/divider";
import { MainLayout } from "components/layout/layout-main";
import { ListRenderer } from "components/list-renderer";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { notificationsState } from "state";
import { Box, Header, Text } from "zmp-ui";

const NotificationList: FC = () => {
  const notifications = useRecoilValue(notificationsState);
  return (
    <Box className="bg-background">
      <ListRenderer
        noDivider
        items={notifications}
        renderLeft={(item) => (
          <img className="w-10 h-10 rounded-full" src={item.image} />
        )}
        renderRight={(item) => (
          <Box key={item.id}>
            <Text.Header>{item.title}</Text.Header>
            <Text
              size="small"
              className="text-gray overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {item.content}
            </Text>
          </Box>
        )}
      />
    </Box>
  );
};

const NotificationPage: FC = () => {
  return (
    <MainLayout>
      <Header title="Thông báo" showBackIcon={false} />
      <Divider />
      <NotificationList />
    </MainLayout>
  );
};

export default NotificationPage;
