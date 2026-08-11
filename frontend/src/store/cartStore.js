import { create } from "zustand";
import { persist } from "zustand/middleware";
const compareSize = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
const useCartStore = create(
  persist(
    (set) => ({
      /*
====================
PRODUCTS
====================
*/

      cart: [],

      /*
====================
COUPON SYSTEM
====================
*/

      coupon: null,

      discount: 0,

      finalTotal: null,

      /*
====================
ADD PRODUCT
====================
*/

      addToCart: (product) =>
        set((state) => {
          const exists = state.cart.find(
            (item) =>
              item.id === product.id &&
              compareSize(item.size, product.size) &&
              item.color === product.color,
          );

          if (exists) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id &&
                compareSize(item.size, product.size) &&
                item.color === product.color
                  ? {
                      ...item,

                      quantity: item.quantity + product.quantity,
                    }
                  : item,
              ),
            };
          }

          return {
            cart: [...state.cart, product],
          };
        }),

      /*
====================
INCREASE
====================
*/

      increase: (id, size, color) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id &&
            compareSize(item.size, size) &&
            item.color === color
              ? {
                  ...item,

                  quantity: item.quantity + 1,
                }
              : item,
          ),

          // إلغاء الكوبون عند تغيير السلة

          coupon: null,

          discount: 0,

          finalTotal: null,
        })),

      /*
====================
DECREASE
====================
*/
      decrease: (id, size, color) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id &&
            compareSize(item.size, size) &&
            item.color === color &&
            item.quantity > 1
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item,
          ),

          coupon: null,
          discount: 0,
          finalTotal: null,
        })),
      /*
====================
REMOVE PRODUCT
====================
*/

      remove: (id, size, color) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.id === id &&
                compareSize(item.size, size) &&
                item.color === color
              ),
          ),

          coupon: null,

          discount: 0,

          finalTotal: null,
        })),

      /*
====================
APPLY COUPON
====================
*/

      setCoupon: (couponData) =>
        set({
          coupon: couponData,

          discount: Number(couponData.discount),

          finalTotal: Number(couponData.finalTotal),
        }),

      /*
====================
REMOVE COUPON
====================
*/

      clearCoupon: () =>
        set({
          coupon: null,

          discount: 0,

          finalTotal: null,
        }),

      /*
====================
CLEAR AFTER ORDER
====================
*/

      clearCart: () =>
        set({
          cart: [],

          coupon: null,

          discount: 0,

          finalTotal: null,
        }),
    }),

    {
      name: "stylehub-cart",
    },
  ),
);

export default useCartStore;
