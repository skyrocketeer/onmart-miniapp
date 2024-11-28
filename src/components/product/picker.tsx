import { Sheet } from "components/fullscreen-sheet";
import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSetRecoilState } from "recoil";
import { cartState } from "state";
import { SelectedOptions } from "types/cart";
import { Product } from "types/product";
import { calcFinalPrice, isIdentical } from "utils/price";
import { Box, Button, Text } from "zmp-ui";
import { MultipleOptionPicker } from "./multiple-option-picker";
import { QuantityPicker } from "./quantity-picker";
import { SingleOptionPicker } from "./single-option-picker";
import { DisplayPrice } from "components/display/price";

export interface ProductPickerProps {
  product?: Product;
  selected?: {
    options: SelectedOptions;
    quantity: number;
  };
  children: (methods: {
    open: () => void;
    close: () => void;
    added: (amount: number) => void;
  }) => ReactNode;
}

function getDefaultOptions(product?: Product) {
  if (product && product.variants) {
    return product.variants.reduce(
      (options, variant) =>
        Object.assign(options, {
          [variant.id]: variant.default,
        }),
      {},
    );
  }
  return {};
}

export const ProductPicker: FC<ProductPickerProps> = ({
  children,
  product,
  selected,
}) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<SelectedOptions>(
    selected ? selected.options : getDefaultOptions(product),
  );
  const [quantity, setQuantity] = useState(0);
  const setCart = useSetRecoilState(cartState);

  useEffect(() => {
    if (selected) {
      setOptions(selected.options);
      // setQuantity(selected.quantity);
    }
  }, [selected]);

  const addToCart = (quantity = 0) => {
    if (product) {
      setCart((cart) => {
        let res = [...cart];
        // adding new item to cart, or merging if it already existed before
        const existed = cart.find(
          (item) => item.product.sku === product.sku && isIdentical(item.options, options),
        );
        if (existed) {
          if (quantity === 0) {
            // Remove the item if quantity is 0
            res = res.filter(item => item.product.sku !== product.sku);
            console.log('not selected ', res)
          } else {
            // Update the quantity of the existing item
            res = res.map(item =>
              item.product.sku === product.sku
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
        } else {
          // If the item doesn't exist, add a new one to the cart
          if (quantity > 0) {
            res = [...res, { product, options, quantity }];
          }
        }

        return res;
      });
    }
    setVisible(false);
  };

  const handleAddToCartNow = (quantity: number) => {
    setQuantity(quantity)
    addToCart(quantity)
  }

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
        added: handleAddToCartNow
      })}

      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          {product && (
            <Box className="space-y-6 mt-2" p={4}>
              <Box className="space-y-2">
                <Text.Title>{product.name}</Text.Title>
                <Text>
                  <DisplayPrice useCurrency>
                    {calcFinalPrice(product)}
                  </DisplayPrice>
                </Text>
                <Text>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.description ?? "",
                    }}
                  ></div>
                </Text>
              </Box>
              <Box className="space-y-5">
                {product.variants &&
                  product.variants.map((variant) =>
                    variant.type === "single" ? (
                      <SingleOptionPicker
                        key={variant.id}
                        variant={variant}
                        value={options[variant.id] as string}
                        onChange={(selectedOption) =>
                          setOptions((prevOptions) => ({
                            ...prevOptions,
                            [variant.id]: selectedOption,
                          }))
                        }
                      />
                    ) : (
                      <MultipleOptionPicker
                        key={variant.id}
                        product={product}
                        variant={variant}
                        value={options[variant.id] as string[]}
                        onChange={(selectedOption) =>
                          setOptions((prevOptions) => ({
                            ...prevOptions,
                            [variant.id]: selectedOption,
                          }))
                        }
                      />
                    ),
                  )}
                <QuantityPicker value={quantity} onChange={setQuantity} />
                {selected ? (
                  <Button
                    variant={quantity > 0 ? "primary" : "secondary"}
                    type={quantity > 0 ? "highlight" : "neutral"}
                    fullWidth
                    onClick={(e) => handleAddToCartNow(quantity)}
                  >
                    {quantity > 0
                      ? selected
                        ? "Cập nhật giỏ hàng"
                        : "Thêm vào giỏ hàng"
                      : "Xoá"}
                  </Button>
                ) : (
                  <Button
                      disabled={!quantity}
                      variant="primary"
                      type="highlight"
                      fullWidth
                      onClick={(e) => handleAddToCartNow(quantity)}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Sheet>,
        document.body,
      )}
    </>
  );
};
