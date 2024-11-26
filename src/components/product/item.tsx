import { DisplayPrice } from "components/display/price";
import React, { FC } from "react";
import { Product } from "types/product";
import { Box, Icon, Text } from "zmp-ui";
import { ProductPicker } from "./picker";
import cx, { convertStringToNumber } from "utils/helpers";
import { useRecoilValue } from "recoil";
import { cartState } from "state";
import { calcFinalPrice } from "utils/price";

export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  const cart = useRecoilValue(cartState)

  const getCurrentQuantity = (sku: string) => {
    const existed = cart.find(item => item.product.sku === sku)
    if (existed)
      return existed.quantity
    return 0
  }

  const AddButton = ({ added }: { added: Function }) => {
    const handleClick = (onAdd: boolean, sku: string) => {
      if (onAdd) {
        added(+1);
      }
      else {
        if (getCurrentQuantity(sku) > 0)
          added(-1);
      }
    }; // Hàm chỉ được tạo lại khi `count` thay đổi
    return (
      <Box
        className="w-fit h-full px-2 pb-3 flex space-x-1 items-end col-span-1"
      >
        <Box role='button'
          onClick={() => handleClick(false, product.sku)}
        >
          <Icon
            icon="zi-minus-circle-solid"
            className={cx("h-6 w-6", getCurrentQuantity(product.sku) > 0 ? "text-primary" : 'text-slate-200')}
          />
        </Box>
        {/* <Input
          value={product.sku}
        /> */}
        <span className="text-slate-4001 font-semibold">{getCurrentQuantity(product.sku)}</span>
        <Box onClick={() => handleClick(true, product.sku)} role='button'>
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
            <Box className="grid grid-cols-3 gap-x-4">
              <img
                loading="lazy"
                src={product.image}
                className="w-24 h-20 rounded-lg bg-skeleton col-span-1"
              />
              <Box className="h-full col-span-2 overflow-hidden py-3 space-y-1">
                <Text className="font-semibold">{product.name}</Text>
                <Box flex className="space-x-2 items-center">
                  {convertStringToNumber(product.priceBefore) > calcFinalPrice(product) ?
                    (<Text size="small" className="line-through text-red">
                      <DisplayPrice useCurrency>
                        {convertStringToNumber(product.priceBefore)}
                      </DisplayPrice>
                    </Text>
                    ) : null
                  }
                  <Text size="large" className="font-semibold text-primary">
                    <DisplayPrice useCurrency>{calcFinalPrice(product)}</DisplayPrice>
                  </Text>
                </Box>
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
