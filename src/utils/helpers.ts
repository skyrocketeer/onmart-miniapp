import { API_URL } from "./constant";

/**
 * Combine and filter falsy css classes in CSS Modules
 */
const cx = (...args: any[]) => args.filter((arg) => !!arg).join(" ");

export default cx;

export async function generateMac(params: object, shippingData) {
  // Với dữ liệu muốn truyền vào API createOrder gồm: amount, desc, item, extradata, method
  // Dữ liệu extradata và method phải có kiểu dữ liệu JSON String
  // Dữ liệu item cần chuyển về kiểu dữ liệu String
  const dataMac = Object.keys(params)
    .sort() // sắp xếp key của Object data theo thứ tự từ điển tăng dần
    .map(
      (key) =>
        `${key}=${
          typeof params[key] === "object"
            ? JSON.stringify(params[key])
            : params[key]
        }`
    ) // trả về mảng dữ liệu dạng [{key=value}, ...]
    .join("&"); // chuyển về dạng string kèm theo "&", ví dụ: amount={amount}&desc={desc}&extradata={extradata}&item={item}&method={method}
  try {
    return fetch(`${API_URL}/payment/checkout`, { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderData: dataMac, shippingData })
    })
    .then(response => {
      if (!response.ok) {
        console.error('Error:', response);
        return ""
      }
      return response.text();
    })
    .then(data => {
      console.log('Data received:', data);
      return data["mac"]; // Return data for further processing
    })
    .catch(error => {
      console.error('Error:', error);
      return ""
    });
  } 
  catch (error) {
    console.error('Error:', error);
    return ""
  }
}

export function convertStringToNumber(price: string): number {
    // Remove any non-numeric characters except for dot (.) and minus (-)
    if(price === null || price.length == 0) return 0

    const numericString = price.replace(/[^0-9.-]/g, '');

    // Parse the numeric string to a float number
    const numericValue = parseFloat(numericString);

    if (isNaN(numericValue))
      return 0;
    return numericValue;
}

export function isDigit(value: string): boolean {
  // Regular expression to match only digits
  const regex = /^\d+$/;
  return regex.test(value);
}