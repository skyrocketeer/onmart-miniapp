import { FinalPrice } from "components/display/final-price";
import { DisplayPrice } from "components/display/price";
import React, { FC } from "react";
import { Product } from "types/product";
import { convertPriceToNumber } from "utils/price";
import { Box, Icon, Text } from "zmp-ui";
import { ProductPicker } from "./picker";

export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  // const [isAddedToCartNow, setAddToCart] = useState(false)
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
              <Box className="h-full col-span-2 overflow-hidden py-4">
                <Text className="font-semibold">{product.name}</Text>
                {product.priceBefore > product.priceSale ?
                  (<Text size="xxSmall" className="line-through text-red-600">
                    <DisplayPrice useCurrency>{convertPriceToNumber(product.priceBefore)}</DisplayPrice>
                  </Text>
                  ) : null
                }
                <Text size="large" className="font-medium text-primary">
                  <FinalPrice>{product}</FinalPrice>
                </Text>
                <Text size="xSmall" className="text-orange-400">
                  Đơn vị tính: 1kg
                </Text>
              </Box>
            </Box>
          </Box>
          <Box className="w-fit h-full px-2 pb-3 flex items-end col-span-1" role="button" onClick={added}>
            <Icon icon="zi-plus-circle-solid" className="h-6 w-6 text-primary" />
          </Box>
        </Box>
      )}
    </ProductPicker>
  );
};
