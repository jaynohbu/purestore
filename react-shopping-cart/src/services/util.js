export const formatPrice = (x, currency) => {
  switch (currency) {
    case 'BRL':
      return x.toFixed(2).replace('.', ',');
    default:
      return x.toFixed(2);
  }
};

//export const productsAPI ='https://react-shopping-cart-67954.firebaseio.com/products.json';
 export const productsAPI = "http://34.217.107.94:8001/api/products";
 export const checkoutAPI = "http://34.217.107.94:8001/api/checkout";
 export const sshUrl = "https://d2o4e53f6nsvlw.cloudfront.net/checkout/";

  // export const productsAPI = "https://localhost:8001/api/products";
  // export const checkoutAPI = "https://localhost:8001/api/checkout";
  // export const sshUrl = "https://d2o4e53f6nsvlw.cloudfront.net/checkout/";
