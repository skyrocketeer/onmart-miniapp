import { DisplayPrice } from "components/display/price";
import React, { FC, useMemo, useState } from "react";
import { Product } from "types/product";
import { Box, Icon, Modal, Text } from "zmp-ui";
import { ProductPicker } from "./picker";
import cx, { convertStringToNumber } from "utils/helpers";
import { useRecoilValue } from "recoil";
import { cartState } from "state";
import { calcFinalPrice, convertPriceToNumber } from "utils/price";
import { getCurrentQuantity } from "utils/product";
import FireProgressBar from "components/progress/fire";

export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  const cart = useRecoilValue(cartState)
  const currentQuantity = useMemo(() => getCurrentQuantity(product.sku, cart), [product.sku, cart]);
  const finalPriceMemo = useMemo(() => calcFinalPrice(product), [])
  const randomNum = Math.floor(Math.random() * 21) + 30;
  const AddButton = ({ added }: { added: Function }) => {
    const [alertPopup, setAlertPopup] = useState(false)

    const AlertPopup = () =>
      <Modal
        visible={alertPopup}
        modalClassName="text-slate-800 text-justify"
        description="Chỉ được phép chọn 1 sản phẩm ưu đãi 1K"
        actionsDivider={false}
        actions={[
          {
            text: "Đã hiểu",
            onClick: () => setAlertPopup(false),
            className: "!text-red"
          },
        ]}
      />

    const handleClick = (onAdd: boolean, sku: string, priceBefore: number, isExceeded: boolean) => {
      if (onAdd) {
        if (priceBefore <= 1000 && isExceeded) {
          setAlertPopup(true)
          return
        }
        added(+1);
      }
      else {
        if (currentQuantity > 0)
          added(-1);
        else
          added(0);
      }
    }; // Hàm chỉ được tạo lại khi `count` thay đổi
    return (
      <Box
        className="w-fit h-full px-2 pb-3 flex space-x-1 items-end col-span-1"
      >
        <Box role='button'
          onClick={() => handleClick(false, product.sku, 0, false)}
        >
          <Icon
            icon="zi-minus-circle-solid"
            className={cx("h-6 w-6", currentQuantity > 0 ? "text-primary" : 'text-slate-200')}
          />
        </Box>
        <AlertPopup />
        <span className="text-slate-4001 font-semibold">{currentQuantity}</span>
        <Box onClick={() => handleClick(true, product.sku, convertPriceToNumber(product.priceBefore), currentQuantity >= 1)} role='button'>
          <Icon
            icon="zi-plus-circle-solid"
            className="h-6 w-6 text-primary"
          />
        </Box>
      </Box>
    )
  }

  return (
    <ProductPicker product={product} >
      {({ open, added }) => (
        <Box className="grid grid-flow-col grid-cols-1 rounded-lg shadow-md">
          <Box className="col-span-2" onClick={open}>
            <Box className="relative grid grid-cols-3 gap-x-4">
              <img
                loading="lazy"
                src={product.image}
                className="w-24 h-20 rounded-lg bg-skeleton col-span-1"
              />
              {convertPriceToNumber(product.priceBefore) <= 1000 &&
                <span className="absolute left-6 px-2 bg-red text-white text-xs font-bold rounded-full">
                  Giá sốc
                </span>
              }
              <Box className="h-full col-span-2 overflow-hidden py-3 space-y-1">
                <Text className="font-semibold block max-w-[9rem]">{product.name}</Text>
                <Box flex className="space-x-2 items-center">
                  {convertStringToNumber(product.priceBefore) > finalPriceMemo ?
                    (<Text size="small" className="line-through text-red">
                      <DisplayPrice useCurrency>
                        {convertStringToNumber(product.priceBefore)}
                      </DisplayPrice>
                    </Text>
                    ) : null
                  }
                  <Text size="large" className="font-semibold text-primary">
                    <DisplayPrice useCurrency>{finalPriceMemo}</DisplayPrice>
                  </Text>
                </Box>
                {finalPriceMemo === 1000 &&
                  <FireProgressBar progress={randomNum} />
                }
                <Text size="xSmall" className="text-orange-400 font-semibold">
                  Đơn vị tính: {product.unit}
                </Text>
              </Box>
            </Box>
          </Box>
          <AddButton added={added} />
        </Box>
      )}
    </ProductPicker>
  );
};
