import { ListItem } from "components/list-item";
import React, { ChangeEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Control, Controller, FieldErrors, useForm, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { shippingInfoState, userState } from "state";
import { ShippingData } from "types/order";
import { getErrorMessage, phoneNumberRegex, unicodeAlphabetRegex } from "utils/form-validation";
import { Box, Input, Modal, Sheet, Text } from "zmp-ui";
import { getAccessToken, openPermissionSetting, authorize, getPhoneNumber, getLocation } from "zmp-sdk/apis";
import { API_URL } from "utils/constant";
import { isEmpty, truncate } from "lodash";

type DeliveryInfo = {
  clientName: string,
  phoneNumber: string
}


export const PersonPicker = ({ control, errors, setValue, getHookFormValues }: {
  control: Control<ShippingData, any>,
  errors: FieldErrors<ShippingData>,
  setValue: UseFormSetValue<ShippingData>,
  getHookFormValues: UseFormGetValues<ShippingData>
}) => {
  const [globalState, updateState] = useRecoilState(shippingInfoState);
  const handleChangeDeliveryInfo = (newData: DeliveryInfo) => {
    console.log("newData ", newData)
    updateState({ ...globalState, ...newData })
  }

  return <RequestPersonPickerPhone
    emitChangeDeliveryInfo={handleChangeDeliveryInfo}
    initialValue={{ clientName: globalState.clientName as string, phoneNumber: globalState.phoneNumber as string }}
    control={control}
    errors={errors}
    setHookFormValue={setValue}
    getHookFormValues={getHookFormValues}
  />
};

export const RequestPersonPickerPhone = ({ emitChangeDeliveryInfo, initialValue, control, errors, setHookFormValue, getHookFormValues }: {
  emitChangeDeliveryInfo?: Function,
  initialValue: DeliveryInfo,
  control: Control<ShippingData, any>,
  errors: FieldErrors<ShippingData>,
  setHookFormValue: UseFormSetValue<ShippingData>,
  getHookFormValues: UseFormGetValues<ShippingData>
}) => {
  const [visible, setVisible] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false);
  const currentZaloUser = useRecoilValue(userState)

  const getUserInfo = async () => {
    try {
      await authorize({ scopes: ["scope.userLocation", "scope.userPhonenumber"] });
      const accessToken = await getAccessToken({});
      // console.log('accessToken', accessToken);
      const phone_token = await getPhoneNumber({}).then(result => result.token || "")
      // console.log(phone_token)
      const location_token = await getLocation({}).then(result => result.token || "")
      // console.log(location_token)
      requestUserPrivateInfo(accessToken, phone_token, location_token)

      // requestUserPrivateInfo("accessToken", "phone_token", "location_token")
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log("cannot ask for user permission ", error);
    }
  }

  function formatPhoneNumber(phoneNumber) {
    const phoneStr = String(phoneNumber);

    // Check if it starts with '84'
    if (phoneStr.startsWith('84')) {
      // Replace '84' with '0'
      return '0' + phoneStr.slice(2);
    }

    return phoneStr; // Return the original string if it doesn't start with '84'
  }

  const requestUserPrivateInfo = async (
    accessToken: string,
    phone_token: string,
    location_token: string
  ) => {
    const data = {
      accessToken,
      phone_token,
      location_token
    };

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    fetch(`${API_URL}/user/info`, requestOptions)
      .then(async (response) => {
        const data = await response.json()
        if (!data.phone_number.length || isEmpty(data.location)) {
          setVisible(false)
          setPopupVisible(true)
        }

        if (data.phone_number!!) {
          const phoneNumber = formatPhoneNumber(data.phone_number)
          setHookFormValue('clientName', currentZaloUser.name);
          setHookFormValue('phoneNumber', phoneNumber);
        }

        if (!isEmpty(data.location) && data.location.latitude!! && data.location.longitude!!) {
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${data.location.latitude}&lon=${data.location.longitude}&format=json&accept-language=vi`)
            .then(res => res.json())
            .then(res => {
              emitChangeDeliveryInfo?.({ shippingAddress: res.display_name!! })
            })
        }
        if (popupVisible)
          setPopupVisible(false)
      })
      .catch(err => {
        console.error(err.message)
        setVisible(false)
        setPopupVisible(true)
      })
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    if (name === 'phoneNumber') {
      value = truncate(value, { length: 10 });
    }
    return value
  };

  const onChoosingLocation = (e) => {
    setVisible(false)
    if (emitChangeDeliveryInfo)
      emitChangeDeliveryInfo({
        phoneNumber: getHookFormValues("phoneNumber"),
        clientName: getHookFormValues("clientName")
      })
  }

  return (
    <>
      <ListItem
        onClick={() => setVisible(true)}
        title={getHookFormValues("clientName") ? `${getHookFormValues("clientName") || initialValue.clientName || "Người nhận"} - ${getHookFormValues("phoneNumber") || initialValue.phoneNumber}` : "Chọn người nhận"}
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
            text: "Cấp lại quyền",
            onClick: getUserInfo,
            highLight: true,
          },
        ]}
        modalClassName="text-red-500 text-center"
        description="Có lỗi xảy ra hoặc bạn cần cấp quyền cho ứng dụng để lấy được thông tin vị trí và số điện thoại"
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
                    value={value}
                    onChange={(event) => {
                      onChange(handleInputChange(event));
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
                    value={value}
                    onChange={(event) => {
                      onChange(handleInputChange(event));
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
