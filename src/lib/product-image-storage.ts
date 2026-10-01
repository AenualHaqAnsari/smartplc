import path from "path";

/** Root directory for uploaded product image files (one subdirectory per product). */
export function getProductImageStorageRoot() {
  const configuredRoot = process.env.PRODUCT_UPLOAD_DIR?.trim();
  return configuredRoot
    ? path.resolve(configuredRoot)
    : path.join(process.cwd(), "data", "uploads", "products");
}

