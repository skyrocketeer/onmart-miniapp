import { MainLayout } from "components/layout/layout-main";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import React, { FC, useState } from "react";
import { Box, Header, Icon, Modal, Sheet, Text } from "zmp-ui";
import { createPortal } from "react-dom";
import { openChat } from "zmp-sdk/apis";

const Personal: FC = () => {
  const onClick = useToBeImplemented();

  return (
    <Box className="m-4">
      <ListRenderer
        title="Cá nhân"
        onClick={onClick}
        items={[
          {
            left: <Icon icon="zi-user" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Thông tin tài khoản
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-clock-2" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Lịch sử đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const Other: FC = () => {
  const [sheetVisible, setSheetVisible] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)

  const phoneNumbers = ['0799800444', '0357141817'];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  // const handleMessenger = () => {
  //   // Replace 'your-page-id' with your actual Facebook page ID
  //   window.open(`fb-messenger://thread/`, '_blank');
  // };

  const handleZaloChat = () => {
    openChat({
      id: "1787040047543281931",
      type: "oa"
    })
  }

  return (
    <Box className="m-4">
      <Modal
        visible={popupVisible}
        modalClassName="text-slate-800 text-justify"
        description="Gọi cho chúng tôi ngay để có cơ hội trở thành đại lí hoặc CTV với chính sách hoa hồng hấp dẫn"
        actions={[
          {
            text: "Gọi ngay",
            onClick: () => handleCall(phoneNumbers[0]),
            highLight: true
          },
          {
            text: "Đóng",
            onClick: () => setPopupVisible(false),
            className: "!text-red"
          },
        ]}
      />
      <ListRenderer
        title=""
        items={[
          {
            left: <Icon icon="zi-star" />,
            right: (
              <Box flex onClick={() => setPopupVisible(true)}>
                <Text.Header className="flex-1 items-center font-normal">
                  Trở thành cộng tác viên
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-call" />,
            right: (
              <Box flex onClick={() => setSheetVisible(true)}>
                <Text.Header className="flex-1 items-center font-normal">
                  Liên hệ và góp ý
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
      {createPortal(
        <Sheet visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          autoHeight
        >
          <Box px={3} py={1} className="space-y-4 h-96">
            <Text.Title className="text-lg text-center">
              Liên hệ với chúng tôi
            </Text.Title>
            <ListRenderer
              items={[
                ...phoneNumbers.map((number, index) => (
                  {
                    left: (<Icon icon="zi-call" />),
                    right: (
                      <Box flex className="text-primary space-x-1"
                        onClick={() => handleCall(number)}
                      >
                        <Text.Header >Hotline {index + 1}:</Text.Header>
                        <Text.Header>{number}</Text.Header>
                      </Box>
                    ),
                  }
                )),
                // {
                //   left: <Icon icon="zi-inbox" />,
                //   right: (
                //     <Box onClick={handleMessenger}>
                //       <Text.Header className="text-primary">
                //         Nhắn tin qua Messenger cho Fanpage OnMart
                //       </Text.Header>
                //     </Box>
                //   ),
                // },
                {
                  left: <Icon icon="zi-inbox" />,
                  right: (
                    <Box onClick={handleZaloChat}>
                      <Text.Header className="text-primary">
                        Nhắn tin qua Zalo OnMart
                      </Text.Header>
                    </Box>
                  ),
                },
              ]}
              renderLeft={(item) => item.left}
              renderRight={(item) => item.right}
            />
          </Box>
        </Sheet >
        , document.body,
      )}
    </Box>
  );
};

const ContactPage: FC = () => {
  return (
    <MainLayout>
      <Header showBackIcon={false} title="&nbsp;" />
      {/* <Personal /> */}
      <Other />
    </MainLayout>
  );
};

export default ContactPage;
