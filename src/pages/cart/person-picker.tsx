import { ListItem } from "components/list-item";
import React, { ChangeEvent, FC, MouseEventHandler, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { requestPhoneTriesState, shippingInfoState } from "state";
import cx, { isDigit } from "utils/helpers";
import { Box, Input, Sheet, Text } from "zmp-ui";

type DeliveryInfo = {
  clientName: string,
  phoneNumber: string
}

const defaultValue = {
  clientName: '',
  phoneNumber: '',
}

export const PersonPicker: FC = () => {
  const [globalState, updateState] = useRecoilState(shippingInfoState);
  const handleChangeDeliveryInfo = (newData: DeliveryInfo) => {
    updateState({ ...globalState, ...newData })
  }

  if (!globalState.phoneNumber) {
    return <RequestPersonPickerPhone emitChangeDeliveryInfo={handleChangeDeliveryInfo} initialValue={defaultValue} />;
  }

  return <ListItem title={`${globalState.clientName} - ${globalState.phoneNumber}`} subtitle="Người nhận hàng" />;
};

export const RequestPersonPickerPhone = ({ emitChangeDeliveryInfo, initialValue = defaultValue }: { emitChangeDeliveryInfo?: Function, initialValue?: DeliveryInfo }) => {
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState(initialValue);

  const [errorMsg, setErrorMsg] = useState<string[]>([])
  const retry = useSetRecoilState(requestPhoneTriesState);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Update the specific field in the formData object
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChoosingLocation = (e) => {
    setVisible(false)
    if (emitChangeDeliveryInfo)
      emitChangeDeliveryInfo(formData)
  }

  const validateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name == "phone") {
      if (!isDigit(value))
        setErrorMsg([...errorMsg, "phone"])
      else
        setErrorMsg([])
      return
    }

    if (name == "clientName") {
      if (value.length > 0)
        setErrorMsg([])
      else setErrorMsg([...errorMsg, "clientName"])
      return
    }
    setErrorMsg([])
  }

  return (
    <>
    <ListItem
        onClick={() => setVisible(true)}
        title={formData.phoneNumber ? `${formData.clientName || "Người nhận"} - ${formData.phoneNumber}` : "Chọn người nhận"}
        subtitle="Yêu cầu truy cập số điện thoại nếu tự điền thông tin"
      />
      {createPortal(
        <Sheet visible={visible}
          onClose={() => setVisible(false)}
          autoHeight
        >
          <Box px={6} py={8} className="space-y-3">
            <Text size="normal" className="text-slate-500 font-bold">Thông tin người nhận
              <span className="text-red-600 font-light text-sm"> (bắt buộc)</span>
            </Text>
            <Box>
              <Input value={formData.clientName} name="clientName"
                onChange={handleInputChange}
                placeholder="Nhập tên người nhận" />
              <Text size="xxxSmall" className="text-red-600">{errorMsg.filter(err => err === "clientName").length ? "Không được để trống tên người nhận" : ""}</Text>
            </Box>
            <Box>
              <Input value={formData.phoneNumber} name="phoneNumber"
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại người nhận"
                onInput={validateInput}
              />
              <Text size="xxxSmall" className="text-red-600">{errorMsg.filter(err => err === "phone").length ? "Xin hãy nhập đúng định dạng số điện thoại" : ""}</Text>
            </Box>
            <Box flex className="space-x-5 pt-6">
              <button className="rounded-xl text-white bg-primary py-2 px-2 font-semibold"
                onClick={() => retry((r) => r + 1)}
              >
                Điền thông tin của tôi
              </button>
              <button className={cx(errorMsg.length ? "bg-slate-300 text-slate-200 border-slate-50" : "text-primary border-primary", "rounded-xl border  py-2 px-2 font-semibold")}
                onClick={onChoosingLocation}
                disabled={errorMsg.length > 0}
              >
                Chọn thông tin nhận hàng này
              </button>
            </Box>
          </Box>
        </Sheet >
        , document.body,
      )}
    </>
  );
};
