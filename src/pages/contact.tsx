import { MainLayout } from "components/layout/layout-main";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import React, { FC, useState } from "react";
import { Box, Button, Header, Icon, Input, Modal, Sheet, Spinner, Text } from "zmp-ui";
import { createPortal } from "react-dom";
import { openChat } from "zmp-sdk/apis";
import { splitByComma } from "utils/price";
import { API_URL } from "utils/constant";
import { isEmpty } from "lodash";

type RevenueData = {
  code: string,
  name: string,
  income:
  {
    month: string,
    amount: number
  }[]
}

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
  const [contactSheetVisible, setContactSheetVisible] = useState(false)
  const [contactPopup, setContactPopup] = useState(false)
  const [inputSheetVisible, setInputSheetVisible] = useState(false)
  const [revenuePopup, setRevenuePopup] = useState(false)
  const [code, setCode] = useState("")
  const phoneNumbers = ['0799800444', '0357141817'];
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [errMsg, setErrMsg] = useState(false)

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

  const checkRevenue = () => {
    if (isEmpty(code)) return
    fetch(`${API_URL}/sheet/ctv_revenue?ref_code=${code}`)
      .then(async (response) => {
        if (response.ok) {
          setInputSheetVisible(false)
          const data = await response.json() as RevenueData
          setErrMsg(false)
          setRevenueData(data)
          setRevenuePopup(true)
        } else {
          console.log('Error fetching data:', response.status);
          if (response.status === 400) {
            setErrMsg(true)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const CallingPopup = () =>
    <Modal
      visible={contactPopup}
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
          onClick: () => setContactPopup(false),
          className: "!text-red"
        },
      ]}
    />

  const RevenueCheckPopup = ({ data }: { data: RevenueData }) => {
    const { code, name, income } = data;

    const RevenueRow = () => (
      <Box className="mt-5"
      >
        <Box flex justifyContent="space-between">
          <Text.Title className="text-slate-500">Mã cá nhân</Text.Title>
          <Text.Title className="text-[#0069F6]">{code}</Text.Title>
        </Box>

        <Box flex justifyContent="space-between" className="mt-2">
          <Text.Title className="text-slate-500">Tên CTV</Text.Title>
          <Text.Title className="text-[#0069F6]">{name}</Text.Title>
        </Box>

        <Box flex justifyContent="space-between" className="font-semibold mt-5 text-slate-500">
          <Text.Header>Tháng</Text.Header>
          <Text.Header>Thu nhập</Text.Header>
        </Box>

        {income && income.length > 0 ? (
          income.map((entry, index) => (
            <Box
              key={index}
              flex
              justifyContent="space-between"
              className="mt-2 text-[#0069F6]"
            >
              <Box flex flexDirection="column">
                <Text.Header>{entry.month}</Text.Header>
              </Box>

              <Box className="space-y-1">
                <Text.Header>{splitByComma(entry.amount)} đ</Text.Header>
              </Box>
            </Box>
          ))
        ) : (
            <Text className="text-slate-400">Chưa có thu nhập</Text>
        )}
      </Box>
    )
    return (
      <Modal
        visible={revenuePopup}
        modalClassName="text-slate-600 space-y-[-25px]"
        title='Lịch sử thu nhập'
        children={<RevenueRow />}
        actionsDivider={false}
        actions={[
          {
            text: "Đóng",
            onClick: () => setRevenuePopup(false),
            className: "!text-red"
          },
        ]}
      />
    )
  }

  return (
    <Box className="m-4">
      <CallingPopup />
      {revenueData && <RevenueCheckPopup data={revenueData} />}
      <ListRenderer
        title=""
        items={[
          {
            left: <Icon icon="zi-star" />,
            right: (
              <Box flex onClick={() => setContactPopup(true)}>
                <Text.Header className="flex-1 items-center font-normal">
                  Trở thành cộng tác viên
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-note" />,
            right: (
              <Box flex onClick={() => setInputSheetVisible(true)}>
                <Text.Header className="flex-1 items-center font-normal">
                  Xem thu nhập cộng tác viên
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-call" />,
            right: (
              <Box flex onClick={() => setContactSheetVisible(true)}>
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
        <Sheet visible={contactSheetVisible}
          onClose={() => setContactSheetVisible(false)}
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
      {createPortal(
        <Sheet visible={inputSheetVisible}
          onClose={() => setInputSheetVisible(false)}
          height={5}
        >
          <Box px={3} py={1} className="space-y-2 h-96">
            <Text.Title className="text-lg text-center">
              Nhập mã cá nhân
            </Text.Title>
            <Box flex className="space-x-2">
              <Input placeholder="Hãy nhập mã cá nhân"
                className="text-sm"
                size="small"
                value={code}
                onChange={(event) => {
                  console.log(event.target.value)
                  setCode(event.target.value)
                }}
              />
              <button
                className="px-8 py-3 rounded-3xl bg-primary text-white"
                onClick={checkRevenue}
                disabled={!code}
              >
                Tìm
              </button>
            </Box>
            {errMsg &&
              <Text className="mx-2 text-red">
                Không tìm thấy mã cá nhân
              </Text>}
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
