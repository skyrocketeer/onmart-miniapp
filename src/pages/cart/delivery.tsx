import { ElasticTextarea } from "components/elastic-textarea";
import { ListRenderer } from "components/list-renderer";
import React, { ChangeEvent, FC, ReactNode, Suspense, useEffect, useState } from "react";
import { Box, Icon, Input, Text } from "zmp-ui";
import { PersonPicker, RequestPersonPickerPhone } from "./person-picker";
import { RequestStorePickerLocation, StorePicker } from "./store-picker";
import { TimePicker } from "./time-picker";
import { useRecoilState } from "recoil";
import { shippingInfoState } from "state";

enum ShipType {
  AT_DOOR = "D2D",
  AT_STORE = "PICKUP",
}

export const Delivery = () => {
  const [shipInfo, setShipInfo] = useRecoilState(shippingInfoState);
  const [shipType, setShipType] = useState(ShipType.AT_DOOR)
  const [shipAddress, setShipAddress] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (shipType == ShipType.AT_STORE)
      updateShipInfo("shippingAddressText", "Vuờn Hydroworks Quận 9")
  }, [shipType])

  const updateShipInfo = (key: string, value: string): void => {
    if (key in shipInfo) {
      setShipInfo({ ...shipInfo, [key]: value })
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == "note") {
      setNote(value)
      updateShipInfo("note", event.target.value)
    }
    else {
      setShipAddress(event.target.value)
      updateShipInfo("shippingAddressText", event.target.value)
    }
  };

  return (
    <Box className="space-y-3 px-4">
      <Text.Header>Hình thức nhận hàng</Text.Header>
      <ListRenderer
        items={[
          {
            left: <Icon icon="zi-location" className="my-auto" />,
            right: (
              <Box flex flexDirection="column" className="space-y-4">
                <Box flex flexDirection="column"
                  className="border bg-slate-200 border-slate-200 mx-2 p-3 rounded-lg shadow-md gap-2"
                  // role='button'
                  // onClick={() => setShipType(ShipType.AT_STORE)}
                >
                  <Text size="small" className="font-semibold text-slate-400">Đến lấy tại cửa hàng</Text>
                  <Box flex alignItems="center" className="space-x-4">
                    <Icon icon="zi-radio-unchecked" size={18} />
                    <Suspense fallback={<RequestStorePickerLocation />}>
                      <StorePicker />
                    </Suspense>
                  </Box>
                </Box>
                <Box flex flexDirection="column"
                  className="border bg-slate-200 border-slate-200 mx-2 p-3 rounded-lg shadow-md gap-2"
                  role='button'
                  onClick={() => setShipType(ShipType.AT_DOOR)}
                >
                  <Text size="small" className="font-semibold text-slate-400">
                    Nhận hàng tại địa chỉ
                  </Text>
                  <Box flex alignItems="center" className="space-x-4">
                    <Icon icon="zi-radio-checked" size={18} />
                    <Input placeholder="Nhập địa chỉ"
                      name="address"
                      className="text-sm"
                      size="small"
                      // disabled={shipType !== ShipType.AT_DOOR ? true : false}
                      value={shipAddress}
                      onChange={handleInputChange}
                    />
                  </Box>
                </Box>
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-clock-1" className="my-auto" />,
            right: (
              <Box flex className="space-x-2">
                <Box className="flex-1 space-y-[2px]">
                  <TimePicker />
                  <Text size="xSmall" className="text-gray">
                    Thời gian nhận hàng
                  </Text>
                </Box>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-user" className="my-auto" />,
            right: (
              <Suspense fallback={<RequestPersonPickerPhone />}>
                <PersonPicker />
              </Suspense>
            ),
          },
          {
            left: <Icon icon="zi-note" className="my-auto" />,
            right: (
              <Box flex>
                <Input
                  name="note"
                  placeholder="Nhập ghi chú..."
                  className="border-none px-0 w-full focus:outline-none"
                  value={shipInfo.note || note}
                  onChange={handleInputChange}
                />
              </Box>
            ),
          },
        ]}
        limit={5}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};
