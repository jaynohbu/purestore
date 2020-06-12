import { FETCH_PRODUCTS , CHECKOUT_PRODUCTS} from './actionTypes';
import axios from 'axios';
import uuid from 'react-uuid';

import {
  productsAPI,
  checkoutAPI,
  sshUrl
} from '../util';

const compare = {
  lowestprice: (a, b) => {
    if (a.price < b.price) return -1;
    if (a.price > b.price) return 1;
    return 0;
  },
  highestprice: (a, b) => {
    if (a.price > b.price) return -1;
    if (a.price < b.price) return 1;
    return 0;
  }
};

export const fetchProducts = (filters, sortBy, callback) => dispatch => {
  return axios
    .get(productsAPI)
    .then(res => {
      let { products } = res.data;

      if (!!filters && filters.length > 0) {
        products = products.filter(p =>
          filters.find(f => p.availableSizes.find(size => size === f))
        );
      }

      if (!!sortBy) {
        products = products.sort(compare[sortBy]);
      }

      if (!!callback) {
        callback();
      }
      console.log(products)
      return dispatch({
        type: FETCH_PRODUCTS,
        payload: products
      });
    })
    .catch(err => {
      console.log('Could not fetch products. Try again later.');
    });
};

export const checkoutProducts = (products, callback) => dispatch => {
      let uid=uuid();
   
      return axios.post(checkoutAPI, {
          items: products,
          key: uid
        }).then((response)=>{
            console.log('👉 Returned data:', response);
             if (!!callback) {
              window.location.href = sshUrl + uid;
             }
             return dispatch({
               type: CHECKOUT_PRODUCTS,
               payload: products
             });
        }).catch( (e)=> {
        console.log(`😱 Axios request failed: ${e}`);
      });
     

};