import { ListItem } from "components/list-item";
import React, { ChangeEvent, useState } from "react";
import { createPortal } from "react-dom";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { phoneState, shippingInfoState } from "state";
import { ShippingData } from "types/order";
import { getErrorMessage, phoneNumberRegex, unicodeAlphabetRegex } from "utils/form-validation";
import { Box, Input, Modal, Sheet, Text } from "zmp-ui";
import { getAccessToken, openPermissionSetting, authorize, getPhoneNumber } from "zmp-sdk/apis";
import { API_URL } from "utils/constant";

type DeliveryInfo = {
  clientName: string,
  phoneNumber: string
}

const defaultValue = {
  clientName: '',
  phoneNumber: '',
}

export const PersonPicker = ({ control, errors }:
  { control: Control<ShippingData, any>, errors: FieldErrors<ShippingData> }) => {
  const [globalState, updateState] = useRecoilState(shippingInfoState);
  const handleChangeDeliveryInfo = (newData: DeliveryInfo) => {
    updateState({ ...globalState, ...newData })
  }

  return <RequestPersonPickerPhone
    emitChangeDeliveryInfo={handleChangeDeliveryInfo}
    initialValue={{ clientName: globalState.clientName as string, phoneNumber: globalState.phoneNumber as string }}
    control={control}
    errors={errors}
  />
};

export const RequestPersonPickerPhone = ({ emitChangeDeliveryInfo, initialValue = defaultValue, control, errors }:
  { emitChangeDeliveryInfo?: Function, initialValue?: DeliveryInfo, control: Control<ShippingData, any>, errors: FieldErrors<ShippingData> }) => {
  const [visible, setVisible] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState(initialValue);
  const [phone, setPhoneState] = useRecoilState(phoneState);

  const getUserInfo = async () => {
    try {
      await authorize({ scopes: ["scope.userLocation", "scope.userPhonenumber"] });
      await openPermissionSetting({})
      const accessToken = await getAccessToken({});
      console.log('accessToken ', accessToken)
      getUserPrivateInfo(accessToken)
        .then(number => setPhoneState(number))
        .catch
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log("cannot ask for user permission", error);
      setVisible(false)
      setPopupVisible(true)
    }
  }

  const getUserPrivateInfo = async (token: string) => {
    const { number } = await getPhoneNumber({ fail: console.warn });
    if (number) {
      return number;
    }
    fetch(`${API_URL}/`, {
      method: 'POST',
      body: token
    })
      .then(async (response) => {
        const data = await response.json()
        console.log(data)
        return data
      })
      .catch(err => {
        console.error(err)
        return ""
      })
    return ""
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newVal = value.slice(0, 10)
    // Update the specific field in the formData object
    setFormData(prevState => ({
      ...prevState,
      [name]: newVal
    }));
    return newVal
  };

  const onChoosingLocation = (e) => {
    setVisible(false)
    if (emitChangeDeliveryInfo)
      emitChangeDeliveryInfo(formData)
  }

  return (
    <>
      <ListItem
        onClick={() => setVisible(true)}
        title={formData.phoneNumber ? `${formData.clientName || "Người nhận"} - ${formData.phoneNumber}` : "Chọn người nhận"}
        subtitle="Yêu cầu truy cập số điện thoại nếu tự điền thông tin"
      />
      <Modal
        visible={popupVisible}
        title="Lỗi lấy thông tin cá nhân"
        onClose={() => {
          setPopupVisible(false);
        }}
        actions={[
          {
            text: "Đóng",
            close: true,
          },
          {
            text: "Cấp quyền",
            onClick: getUserInfo,
            highLight: true,
          },
        ]}
        modalClassName="text-red-500"
        description="Bạn cần cấp quyền cho ứng dụng để lấy được thông tin vị trí và số điện thoại"
      />
      {(errors.clientName || errors.phoneNumber) &&
        <div className="text-xs text-red-600 mt-1">Thông tin người nhận chưa chính xác</div>
      }
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
              <Controller
                name='clientName'
                control={control}
                rules={{
                  required: 'Không được để trống tên người nhận',
                  pattern: {
                    value: unicodeAlphabetRegex,
                    message: 'Xin nhập đúng định dạng'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <Input
                    name="clientName"
                    value={value as string}
                    onChange={(event) => {
                      onChange(event);
                      handleInputChange(event)
                    }}
                    placeholder="Nhập tên người nhận"
                  />
                )}
              />
              {errors.clientName &&
                <div className="text-xs text-red-600">
                  {getErrorMessage(errors.clientName)}
                </div>
              }
            </Box>
            <Box>
              <Controller
                name='phoneNumber'
                control={control}
                rules={{
                  required: 'Không được để trống số điện thoại người nhận',
                  pattern: {
                    value: phoneNumberRegex,
                    message: 'Xin nhập chính xác số điện thoại'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <Input
                    name="phoneNumber"
                    value={phone}
                    onChange={(event) => {
                      const truncatedValue = handleInputChange(event);
                      onChange(truncatedValue);
                    }}
                    placeholder="Nhập số điện thoại người nhận"
                  />
                )}
              />
              {errors.phoneNumber && <div className="text-xs text-red-600">{getErrorMessage(errors.phoneNumber)}</div>}
            </Box>
            <Box flex className="space-x-5 pt-6">
              <button className="rounded-xl text-white bg-primary py-2 px-2 font-semibold"
                onClick={getUserInfo}
              >
                Điền thông tin của tôi
              </button>
              <button className="rounded-xl border border-primary text-primary bg-white py-2 px-2 font-semibold"
                onClick={onChoosingLocation}
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
