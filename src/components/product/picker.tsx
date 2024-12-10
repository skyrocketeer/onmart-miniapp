import { Sheet } from "components/fullscreen-sheet";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { cartState } from "state";
import { SelectedOptions } from "types/cart";
import { Product } from "types/product";
import { calcFinalPrice, convertPriceToNumber, isIdentical } from "utils/price";
import { Box, Button, Text } from "zmp-ui";
import { MultipleOptionPicker } from "./multiple-option-picker";
import { QuantityPicker } from "./quantity-picker";
import { SingleOptionPicker } from "./single-option-picker";
import { DisplayPrice } from "components/display/price";
import { getCurrentQuantity } from "utils/product";

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
  const [cart, setCart] = useRecoilState(cartState);
  const currentQuantity = useMemo(() => getCurrentQuantity(product?.sku, cart), [product?.sku, cart]);

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
  };

  const handleAddToCart = (quantity: number, isClosePopup: boolean = false) => {
    if (isClosePopup) {
      setVisible(false);
      if (currentQuantity < 1 && quantity) {
        return
      }
    }
    setQuantity(quantity)
    addToCart(quantity)
  }

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
        added: handleAddToCart
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
                {/* {product.variants &&
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
                  )} */}
                <QuantityPicker value={currentQuantity} price={convertPriceToNumber(product.priceBefore)} onChange={(q) => handleAddToCart(q)} />
                {selected ? (
                  <Button
                    variant={quantity > 0 ? "primary" : "secondary"}
                    type={quantity > 0 ? "highlight" : "neutral"}
                    fullWidth
                    onClick={(e) => handleAddToCart(quantity, true)}
                  >
                    Cập nhật giỏ hàng
                  </Button>
                ) : (
                  <Button
                      disabled={!currentQuantity}
                      variant="primary"
                      type="highlight"
                      fullWidth
                      onClick={() => setVisible(false)}
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
