"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartMeasurement = Record<string, string>;

export type CartItem = {
  cartItemId: string;
  productId: string;
  variantId?: string;

  name: string;
  variantName?: string;
  category: string;
  image?: string;

  price: number;
  stock?: number;

  gauge?: string;
  size?: string;
  finish?: string;

  customSize: boolean;
  measurements?: CartMeasurement;

  quantity: number;
};

type CartResponseItem = {
  id: string; productId: string; variantId: string | null; quantity: number;
  product?: { name?: string; category?: { name?: string }; images?: { url?: string }[]; image?: string | null };
  variant?: { name?: string; price?: number | string; stock?: number; gauge?: string | null; size?: string | null; finish?: string | null };
  customSize?: boolean; measurements?: CartMeasurement | null; imageUrl?: string | null;
};

type AddToCartItem = Omit<CartItem, "cartItemId"> & {
  replaceExisting?: boolean;
};

type CartContextType = {
  items: CartItem[];
  loggedIn: boolean;
  addItem: (item: AddToCartItem) => Promise<boolean>;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (
    cartItemId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  loading: boolean;
};

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);
    const [loggedIn, setLoggedIn] =
    useState(false);

  async function loadCart() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/cart",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

     if (response.status === 401) {
  setLoggedIn(false);
  setItems([]);
  return;
}

setLoggedIn(true);

      if (!response.ok) {
        throw new Error(
          "Unable to load cart."
        );
      }

      const data =
        await response.json();

      const databaseItems =
        (data.cart?.items ?? []) as CartResponseItem[];

      const mappedItems: CartItem[] =
        databaseItems.map(
          (item) => ({
            cartItemId: item.id,

            productId:
              item.productId,

            variantId:
              item.variantId ?? undefined,

            name:
              item.product?.name ??
              "Product",

            variantName:
              item.variant?.name ??
              undefined,

            category:
              item.product?.category?.name ??
              "",

            image:
  item.imageUrl ??
  item.product?.images?.[0]?.url ??
  item.product?.image ??
  undefined,

            price:
              Number(
                item.variant?.price ?? 0
              ),

            stock:
              Number(
                item.variant?.stock ?? 0
              ),

            gauge:
              item.variant?.gauge ??
              undefined,

            size:
              item.variant?.size ??
              undefined,

            finish:
              item.variant?.finish ??
              undefined,

            customSize:
              Boolean(
                item.customSize
              ),

            measurements:
              item.measurements ??
              undefined,

            quantity:
              Number(
                item.quantity
              ),
          })
        );

      setItems(mappedItems);
    } catch (error) {
      console.error(
        "CART LOAD ERROR:",
        error
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => { void loadCart(); }, 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  async function addItem(
    item: AddToCartItem
  ): Promise<boolean> {
    try {
      const response =
        await fetch(
          "/api/cart",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              productId:
                item.productId,

              variantId:
                item.variantId,

              quantity:
                item.quantity,

              customSize:
                item.customSize,

              measurements:
                item.customSize
                  ? item.measurements ??
                    {}
                  : null,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Unable to add item to cart."
        );
        return false;
      }

      await loadCart();
      return true;
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      alert(
        "Unable to add item to cart."
      );
      return false;
    }
  }

  async function removeItem(
    cartItemId: string
  ) {
    try {
      const response =
        await fetch(
          "/api/cart",
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              cartItemId,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Unable to remove item."
        );
        return;
      }

      setItems(
        (currentItems) =>
          currentItems.filter(
            (item) =>
              item.cartItemId !==
              cartItemId
          )
      );
    } catch (error) {
      console.error(
        "REMOVE CART ITEM ERROR:",
        error
      );

      alert(
        "Unable to remove item."
      );
    }
  }

  async function updateQuantity(
    cartItemId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    try {
      const response =
        await fetch(
          "/api/cart",
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              cartItemId,
              quantity,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Unable to update cart."
        );
        return;
      }

      setItems(
        (currentItems) =>
          currentItems.map(
            (item) =>
              item.cartItemId ===
              cartItemId
                ? {
                    ...item,
                    quantity:
                      Number(
                        data.item
                          ?.quantity ??
                          quantity
                      ),
                    stock:
                      Number(
                        data.item
                          ?.variant
                          ?.stock ??
                          item.stock ??
                          0
                      ),
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "UPDATE CART ERROR:",
        error
      );

      alert(
        "Unable to update cart."
      );
    }
  }

  async function clearCart() {
    try {
      const response =
        await fetch(
          "/api/cart",
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              clear: true,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Unable to clear cart."
        );
        return;
      }

      setItems([]);
    } catch (error) {
      console.error(
        "CLEAR CART ERROR:",
        error
      );

      alert(
        "Unable to clear cart."
      );
    }
  }

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.price *
            item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
  items,
  loggedIn,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  totalItems,
  subtotal,
  loading,
}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
