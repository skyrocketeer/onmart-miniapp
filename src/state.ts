import { atom, selector, selectorFamily } from "recoil";
import logo from "static/logo.png";
import subscriptionIcon from "static/subscription-decor.svg";
import { Cart } from "types/cart";
import { Category } from "types/category";
import { Store } from "types/delivery";
import { Notification } from "types/notification";
import { ShippingData } from "types/order";
import { Product } from "types/product";
import { wait } from "utils/async";
import { API_URL } from "utils/constant";
import { calculateDistance } from "utils/location";
import { calcFinalPrice } from "utils/price";
import { getLocation, getPhoneNumber, getUserInfo } from "zmp-sdk";

export const userState = selector({
  key: "user",
  get: async () => {
    let userData = {
      id: "",
      avatar: "",
      name: "Người dùng Zalo",
    }
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      userData = {...userInfo}
    } catch (error) {
      console.log(error);
    } finally {
      return userData
    }
  },
});

export const categoriesState = selector<Category[]>({
  key: "categories",
  get: async () => {
    const categoryData = await fetch(`${API_URL}/sheet?categories`)
      .then(response => response.json())
      .catch(error => {
        console.error(error);
        return [] as Category[]
      })
    return categoryData as Category[]
  }
});

export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {  
    // await wait(2000);
    // const products = (await import("../mock/products.json")).default;
    const products = await fetch(`${API_URL}/sheet?products`)
      .then((res) => {
        return res.json()
      })
      .catch((error) => {
        console.error(error);
        return [] as Product[]
      })
    // const variants = (
    //   await import("../mock/variants.json")
    // ).default as Variant[];
    return products.map(
      (product) =>
        ({
          // priceBefore: convertPriceToNumber(product.priceBefore),
          // priceSale: convertPriceToNumber(product.priceSale),
          ...product,
          // variants:
          //   product.variantId.includes(.id)
          // ),
        } as Product)
    );
  },
});

export const recommendProductsState = selector<Product[]>({
  key: "recommendProducts",
  get: ({ get }) => {
    const products = get(productsState);
    return products.filter((p) => p.priceSale);
  },
});

export const selectedCategoryIdState = atom({
  key: "selectedCategoryId",
  default: "coffee",
});

export const productsByCategoryState = selectorFamily<Product[], string>({
  key: "productsByCategory",
  get:
    (categoryId) =>
    ({ get }) => {
      const allProducts = get(productsState);
      return allProducts.filter((product) =>
        product.category.includes(categoryId)
      );
    },
});

export const cartState = atom<Cart>({
  key: "cart",
  default: [],
});

export const totalQuantityState = selector({
  key: "totalQuantity",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
});

export const totalPriceState = selector({
  key: "totalPrice",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce(
      (total, item) =>
        total + item.quantity * calcFinalPrice(item.product, item.options),
      0
    );
  },
});

export const notificationsState = atom<Notification[]>({
  key: "notifications",
  default: [
    {
      id: 1,
      image: logo,
      title: "Chào bạn mới",
      content:
        "Cảm ơn đã đến với onMart, bạn có thể dùng ứng dụng này để tiết kiệm thời gian đi chợ",
    },
    {
      id: 2,
      image: logo,
      title: "Giảm 50% lần đầu mua hàng",
      content: "Nhập WELCOME để được giảm 50% giá trị đơn hàng đầu tiên",
    },
    {
      id: 3,
      image: subscriptionIcon,
      title: "Đơn hàng sẽ được giao đến bạn trong vòng 3h",
      content: "Bạn đã thanh toán thành công đơn hàng",
    },
  ],
});

export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const resultState = selector<Product[]>({
  key: "result",
  get: async ({ get }) => {
    const keyword = get(keywordState);
    if (!keyword.trim()) {
      return [];
    }
    const products = get(productsState);
    await wait(500);
    return products.filter((product) =>
      product.name.trim().toLowerCase().includes(keyword.trim().toLowerCase())
    );
  },
});

export const storesState = atom<Store[]>({
  key: "stores",
  default: [
    {
      id: 1,
      name: "Vườn Hydroworks",
      address:
        "Quận 9, TPHCM",
      lat: 10.801657,
      long: 106.852870,
    },
    // {
    //   id: 2,
    //   name: "The Independence Palace",
    //   address:
    //     "135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
    //   lat: 10.779159,
    //   long: 106.695271,
    // },
    // {
    //   id: 3,
    //   name: "Saigon Notre-Dame Cathedral Basilica",
    //   address:
    //     "1 Công xã Paris, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
    //   lat: 10.779738,
    //   long: 106.699092,
    // },
    // {
    //   id: 4,
    //   name: "Bình Quới Tourist Village",
    //   address:
    //     "1147 Bình Quới, phường 28, Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam",
    //   lat: 10.831098,
    //   long: 106.733128,
    // },
    // {
    //   id: 5,
    //   name: "Củ Chi Tunnels",
    //   address: "Phú Hiệp, Củ Chi, Thành phố Hồ Chí Minh, Việt Nam",
    //   lat: 11.051655,
    //   long: 106.494249,
    // },
  ],
});

export const nearbyStoresState = selector({
  key: "nearbyStores",
  get: ({ get }) => {
    // Get the current location from the locationState atom
    const location = get(locationState);

    // Get the list of stores from the storesState atom
    const stores = get(storesState);

    // Calculate the distance of each store from the current location
    if (location) {
      const storesWithDistance = stores.map((store) => ({
        ...store,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          store.lat,
          store.long
        ),
      }));

      // Sort the stores by distance from the current location
      const nearbyStores = storesWithDistance.sort(
        (a, b) => a.distance - b.distance
      );

      return nearbyStores;
    }
    return [];
  },
});

export const selectedStoreIndexState = atom({
  key: "selectedStoreIndex",
  default: 0,
});

export const selectedStoreState = selector({
  key: "selectedStore",
  get: ({ get }) => {
    const index = get(selectedStoreIndexState);
    const stores = get(nearbyStoresState);
    return stores[index];
  },
});

export const requestLocationTriesState = atom({
  key: "requestLocationTries",
  default: 0,
});

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const locationState = selector<
  { latitude: string; longitude: string }
>({
  key: "location",
  get: async ({ get }) => {
    const requested = get(requestLocationTriesState);
    if (requested) {
      const { latitude, longitude, token } = await getLocation({
        fail: console.warn,
      });
      if (latitude && longitude) {
        return { latitude, longitude };
      }
      if (token) {
        console.warn(
          "Sử dụng token này để truy xuất vị trí chính xác của người dùng",
          token
        );
        console.warn(
          "Chi tiết tham khảo: ",
          "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
        );
        console.warn("Giả lập vị trí mặc định: VNG Campus");
        return {
          latitude: "10.7287",
          longitude: "106.7317",
        };
      }
    }
    return {
      latitude: "10.7287",
      longitude: "106.7317",
    };
  },
});

export const phoneState = selector<string>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      const { number, token } = await getPhoneNumber({ fail: console.warn });
      if (number) {
        return number;
      }
      console.warn(
        "Sử dụng token này để truy xuất số điện thoại của người dùng",
        token
      );
      console.warn(
        "Chi tiết tham khảo: ",
        "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
      );
      console.warn("Giả lập số điện thoại mặc định:");
      return "";
    }
    return "";
  },
});

export const defaultShippingState = {
  clientName: "",
  phoneNumber: "",
  shippingTime: new Date().getTime(),
  shippingAddressCoord: {
    latitude: 0,
    longitude: 0,
  },
  shippingAddressText: "",
  note: "",
  shippingFee: 20000
}

export const shippingInfoState = atom<ShippingData>({
  key: "shippingInfo",
  default: defaultShippingState,
})