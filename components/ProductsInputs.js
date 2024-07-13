import React from "react";

const ProductsInputs = ({ form, setForm }) => {
  const { products } = form;

  const changeHandler = (e, i) => {
    const { name, value } = e.target;

    const newProducts = products.map((product, index) => {
      if (index === i) product[name] = value;

      return product;
    });

    setForm((form) => ({ ...form, products: newProducts }));
  };

  const addProductHandler = () => {
    setForm((form) => ({
      ...form,
      products: [...products, { productName: "", price: "", qty: "" }],
    }));
  };

  const removeHandler = (i) => {
    const newProducts = products.filter((product, index) => index !== i);

    setForm((form) => ({ ...form, products: newProducts }));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Products</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-1/3">
              <label htmlFor={`productName-${index}`} className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={product.productName}
                name="productName"
                onChange={(e) => changeHandler(e, index)}
                id={`productName-${index}`}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="w-1/4">
              <label htmlFor={`price-${index}`} className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={product.price}
                name="price"
                onChange={(e) => changeHandler(e, index)}
                id={`price-${index}`}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="w-1/4">
              <label htmlFor={`qty-${index}`} className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={product.qty}
                name="qty"
                onChange={(e) => changeHandler(e, index)}
                id={`qty-${index}`}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => removeHandler(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={addProductHandler}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductsInputs;
