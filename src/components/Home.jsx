import React, { useState, useEffect } from 'react';
import { useNavigate ,Link} from "react-router-dom";
import ApiBaseUrl from "../ApiBaseUrl";
import { toast } from "react-toastify";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(''); // State to store the search query
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [LoginStatus, setLoginStatus] = useState(false);

  // Fetch products from the API
  const fetchProducts = async (page = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const response = await ApiBaseUrl.get("/products", {
        params: {
          page,
          per_page: 12,
          search: searchQuery,  // Pass the search query as a parameter
        },
      });
      setProducts(response.data.products.data); // 'data' contains the products
      setTotalPages(response.data.products.last_page); // 'last_page' is the total number of pages
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when the component is mounted or the search query or page changes
  useEffect(() => {
    fetchProducts(currentPage, search);
    if (localStorage.getItem("token")) {
        setLoginStatus(true);
    }
  }, [currentPage, search]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };
   // Handle delete
   const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await ApiBaseUrl.delete(`/products/${productId}`);
        toast.success("Product deleted successfully");
        fetchProducts(); // Re-fetch the products after deletion
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error("Failed to delete product");
      }
    }
  };
   // Place Order
   const placeOrder = async (productId) => {
    if (LoginStatus) {
        const confirmPlaceOrder = window.confirm("Are you sure you want to Place this Order?");
        if (confirmPlaceOrder) {
            try {
                await ApiBaseUrl.post("/placeOrder", {productId:productId}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                toast.success("Order Place successfully");
            } catch (error) {
                console.error('Error Order Place:', error);
                toast.error("Order Place error");
            }
        }
    }else{
        toast.error("Before you place the order, please log in to your account."); 
    }
  };
  const styleObject = {
    "width" : "100%"
}
const productTitleStyle = {'textAlign':'center'}
  return (
    <div className="container">
                <div class="topnav">
                    <Link class="active" to={"/"}>Home</Link>
                    {
                    LoginStatus ? (<>
                        <Link to={"/dashboard"}>Dashboard</Link>
                    </>) :(<>
                        <Link to={"/login"}>Login Account</Link>
                        <Link to={"/register"}>Register New Account</Link>
                    </>)
                    }
                   
                    {/* <input type="text" placeholder="Search.."/> */}
                    <input
                        type="text"
                        placeholder="Search products"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
<h2 style={productTitleStyle}>All Product List</h2>


{loading && <p>Loading...</p>}
{!loading && products.length === 0 && <p>No products found.</p>}

        <div className='row'>
        <ul className="productList">
                    {products.map((product) => (
                            <li key={product.id}>
                                <h3 className="productTitle">{product.name}</h3>
                                <div class="card">
                                    <img src={product.imagesUrl} alt={product.name}  style={styleObject}/>
                                    <p class="price"><strong>Price:</strong> ${product.price}</p> 
                                    <p><button onClick={() => handleDelete(product.id)} >Delete</button> <button onClick={() => placeOrder(product.id)}  >Place Order</button></p>
                                </div>

                            </li>
                        ))}
                </ul>
        </div>
        <div className='row'>
                <div className="pagination">
                        <button
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        >
                        Previous
                        </button>
                        <span>{currentPage} of {totalPages}</span>
                        <button
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        >
                        Next
                        </button>
                </div>
            </div>
        </div>

  );
};

export default Home;
