import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [module, setModule] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "",
    isActive: false,
    description: "",
  });

  // GET
  const getAllProducts = async () => {
    await axios.get("http://localhost:5000/products").then((res) => {
      setProducts(res.data);
      setFilteredProducts(res.data);
    });
  };

  useEffect(() => {
    getAllProducts();
  }, []);



  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      await axios.delete(`http://localhost:5000/products/${id}`).then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      });
    }
  };

  const handleAdd = () => {
    setNewProduct({
      name: "",
      price: "",
      oldPrice: "",
      category: "Vegetables",
      isActive: false,
      description: "",
    });
    setModule(true);
  };

  const closeModule = () => {
    setModule(false);
    getAllProducts(); 
  };

  const handleData = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({...newProduct,  [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newProduct.id) {
      await axios
        .patch(`http://localhost:5000/products/${newProduct.id}`, newProduct)
        .then((res) => console.log(res));
    } else {
      await axios.post(`http://localhost:5000/products/`, newProduct).then((res) => console.log(res));
    }
    closeModule();
  };

  const handleUpdatedRecord = (product) => {
    setNewProduct(product);
    setModule(true);
  };

  return (
    <>
      <div className="container">
        <div className="input-search">
          <h1>Grocery Store Product Manager APP</h1>
          <button type="button" className="btn1 green" onClick={handleAdd}>
            ADD
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Old Price</th>
              <th>Category</th>
              <th>Is Available</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts &&
              filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.oldPrice}</td>
                  <td>{product.category}</td>
                  <td>{product.isActive ? "Yes" : "No"}</td>
                  <td>{product.description}</td>
                  <td>
                    <button type="button" className="btn green" onClick={() => handleUpdatedRecord(product)} > Edit  </button>
                    <button type="button" className="btn red"  onClick={() => handleDelete(product.id)}>  Delete </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {module && (
          <div className="module">
            <div className="module-content">
              <span className="close" onClick={closeModule}>
                &times;
              </span>
              <h2>{newProduct.id ? "Update Product" : "Add New Product"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    name="name"
                    id="name"
                    onChange={handleData}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    name="price"
                    id="price"
                    onChange={handleData}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="oldPrice">Old Price</label>
                  <input
                    type="number"
                    value={newProduct.oldPrice}
                    name="oldPrice"
                    id="oldPrice"
                    onChange={handleData}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="category">Category</label>
                  <select name="category" value={newProduct.category}  onChange={handleData} >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits & Nuts">Fruits & Nuts</option>
                    <option value="Dairy & Creams">Dairy & Creams</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Staples">Staples</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="isActive">Is Available</label>
                  <input
                    type="checkbox"
                    checked={newProduct.isActive}
                    name="isActive"
                    id="isActive"
                    onChange={handleData}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleData}
                    required
                  />
                </div>
                <button type="submit" className="btn green">
                  Confirm
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
