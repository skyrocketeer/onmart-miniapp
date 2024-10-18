import { ListRenderer } from "components/list-renderer";
import React, { ChangeEvent, Suspense, useEffect, useState } from "react";
import { Box, Icon, Input, Text } from "zmp-ui";
import { PersonPicker, RequestPersonPickerPhone } from "./person-picker";
import { RequestStorePickerLocation, StorePicker } from "./store-picker";
import { TimePicker } from "./time-picker";
import { useRecoilState } from "recoil";
import { shippingInfoState } from "state";
import { getErrorMessage } from "utils/form-validation";
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { ShippingData } from "types/order";

enum ShipType {
  AT_DOOR = "D2D",
  AT_STORE = "PICKUP",
}

export const Delivery = ({ control, errors, setValue, getValues }: {
  control: Control<ShippingData, any>,
  getValues: UseFormGetValues<ShippingData>,
  errors: FieldErrors<ShippingData>,
  setValue: UseFormSetValue<ShippingData>
}) => {
  const [shipInfo, setShipInfo] = useRecoilState(shippingInfoState);
  const [shipType, setShipType] = useState(ShipType.AT_DOOR)

  useEffect(() => {
    if (shipType == ShipType.AT_STORE)
      updateShipInfo("shippingAddressText", "Vuờn Hydroworks Quận 9")
  }, [shipType])

  const updateShipInfo = (key: string, value: string): void => {
    if (key in shipInfo) {
      setShipInfo({ ...shipInfo, [key]: value })
    }
  }

  useEffect(() => {
    setValue("shippingAddress", shipInfo.shippingAddress)
  }, [shipInfo.shippingAddress])

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == "note") {
      updateShipInfo("note", value)
    }
    else {
      updateShipInfo("shippingAddress", value)
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
                  className="bg-primary mx-2 p-3 rounded-md shadow-2xl gap-2"
                  role='button'
                  onClick={() => setShipType(ShipType.AT_DOOR)}
                >
                  <Text size="small" className="font-semibold text-white">
                    Nhận hàng tại địa chỉ <sup className="text-red-600">*</sup>
                  </Text>
                  <Box flex alignItems="center" className="space-x-4">
                    <Icon className="text-white" icon="zi-radio-checked" size={18} />
                    <Controller
                      name='shippingAddress'
                      control={control}
                      rules={{
                        required: 'Không được để trống địa chỉ',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input placeholder="Nhập địa chỉ"
                          className="text-sm"
                          size="small"
                          value={value as string}
                          onChange={(event) => {
                            onChange(event);
                            handleInputChange(event)
                          }}
                          // disabled={shipType !== ShipType.AT_DOOR ? true : false}
                        />
                      )}
                    />
                  </Box>
                  {errors.shippingAddress && <div className="text-xs text-orange-400 ml-9 mt-[-8px]">{getErrorMessage(errors.shippingAddress)}</div>}
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
              <Suspense>
                <PersonPicker
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  getHookFormValues={getValues}
                />
              </Suspense>
            ),
          },
          {
            left: <Icon icon="zi-note" className="my-auto" />,
            right: (
              <Box flex>
                <Controller
                  name={'note'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      name="note"
                      value={value as string}
                      placeholder="Nhập ghi chú..."
                      className="border-none px-0 w-full focus:outline-none"
                      onChange={(event) => {
                        onChange(event);
                        handleInputChange(event)
                      }}
                    />
                  )}
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
