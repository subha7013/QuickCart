import React, { useEffect, useMemo, useState } from 'react';

const BASE_URL = 'https://quickcart-39cz.onrender.com';

const categoryMap = {
    'Electronics': ['Mobile', 'Headset', 'Accessories', 'Speakers'],
    'Fashion': ['Tshirts', 'Jeans', 'Shoes'],
    'Groceries': ['Vegetables', 'Fruits', 'Chocolates', 'Non Veg', 'Dairy', 'Ready to eat', 'Oil & Ghee', 'Snacks', 'Biscuits'],
};
const categories = [
    {
        name: 'Electronics',
        icon: '📱',
        description: 'Chargers, earbuds, headsets and smart accessories.',
        subcategories: ['Mobile', 'Headset', 'Accessories', 'Speakers'],
        products: [
            { id: 'c1', name: 'Dual Port Adapter', price: 199, image: '/assets/charger1.jpg', subcategory: 'Accessories', stock: 10 },
            { id: 'c2', name: 'Samsung Adapter', price: 249, image: '/assets/charger2.jpg', subcategory: 'Accessories', stock: 5 },
            { id: 'c3', name: 'Apple Adapter', price: 1499, image: '/assets/charger3.jpg', subcategory: 'Accessories', stock: 3 },
            { id: 'e1', name: 'Realme buds Q', price: 1999, image: '/assets/earbuds1.jpg', subcategory: 'Headset', stock: 8 },
            { id: 'e2', name: 'Boult earbuds', price: 899, image: '/assets/earbuds2.jpg', subcategory: 'Headset', stock: 15 },
            { id: 'e3', name: "earbuds", price: 1299, image: '/assets/earbuds3.jpg', subcategory: 'Headset', stock: 12 },
            { id: 'h1', name: 'Headset', price: 2599, image: '/assets/headset1.jpg', subcategory: 'Headset', stock: 10 },
            { id: 'h2', name: 'Headset', price: 7999, image: '/assets/headset2.jpg', subcategory: 'Headset', stock: 5 },
        ],
    },
    {
        name: 'Fashion',
        icon: '👕',
        description: 'T-shirts, shoes and everyday style essentials.',
        subcategories: ['Tshirts', 'Jeans', 'Shoes'],
        products: [
            { id: 'fashion1', name: 'Roadster Tshirt', price: 599, image: '/assets/Tshirts1.jpg', subcategory: 'Tshirts', stock: 20 },
            { id: 'fashion2', name: 'campus Running Shoes', price: 1499, image: '/assets/Shoes1.jpg', subcategory: 'Shoes', stock: 10 },
        ],
    },
    {
        name: 'Groceries',
        icon: '🛒',
        description: 'Fresh picks and daily household staples.',
        subcategories: ['Vegetables', 'Fruits', 'Chocolates', 'Non Veg', 'Dairy', 'Ready to eat', 'Oil & Ghee', 'Snacks', 'Biscuits'],
        products: [
            { id: 'grocery1', name: 'Fresh Potato (1000 g.)', price: 20, image: '/assets/potato.jpg', subcategory: 'Vegetables', stock: 50 },
            { id: 'grocery2', name: 'Organic Tomato (500 g.)', price: 30, image: '/assets/tomato.jpg', subcategory: 'Vegetables', stock: 30 },
            { id: 'grocery3', name: 'Organic Tomato (1000 g.)', price: 50, image: '/assets/tomato.jpg', subcategory: 'Vegetables', stock: 20 },
            { id: 'grocery4', name: 'Organic Parwal (500 g.)', price: 30, image: '/assets/parwal.jpg', subcategory: 'Vegetables', stock: 25 },
            { id: 'grocery5', name: 'Pumpkin (500 g.)', price: 30, image: '/assets/pumpkin.jpg', subcategory: 'Vegetables', stock: 20 },
            { id: 'grocery6', name: 'Organic Green Chilli (100 g.)', price: 10, image: '/assets/chilli1.jpg', subcategory: 'Vegetables', stock: 30 },
            { id: 'grocery7', name: 'Bullet Chilli (100 g.)', price: 15, image: '/assets/chilli2.jpg', subcategory: 'Vegetables', stock: 25 },
            { id: 'grocery8', name: 'Ginger (200 g.)', price: 40, image: '/assets/ginger.jpg', subcategory: 'Vegetables', stock: 20 },
            { id: 'grocery9', name: 'Garlic (100 g.)', price: 20, image: '/assets/garlic.jpg', subcategory: 'Vegetables', stock: 10 },
            { id: 'grocery10', name: 'Brinjal (500 g.)', price: 30, image: '/assets/brinjal.jpg', subcategory: 'Vegetables', stock: 25 },
            { id: 'fruits1', name: 'Daily Fresh Banana (500 g.)', price: 30, image: '/assets/banana.jpg', subcategory: 'Fruits', stock: 30 },
            { id: 'fruits2', name: 'Apple (250 g.)', price: 40, image: '/assets/apple.jpg', subcategory: 'Fruits', stock: 20 },
            { id: 'fruits3', name: 'Mango (500 g.)', price: 50, image: '/assets/mango.jpg', subcategory: 'Fruits', stock: 25 },
        ],
    },
];

function App() {
    const [currentView, setCurrentView] = useState('home');
    const [selectedCategoryName, setSelectedCategoryName] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [dbProducts, setDbProducts] = useState([]);

    const categoryList = useMemo(() => {
        const base = [
            {
                name: 'Electronics',
                icon: '📱',
                description: 'Chargers, earbuds, headsets and smart accessories.',
                subcategories: ['Mobile', 'Headset', 'Accessories', 'Speakers'],
                products: []
            },
            {
                name: 'Fashion',
                icon: '👕',
                description: 'T-shirts, shoes and everyday style essentials.',
                subcategories: ['Tshirts', 'Jeans', 'Shoes'],
                products: []
            },
            {
                name: 'Groceries',
                icon: '🛒',
                description: 'Fresh picks and daily household staples.',
                subcategories: ['Vegetables', 'Fruits', 'Chocolates', 'Non Veg', 'Dairy', 'Ready to eat', 'Oil & Ghee', 'Snacks', 'Biscuits'],
                products: []
            }
        ];

        // Use database products if loaded, fallback to static products
        const productsSource = dbProducts.length > 0
            ? dbProducts
            : categories.flatMap(cat => cat.products.map(p => ({ ...p, category: cat.name })));

        productsSource.forEach(p => {
            const cat = base.find(c => c.name.toLowerCase() === p.category?.toLowerCase());
            if (cat) {
                if (p.subcategory && !cat.subcategories.includes(p.subcategory)) {
                    cat.subcategories.push(p.subcategory);
                }
                if (!cat.products.some(prod => prod.id === p.id)) {
                    cat.products.push(p);
                }
            }
        });

        return base;
    }, [dbProducts]);

    const selectedCategory = useMemo(() => {
        return categoryList.find(c => c.name === selectedCategoryName) || null;
    }, [categoryList, selectedCategoryName]);
    const [productStock, setProductStock] = useState({}); // { productId: stockNumber }
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminKey, setAdminKey] = useState('');
    const [adminKeyInput, setAdminKeyInput] = useState('');
    const [adminProducts, setAdminProducts] = useState([]);
    const [adminStockEdits, setAdminStockEdits] = useState({}); // { productId: newStock }
    const [adminSaving, setAdminSaving] = useState({});
    const [adminTab, setAdminTab] = useState('inventory'); // 'inventory' | 'add'
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', category: '', subcategory: '', stock: '', image: ''
    });
    const [wishlist, setWishlist] = useState([]);
    const [toast, setToast] = useState('');
    const [authMode, setAuthMode] = useState('login');
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [signupForm, setSignupForm] = useState({ email: '', phone: '', password: '', confirmPassword: '' });
    const [profilePhone, setProfilePhone] = useState('');
    const [passwordFormVisible, setPasswordFormVisible] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
    const [orders, setOrders] = useState([]);
    const [showBanner, setShowBanner] = useState(true);
    const [profileTab, setProfileTab] = useState('overview');
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);        // rupee amount saved
    const [couponDiscountPercent, setCouponDiscountPercent] = useState(0); // % for display
    const [couponRecommendations, setCouponRecommendations] = useState([]);
    const [isFetchingRecs, setIsFetchingRecs] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        name: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        lat: null,
        lng: null,
    });
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [mapError, setMapError] = useState('');
    const [mapLoaded, setMapLoaded] = useState(false);
    const [addressPreview, setAddressPreview] = useState('Tap on the map or use current location to choose delivery address.');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    const mapRef = React.useRef(null);
    const mapInstanceRef = React.useRef(null);
    const markerRef = React.useRef(null);
    const searchInputRef = React.useRef(null);
    const autocompleteRef = React.useRef(null);
    const [hideMobileTopNav, setHideMobileTopNav] = useState(false);
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        fetchMe();
        fetchProductStock();
    }, []);

    // Auto-fetch coupon recommendations whenever cart changes (debounced)
    useEffect(() => {
        if (!currentUser) { setCouponRecommendations([]); return; }
        const timer = setTimeout(() => {
            const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
            fetchCouponRecommendations(subtotal);
        }, 400);
        return () => clearTimeout(timer);
    }, [cart, currentUser]);

    useEffect(() => {
        if (toast) {
            const timer = window.setTimeout(() => setToast(''), 2200);
            return () => window.clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        if (currentUser) {
            loadOrders();
        }
    }, [currentUser]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth > 768) return;
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
                setHideMobileTopNav(true);
            } else {
                setHideMobileTopNav(false);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    async function api(path, options = {}) {
        try {
            const res = await fetch(BASE_URL + path, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                ...options,
            });
            return res.json();
        } catch (error) {
            console.error('API request failed:', error);
            return { ok: false, msg: 'Network error' };
        }
    }

    async function fetchMe() {
        const res = await api('/api/me');
        if (res.ok && res.email) {
            setCurrentUser({ email: res.email, phone: res.phone || '' });
            setProfilePhone(res.phone || '');
        } else {
            setCurrentUser(null);
        }
    }

    async function loadOrders() {
        const res = await api('/api/orders');
        if (res.ok && res.orders) {
            setOrders(res.orders);
        }
    }

    async function fetchProductStock() {
        try {
            const res = await api('/api/products');
            if (res.ok && res.products) {
                setDbProducts(res.products);
                const map = {};
                res.products.forEach(p => { map[p.id] = p.stock; });
                setProductStock(map);
            }
        } catch (e) {
            // silently fall back to static stock values
        }
    }

    // Returns live stock for a product, falling back to its static stock field
    function getStock(product) {
        if (product.id && productStock[product.id] !== undefined) {
            return productStock[product.id];
        }
        return product.stock ?? 0;
    }

    async function fetchCouponRecommendations(subtotal) {
        if (!currentUser) return;
        setIsFetchingRecs(true);
        try {
            const res = await api(`/api/coupon/recommendations?subtotal=${subtotal || 0}`);
            if (res.ok) setCouponRecommendations(res.recommendations || []);
        } catch (_) { /* silent */ }
        setIsFetchingRecs(false);
    }

    function showToast(message) {
        setToast(message);
    }

    async function unlockAdmin() {
        const key = adminKeyInput.trim();
        if (!key) { showToast('Enter the admin key'); return; }
        // Verify key by hitting a protected admin endpoint
        const res = await fetch(BASE_URL + '/api/admin/products', {
            headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
            credentials: 'include',
        });
        const data = await res.json();
        if (data.ok) {
            setAdminKey(key);
            setIsAdmin(true);
            setAdminProducts(data.products || []);
            const edits = {};
            (data.products || []).forEach(p => { edits[p.id] = p.stock; });
            setAdminStockEdits(edits);
            showToast('Admin access granted ✅');
        } else {
            showToast('Invalid admin key ❌');
        }
    }

    async function loadAdminProducts() {
        const res = await fetch(BASE_URL + '/api/admin/products', {
            headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
            credentials: 'include',
        });
        const data = await res.json();
        if (data.ok) {
            setAdminProducts(data.products || []);
            const edits = {};
            (data.products || []).forEach(p => { edits[p.id] = p.stock; });
            setAdminStockEdits(edits);
        }
    }

    async function saveAdminStock(productId) {
        const newStock = Number(adminStockEdits[productId]);
        if (isNaN(newStock) || newStock < 0) { showToast('Invalid stock value'); return; }
        setAdminSaving(prev => ({ ...prev, [productId]: true }));
        const res = await fetch(BASE_URL + `/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
            credentials: 'include',
            body: JSON.stringify({ stock: newStock }),
        });
        const data = await res.json();
        setAdminSaving(prev => ({ ...prev, [productId]: false }));
        if (data.ok) {
            showToast(`Stock updated for "${data.product.name}" ✅`);
            // Refresh local stock map
            setProductStock(prev => ({ ...prev, [productId]: newStock }));
            setAdminProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
        } else {
            showToast(data.msg || 'Failed to update stock ❌');
        }
    }
    async function deleteProduct(productId) {
        if (!window.confirm('Are you sure you want to remove this product from inventory?')) return;
        setAdminSaving(prev => ({ ...prev, [productId]: true }));
        try {
            const res = await fetch(BASE_URL + `/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                credentials: 'include',
            });
            const data = await res.json();
            if (data.ok) {
                showToast('Product removed successfully ✅');
                await loadAdminProducts();
                await fetchProductStock();
            } else {
                showToast(data.msg || 'Failed to remove product ❌');
            }
        } catch (_) {
            showToast('Network error ❌');
        }
        setAdminSaving(prev => ({ ...prev, [productId]: false }));
    }

    async function addProduct() {
        const { name, price, category, subcategory, stock, image } = newProduct;
        if (!name.trim() || !price || !category.trim()) {
            showToast('Name, price and category are required');
            return;
        }
        setIsAddingProduct(true);
        const res = await fetch(BASE_URL + '/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
            credentials: 'include',
            body: JSON.stringify({ name: name.trim(), price: Number(price), category: category.trim(), subcategory: subcategory.trim(), stock: Number(stock) || 0, image }),
        });
        const data = await res.json();
        setIsAddingProduct(false);
        if (data.ok) {
            showToast(`✅ "${data.product.name}" added to inventory!`);
            setNewProduct({ name: '', price: '', category: '', subcategory: '', stock: '', image: '' });
            // Reload products list and stock map
            await loadAdminProducts();
            await fetchProductStock();
            setAdminTab('inventory');
        } else {
            showToast(data.msg || 'Failed to add product ❌');
        }
    }

    function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) { showToast('Please drop a valid image file'); return; }
        if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2 MB'); return; }
        const reader = new FileReader();
        reader.onload = (e) => setNewProduct(prev => ({ ...prev, image: e.target.result }));
        reader.readAsDataURL(file);
    }

    function viewOrderDetails(order) {
        setSelectedOrder(order);
        setCurrentView('orderDetails');
    }

    function backToOrders() {
        setSelectedOrder(null);
        setCurrentView('orders');
    }

    async function handleLogin(e) {
        e.preventDefault();
        const res = await api('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
        });

        if (res.ok) {
            showToast('Login successful ✅');
            await fetchMe();
            setCurrentView('profile');
        } else {
            showToast('Invalid credentials ❌');
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        if (signupForm.password !== signupForm.confirmPassword) {
            showToast('Passwords do not match ❌');
            return;
        }

        const res = await api('/api/register', {
            method: 'POST',
            body: JSON.stringify({ email: signupForm.email, phone: signupForm.phone, password: signupForm.password }),
        });

        if (res.ok) {
            showToast('Account created ✅');
            await fetchMe();
            setCurrentView('profile');
        } else {
            showToast(res.msg || 'Signup failed ❌');
        }
    }

    async function logoutUser() {
        await api('/api/auth/logout', { method: 'POST' });
        setCurrentUser(null);
        setOrders([]);
        showToast('Logged out');
        setCurrentView('profile');
    }

    async function saveProfileChanges() {
        const res = await api('/api/user/update', {
            method: 'POST',
            body: JSON.stringify({ phone: profilePhone }),
        });

        if (res.ok) {
            showToast('Profile updated ✅');
            setCurrentUser((prev) => prev ? { ...prev, phone: profilePhone } : prev);
        } else {
            showToast(res.msg || 'Failed to update profile ❌');
        }
    }

    async function changeUserPassword() {
        if (!passwordForm.newPassword) {
            showToast('Password cannot be empty ❌');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showToast('Passwords do not match ❌');
            return;
        }

        const res = await api('/api/user/update', {
            method: 'POST',
            body: JSON.stringify({ password: passwordForm.newPassword }),
        });

        if (res.ok) {
            showToast('Password changed ✅');
            setPasswordForm({ newPassword: '', confirmPassword: '' });
            setPasswordFormVisible(false);
        } else {
            showToast(res.msg || 'Failed to change password ❌');
        }
    }

    function addToWishlist(product) {
        if (!wishlist.some((item) => item.id === product.id)) {
            setWishlist((prev) => [...prev, product]);
        }
        showToast(`${product.name} added to wishlist ❤️`);
    }

    function removeFromWishlist(id) {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
        showToast('Removed from wishlist');
    }

    function clearWishlist() {
        setWishlist([]);
        showToast('Wishlist cleared');
    }

    function addToCartFromWishlist(product) {
        increaseCart(product);
        showToast(`${product.name} moved to cart 🛒`);
    }

    function increaseCart(product) {
        const liveStock = getStock(product);
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                if (existing.qty >= liveStock) {
                    showToast(`Only ${liveStock} unit(s) of "${product.name}" available`);
                    return prev;
                }

                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }

            if (liveStock === 0) {
                showToast(`"${product.name}" is out of stock`);
                return prev;
            }

            return [...prev, { ...product, qty: 1 }];
        });
        showToast(`${product.name} added to cart ✅`);
    }
    function decreaseCart(id) {
        setCart((prev) => {
            const next = prev.map((item) => item.id === id ? { ...item, qty: item.qty - 1 } : item).filter((item) => item.qty > 0);
            return next;
        });
    }
    function calculateDeliveryFee(subtotal) {
        if (subtotal >= 199) return 0;
        if (subtotal >= 100) return 20;
        return 40;
    }



    function createPaymentOrder(items, total) {
        setCheckoutData({
            items,
            subtotal: total,
            total,
            couponCode: appliedCoupon,
            couponDiscount,
            address: shippingAddress,
        });
        setPaymentMethod('cod');
        setUpiId('');
        setPaymentSuccess(false);
        setCurrentView('checkout');
    }

    async function applyCoupon() {
        const code = couponCode.trim().toUpperCase();
        if (!code) {
            setAppliedCoupon('');
            setCouponDiscount(0);
            setCouponDiscountPercent(0);
            showToast('Coupon removed');
            return;
        }

        if (!currentUser) {
            showToast('Please login to apply coupons');
            return;
        }

        // Calculate current cart subtotal to send for minOrderVal check
        const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        const res = await api('/api/coupon/validate', {
            method: 'POST',
            body: JSON.stringify({
                code: couponCode,
                subtotal: cartSubtotal,
            })
        });

        if (res.ok) {
            setAppliedCoupon(code);
            setCouponDiscount(res.discount);           // rupee amount from server
            setCouponDiscountPercent(res.discountPercent); // % for display
            showToast(`Coupon ${code} applied — you save ₹${res.discount}!`);
            // Refresh recs so applied coupon chip updates
            const cartSubtotal2 = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
            fetchCouponRecommendations(cartSubtotal2);
        } else {
            setAppliedCoupon('');
            setCouponDiscount(0);
            setCouponDiscountPercent(0);
            showToast(res.msg || 'Invalid coupon');
        }
    }

    function buyNow(product) {
        if (!currentUser) {
            showToast('Please login first to buy ✅');
            setCurrentView('profile');
            return;
        }
        const liveStock = getStock(product);
        if (liveStock === 0) {
            showToast(`"${product.name}" is out of stock`);
            return;
        }
        createPaymentOrder([{ id: product.id, name: product.name, image: product.image, price: product.price, qty: 1, category: product.category, subcategory: product.subcategory }], product.price);
    }

    function placeOrder() {
        if (!currentUser) {
            showToast('Please login first to continue');
            setCurrentView('profile');
            return;
        }
        if (cart.length === 0) {
            showToast('Cart is empty');
            return;
        }
        // Validate each cart item against live stock
        for (const item of cart) {
            const liveStock = getStock(item);
            if (liveStock === 0) {
                showToast(`"${item.name}" is now out of stock. Please remove it from your cart.`);
                return;
            }
            if (item.qty > liveStock) {
                showToast(`Only ${liveStock} unit(s) of "${item.name}" available. Please reduce the quantity.`);
                return;
            }
        }
        const items = cart.map((item) => ({ id: item.id, name: item.name, image: item.image, price: item.price, qty: item.qty, category: item.category, subcategory: item.subcategory }));
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        createPaymentOrder(items, total);
    }

    async function handleConfirmPayment() {
        if (!checkoutData) {
            showToast('Nothing to checkout');
            return;
        }
        if (paymentMethod === 'upi' && !upiId.trim()) {
            showToast('Enter a valid UPI ID to continue');
            return;
        }
        if (!shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            showToast('Complete the shipping address before placing order');
            return;
        }

        const subtotal = checkoutData.items.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );

        // couponDiscount is already a rupee amount from the server
        const discountAmount = couponDiscount || 0;

        // Calculate delivery fee
        const deliveryFee = calculateDeliveryFee(subtotal);

        // Final payable amount
        const finalTotal = subtotal - discountAmount + deliveryFee;

        setIsPaymentProcessing(true);
        const res = await api('/api/checkout', {
            method: 'POST',
            body: JSON.stringify({
                items: checkoutData.items,
                subtotal,
                deliveryFee,
                total: finalTotal,
                couponCode: appliedCoupon,
                couponDiscount,
                paymentMethod,
                upiId: paymentMethod === 'upi' ? upiId.trim() : undefined,
                address: shippingAddress,
            }),
        });
        setIsPaymentProcessing(false);

        if (res.ok) {
            showToast('Order placed 🎉');
            setCart([]);
            setCouponCode('');
            setAppliedCoupon('');
            setCouponDiscount(0);
            setCouponDiscountPercent(0);
            // Refresh stock from server after order
            await fetchProductStock();
            await loadOrders();
            setPaymentSuccess(true);
            setTimeout(() => {
                setPaymentSuccess(false);
                setCheckoutData(null);
                setCurrentView('orders');
            }, 1400);
        } else {
            showToast(res.msg || 'Checkout failed ❌');
        }
    }

    function loadGoogleMapsScript() {
        if (!GOOGLE_MAPS_API_KEY) {
            setMapError('Google Maps API key is missing.');
            return;
        }

        if (window.google && window.google.maps) {
            setMapLoaded(true);
            return;
        }

        if (document.getElementById('google-maps-script')) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapLoaded(true);
        script.onerror = () => setMapError('Google Maps failed to load.');
        document.body.appendChild(script);
    }

    function formatAddressPreview(address) {
        if (!address || !address.line1) return 'Tap on the map or use current location to choose delivery address.';
        const parts = [address.line1, address.line2, address.city, address.state, address.pincode, address.country].filter(Boolean);
        return parts.join(', ');
    }

    function updateMapAddress(address, position) {
        setShippingAddress((prev) => ({
            ...prev,
            ...address,
            lat: position?.lat || prev.lat,
            lng: position?.lng || prev.lng,
        }));
        setSelectedPosition(position || null);
        setAddressPreview(formatAddressPreview({ ...shippingAddress, ...address }));
    }

    async function reverseGeocodePosition(lat, lng) {
        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
            console.error('Google Maps geocoder not available');
            return { address: null, status: 'Geocoder unavailable' };
        }

        const geocoder = new window.google.maps.Geocoder();
        return new Promise((resolve) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status !== 'OK' || !results?.length) {
                    console.error('Geocoder failed:', status, results);
                    resolve({ address: null, status: status || 'NO_RESULTS' });
                    return;
                }

                const address = results[0];
                const components = address.address_components;
                const newAddress = {
                    name: shippingAddress.name || '',
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India',
                };

                for (const component of components) {
                    const types = component.types;
                    if (types.includes('street_number')) {
                        newAddress.line1 = `${component.long_name} ${newAddress.line1}`.trim();
                    }
                    if (types.includes('route')) {
                        newAddress.line1 = `${newAddress.line1} ${component.long_name}`.trim();
                    }
                    if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('neighborhood')) {
                        if (!newAddress.line2) newAddress.line2 = component.long_name;
                    }
                    if (types.includes('locality')) {
                        newAddress.city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        newAddress.state = component.long_name;
                    }
                    if (types.includes('postal_code')) {
                        newAddress.pincode = component.long_name;
                    }
                    if (types.includes('country')) {
                        newAddress.country = component.long_name;
                    }
                }

                if (!newAddress.line1) {
                    newAddress.line1 = address.formatted_address;
                }

                resolve({ address: newAddress, status: 'OK' });
            });
        });
    }

    function placeMapMarker(position) {
        if (!mapInstanceRef.current || !window.google || !window.google.maps) {
            return;
        }

        if (!markerRef.current) {
            markerRef.current = new window.google.maps.Marker({
                map: mapInstanceRef.current,
                position,
                draggable: false,
            });
        } else {
            markerRef.current.setPosition(position);
        }

        mapInstanceRef.current.panTo(position);
        setSelectedPosition(position);
    }

    async function handleMapClick(event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        placeMapMarker({ lat, lng });

        const pickedAddress = await reverseGeocodePosition(lat, lng);
        if (pickedAddress && pickedAddress.status === 'OK') {
            updateMapAddress(pickedAddress.address, { lat, lng });
            setLocationError('');
        } else {
            setLocationError('Unable to resolve address from selected location.');
        }
    }


    async function fetchAddressFromCoords(lat, lng) {
        if (!GOOGLE_MAPS_API_KEY) return { address: null, error: 'API key is missing.' };
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`);
            const data = await response.json();
            if (data.status !== 'OK' || !data.results?.length) {
                return { address: null, error: data.error_message || data.status };
            }
            const address = data.results[0];
            const components = address.address_components;
            const newAddress = {
                name: shippingAddress.name || '',
                line1: '',
                line2: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India',
            };

            for (const component of components) {
                const types = component.types;
                if (types.includes('street_number')) {
                    newAddress.line1 = `${component.long_name} ${newAddress.line1}`.trim();
                }
                if (types.includes('route')) {
                    newAddress.line1 = `${newAddress.line1} ${component.long_name}`.trim();
                }
                if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('neighborhood')) {
                    if (!newAddress.line2) newAddress.line2 = component.long_name;
                }
                if (types.includes('locality')) {
                    newAddress.city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    newAddress.state = component.long_name;
                }
                if (types.includes('postal_code')) {
                    newAddress.pincode = component.long_name;
                }
                if (types.includes('country')) {
                    newAddress.country = component.long_name;
                }
            }

            if (!newAddress.line1) {
                newAddress.line1 = address.formatted_address;
            }

            return { address: newAddress, error: null };
        } catch (err) {
            return { address: null, error: err.message };
        }
    }

    function initializeMap() {
        if (!mapRef.current || !window.google || !window.google.maps) {
            return;
        }

        if (mapInstanceRef.current) {
            return;
        }

        const center = selectedPosition || { lat: 20.5937, lng: 78.9629 };
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 5,
            disableDefaultUI: true,
        });

        mapInstanceRef.current.addListener('click', handleMapClick);

        if (selectedPosition) {
            placeMapMarker(selectedPosition);
        }
    }

    async function fetchCurrentLocation() {
        setLocationError('');
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const location = { lat: latitude, lng: longitude };

                if (!GOOGLE_MAPS_API_KEY) {
                    setLocationError('Google Maps API key is missing.');
                    setLocationLoading(false);
                    return;
                }

                const result = await fetchAddressFromCoords(location.lat, location.lng);
                if (result.address) {
                    updateMapAddress(result.address, location);
                } else {
                    setLocationError(`Unable to fetch address from location: ${result.error}`);
                }

                if (window.google && window.google.maps) {
                    if (!mapInstanceRef.current) {
                        initializeMap();
                    }
                    mapInstanceRef.current.setCenter(location);
                    mapInstanceRef.current.setZoom(17);
                    placeMapMarker(location);
                }
            } catch (error) {
                setLocationError('Failed to fetch live location data.');
            } finally {
                setLocationLoading(false);
            }
        }, (error) => {
            setLocationLoading(false);
            if (error.code === error.PERMISSION_DENIED) {
                setLocationError('Please allow location access to fetch address.');
            } else {
                setLocationError('Unable to determine your location.');
            }
        });
    }

    function cancelCheckout() {
        setCurrentView('cart');
    }

    useEffect(() => {
        if (currentView === 'checkout') {
            loadGoogleMapsScript();
        }
    }, [currentView]);

    useEffect(() => {
        if (mapLoaded && currentView === 'checkout') {
            initializeMap();

            if (searchInputRef.current && window.google && window.google.maps && window.google.maps.places) {
                if (!autocompleteRef.current) {
                    autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current, {
                        types: ['geocode', 'establishment'],
                        componentRestrictions: { country: 'in' },
                    });

                    autocompleteRef.current.addListener('place_changed', () => {
                        const place = autocompleteRef.current.getPlace();
                        if (!place.geometry || !place.geometry.location) {
                            setMapError("No details available for input: '" + place.name + "'");
                            return;
                        }

                        const location = place.geometry.location;
                        const lat = location.lat();
                        const lng = location.lng();

                        placeMapMarker({ lat, lng });

                        const newAddress = {
                            name: shippingAddress.name || '',
                            line1: '',
                            line2: '',
                            city: '',
                            state: '',
                            pincode: '',
                            country: 'India',
                        };

                        if (place.address_components) {
                            for (const component of place.address_components) {
                                const types = component.types;
                                if (types.includes('street_number')) {
                                    newAddress.line1 = `${component.long_name} ${newAddress.line1}`.trim();
                                }
                                if (types.includes('route')) {
                                    newAddress.line1 = `${newAddress.line1} ${component.long_name}`.trim();
                                }
                                if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('neighborhood')) {
                                    if (!newAddress.line2) newAddress.line2 = component.long_name;
                                }
                                if (types.includes('locality')) {
                                    newAddress.city = component.long_name;
                                }
                                if (types.includes('administrative_area_level_1')) {
                                    newAddress.state = component.long_name;
                                }
                                if (types.includes('postal_code')) {
                                    newAddress.pincode = component.long_name;
                                }
                                if (types.includes('country')) {
                                    newAddress.country = component.long_name;
                                }
                            }
                        }

                        if (!newAddress.line1) {
                            newAddress.line1 = place.formatted_address || place.name;
                        }

                        updateMapAddress(newAddress, { lat, lng });
                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.setZoom(17);
                        }
                        setLocationError('');
                        setMapError('');
                    });
                }
            }
        }
    }, [mapLoaded, currentView]);

    // const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
    const cartTotal = useMemo(() =>
        cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        [cart]
    );

    const deliveryFee = useMemo(() => calculateDeliveryFee(cartTotal), [cartTotal]);
    const isGuest = !currentUser;
    const searchResults = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return [];
        return categoryList.flatMap((cat) => cat.products.map((p) => ({ ...p, category: cat.name }))).filter((p) => (
            p.name.toLowerCase().includes(q) || (p.subcategory || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)
        ));
    }, [searchTerm, categoryList]);

    return (
        <div className="app-shell">
            <header>
                <nav className={`${currentView === 'home' || currentView === 'categories' ? 'show-search' : ''}${hideMobileTopNav ? ' hide-mobile-top-nav' : ''}`}>
                    <div className="nav-row mobile-top-nav">
                        <div className="brand-search">
                            <div className="brand">
                                <img className="brand-mark" src="../logo.png" alt="Q" />
                                {/* <div className="brand-mark">Q</div> */}
                                <div>
                                    <strong>QuickCart</strong>
                                    <small>Fast shopping, easy checkout</small>
                                </div>
                            </div>
                            <div className="search-box">
                                <input
                                    aria-label="Search products"
                                    className="search-input"
                                    placeholder="Browse products, e.g. earbuds"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentView(e.target.value ? 'search' : 'home'); }}
                                />
                            </div>
                        </div>
                        <div className="top-links">
                            <ul>
                                <li onClick={() => { setCurrentView('home'); setSelectedCategoryName(null); }}>
                                    <img src="/svgs/home.svg" alt="Home" />
                                    <span>Home</span>
                                </li>
                                <li onClick={() => setCurrentView('categories')}>
                                    <img src="/svgs/category.svg" alt="Categories" />
                                    <span>Categories</span>
                                </li>
                                <li onClick={() => setCurrentView('cart')}>
                                    <img src="/svgs/cart.svg" alt="Cart" />
                                    <span>Cart</span>
                                </li>
                                <li onClick={() => setCurrentView('profile')}>
                                    <img src="/svgs/profile.svg" alt="Profile" />
                                    <span>Profile</span>
                                </li>
                                <li onClick={() => setCurrentView('admin')} className={`admin-nav-link${currentView === 'admin' ? ' active' : ''}`} title="Admin Login">
                                    <span style={{ fontSize: '20px' }}>🛡️</span>
                                    <span>Admin</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mobile-bottom">
                        <ul>
                            <li onClick={() => { setCurrentView('home'); setSelectedCategoryName(null); }}>
                                <img src="/svgs/home.svg" alt="Home" />
                                <span>Home</span>
                            </li>
                            <li onClick={() => setCurrentView('categories')}>
                                <img src="/svgs/category.svg" alt="Categories" />
                                <span>Categories</span>
                            </li>
                            <li onClick={() => setCurrentView('cart')}>
                                <img src="/svgs/cart.svg" alt="Cart" />
                                <span>Cart</span>
                            </li>
                            <li onClick={() => setCurrentView('profile')}>
                                <img src="/svgs/profile.svg" alt="Profile" />
                                <span>Profile</span>
                            </li>
                            <li onClick={() => setCurrentView('admin')} className={`admin-nav-link${currentView === 'admin' ? ' active' : ''}`} title="Admin">
                                <span style={{ fontSize: '20px' }}>🛡️</span>
                                <span>Admin</span>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <main>
                {currentView === 'home' && (
                    <>
                        <section className="home" id="home">
                            <div className="hero-banner">
                                <div className="hero-copy">
                                    <span className="hero-badge">Fresh deals every day</span>
                                    <h1>Shop gadgets, fashion, groceries and more in one place.</h1>
                                    <p>QuickCart brings convenience to your doorstep with fast checkout, easy wishlist and curated categories.</p>
                                    <p>Get 90% OFF on your first order using <b>NEW100</b></p>
                                    <div className="hero-actions">
                                        <button className="primary-btn" onClick={() => setCurrentView('categories')}>Shop now</button>
                                        <button className="ghost-btn" onClick={() => setCurrentView('profile')}>{isGuest ? 'Login / Sign up' : 'View profile'}</button>
                                    </div>
                                    <div className="hero-highlights">
                                        <span>⚡ Fast delivery</span>
                                        <span>💳 Secure payment</span>
                                        <span>🛍️ Wishlists saved</span>
                                    </div>
                                </div>
                                {showBanner && (
                                    <div className="hero-side-card">
                                        <button className="banner-close" onClick={() => setShowBanner(false)}>✕</button>
                                        <img src="/banner.png" alt="QuickCart banner" />
                                        <div className="hero-side-content">
                                            <h3>Welcome to QuickCart</h3>
                                            <p>Discover daily deals, new arrivals and more. Tap categories to explore subcategories.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {isGuest && (
                            <section className="guest-card">
                                <h3>Sign in for a smarter shopping experience</h3>
                                <p>Save favourites, track orders and checkout faster when you log in.</p>
                                <button onClick={() => setCurrentView('profile')}>Join QuickCart</button>
                            </section>
                        )}

                        <section className="home2" id="home2">
                            <div className="features">
                                <div className="feature-card">
                                    <div className="feature-icon">⚡</div>
                                    <h3>Lightning Fast</h3>
                                    <p>Delivery in 15-30 minutes</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🔒</div>
                                    <h3>Secure Payment</h3>
                                    <p>100% safe & secure transactions</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">💯</div>
                                    <h3>Quality Assured</h3>
                                    <p>Premium quality products only</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon"><img src="/assets/return.png" height="50" width="50" alt="Easy returns" /></div>
                                    <h3>Easy Doorstep Return</h3>
                                    <p>Check products and accept or return</p>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {currentView === 'search' && (
                    <section id="searchResults">
                        <div className="section-heading">
                            <h2>Search results</h2>
                            <p>Results for "{searchTerm}"</p>
                        </div>
                        <div className="products-grid">
                            {searchResults.length === 0 ? <p className="empty-state">No products found.</p> : searchResults.map((product) => {
                                const liveStock = getStock(product);
                                const cartQty = cart.find((item) => item.id === product.id)?.qty || 0;
                                return (
                                    <div key={product.id} className={`product-card${liveStock === 0 ? ' out-of-stock-card' : ''}`}>
                                        <div className="img-box">
                                            <img src={product.image} alt={product.name} />
                                            {liveStock === 0 && <div className="oos-overlay">Out of Stock</div>}
                                        </div>
                                        <div className="info">
                                            <h3>{product.name}</h3>
                                            <p>₹{product.price}</p>
                                            {liveStock === 0 ? (
                                                <span className="stock-badge out-stock">🔴 Out of Stock</span>
                                            ) : liveStock <= 5 ? (
                                                <span className="stock-badge low-stock">🔥 Only {liveStock} left!</span>
                                            ) : liveStock <= 10 ? (
                                                <span className="stock-badge low-stock">🟠 Only {liveStock} left</span>
                                            ) : (
                                                <span className="stock-badge in-stock">🟢 In Stock</span>
                                            )}
                                            <div className="qty-box">
                                                <button onClick={() => decreaseCart(product.id)} disabled={cartQty === 0}>-</button>
                                                <span>{cartQty}</span>
                                                <button onClick={() => increaseCart(product)} disabled={liveStock === 0 || cartQty >= liveStock}>+</button>
                                            </div>
                                            <div className="action-btns">
                                                <button className="wishlist-btn" onClick={() => addToWishlist(product)}>❤️</button>
                                                <button
                                                    className={`buy-btn${liveStock === 0 ? ' disabled-btn' : ''}`}
                                                    onClick={() => buyNow(product)}
                                                    disabled={liveStock === 0}
                                                >
                                                    {liveStock === 0 ? 'Out of Stock' : 'Buy Now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {currentView === 'categories' && (
                    <section className="category">
                        {!selectedCategory ? (
                            <>
                                <div className="section-heading">
                                    <h2>Shop by category</h2>
                                    <p>Pick a category and start exploring.</p>
                                </div>
                                <div className="categories-grid">
                                    {categoryList.map((category) => (
                                        <button key={category.name} className="category-card" onClick={() => { setSelectedCategoryName(category.name); setSelectedSubcategory(null); }}>
                                            <span className="category-icon">{category.icon}</span>
                                            <div className="category-copy">
                                                <h3>{category.name}</h3>
                                                <p>{category.description}</p>
                                            </div>
                                            <span className="category-count">{category.products.length} items</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <button className="back" onClick={() => setSelectedCategoryName(null)}>←</button>
                                <div className="section-heading">
                                    <h2>{selectedCategory.name}</h2>
                                    <p>{selectedCategory.description}</p>
                                </div>
                                <div className="category-subnav">
                                    <button className={`subcat-tab ${selectedSubcategory === null ? 'active' : ''}`} onClick={() => setSelectedSubcategory(null)}>All</button>
                                    {selectedCategory.subcategories?.map((sc) => (
                                        <button key={sc} className={`subcat-tab ${selectedSubcategory === sc ? 'active' : ''}`} onClick={() => setSelectedSubcategory(sc)}>{sc}</button>
                                    ))}
                                </div>

                                <div id="productsList" className="products-grid">
                                    {selectedCategory.products
                                        .filter((p) => selectedSubcategory ? p.subcategory === selectedSubcategory : true)
                                        .map((product) => {
                                            const liveStock = getStock(product);
                                            const cartQty = cart.find((item) => item.id === product.id)?.qty || 0;
                                            return (
                                                <div key={product.id} className={`product-card${liveStock === 0 ? ' out-of-stock-card' : ''}`}>
                                                    <div className="img-box">
                                                        <img src={product.image} alt={product.name} />
                                                        {liveStock === 0 && <div className="oos-overlay">Out of Stock</div>}
                                                    </div>
                                                    <div className="info">
                                                        <h3>{product.name}</h3>
                                                        <p>₹{product.price}</p>
                                                        {/* Stock badge */}
                                                        {liveStock === 0 ? (
                                                            <span className="stock-badge out-stock">🔴 Out of Stock</span>
                                                        ) : liveStock <= 5 ? (
                                                            <span className="stock-badge low-stock">🔥 Only {liveStock} left!</span>
                                                        ) : liveStock <= 10 ? (
                                                            <span className="stock-badge low-stock">🟠 Only {liveStock} left</span>
                                                        ) : (
                                                            <span className="stock-badge in-stock">🟢 In Stock</span>
                                                        )}
                                                        <div className="qty-box">
                                                            <button onClick={() => decreaseCart(product.id)} disabled={cartQty === 0}>-</button>
                                                            <span>{cartQty}</span>
                                                            <button onClick={() => increaseCart(product)} disabled={liveStock === 0 || cartQty >= liveStock}>+</button>
                                                        </div>
                                                        <div className="action-btns">
                                                            <button className="wishlist-btn" onClick={() => addToWishlist(product)}>❤️</button>
                                                            <button
                                                                className={`buy-btn${liveStock === 0 ? ' disabled-btn' : ''}`}
                                                                onClick={() => buyNow(product)}
                                                                disabled={liveStock === 0}
                                                            >
                                                                {liveStock === 0 ? 'Out of Stock' : 'Buy Now'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </>
                        )}
                    </section>
                )}

                {/* Wishlist is now part of Profile -> Wishlist tab */}

                {currentView === 'cart' && (
                    <section id="cartPage">
                        <h2>Your Cart</h2>
                        <div className="cart-list">
                            {cart.length === 0 ? <p className="empty-state">Your cart is empty.</p> : cart.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="left">
                                        <h4>{item.name}</h4>
                                        <p>Qty: {item.qty}</p>
                                        <p>₹{item.qty * item.price}</p>
                                    </div>
                                    <div className="right">
                                        <button onClick={() => decreaseCart(item.id)}>-</button>
                                        <button onClick={() => increaseCart(item)}>+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <h3 id="cartTotal">Total: ₹{cartTotal}</h3> */}
                        <h3 id="cartTotal">Subtotal : ₹{cartTotal}</h3>

                        {cart.length > 0 && (
                            <>
                                <p
                                    style={{
                                        color: deliveryFee === 0 ? "green" : "#f97316",
                                        fontWeight: "600",
                                        marginTop: "8px"
                                    }}
                                >
                                    {deliveryFee === 0
                                        ? "🎉 Congratulations! You unlocked FREE Delivery."
                                        : `🚚 Delivery Fee : ₹${deliveryFee}`}
                                </p>

                                {cartTotal < 199 && (
                                    <p
                                        style={{
                                            color: "#2563eb",
                                            fontSize: "14px",
                                            marginTop: "6px"
                                        }}
                                    >
                                        {cartTotal < 100
                                            ? `Add ₹${100 - cartTotal} more to reduce delivery fee to ₹20.`
                                            : `Add ₹${199 - cartTotal} more to get FREE Delivery.`}
                                    </p>
                                )}
                            </>
                        )}
                        <button className="checkout-btn" onClick={placeOrder}>Checkout</button>
                    </section>
                )}


                {currentView === 'checkout' && (
                    <section id="checkoutPage" className="checkout-page">
                        <button className="back ch" onClick={cancelCheckout}>↩</button>
                        <h2>Checkout</h2>
                        {checkoutData ? (
                            <>
                                <div className="checkout-summary">
                                    <div className="summary-header">
                                        <h3>Order summary</h3>
                                        <span>{checkoutData.items.length} item{checkoutData.items.length > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="checkout-items">
                                        {checkoutData.items.map((item, idx) => (
                                            <div key={`${item.name}-${idx}`} className="checkout-item">
                                                <div className="checkout-item-left">
                                                    <img src={item.image || '/assets/charger1.jpg'} alt={item.name} />
                                                    <div>
                                                        <strong>{item.name}</strong>
                                                        <p>Qty: {item.qty}</p>
                                                        <p>₹{item.price} each</p>
                                                    </div>
                                                </div>
                                                <span>₹{item.price * item.qty}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="coupon-row">
                                        <input
                                            type="text"
                                            placeholder="Apply coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                                        />
                                        <button className="apply-coupon-btn" onClick={applyCoupon}>Apply</button>
                                    </div>

                                    {/* ── Coupon Recommendations Panel ── */}
                                    {currentUser && couponRecommendations.length > 0 && (
                                        <div className="coupon-recs-panel">
                                            <div className="coupon-recs-title">
                                                🎟️ Available coupons
                                                {isFetchingRecs && <span className="recs-loading">↻</span>}
                                            </div>
                                            <div className="coupon-recs-list">
                                                {couponRecommendations.map((rec) => {
                                                    const isApplied = appliedCoupon === rec.code;
                                                    const canApply = rec.eligible && rec.meetsMinOrder;
                                                    return (
                                                        <div
                                                            key={rec.code}
                                                            className={`coupon-rec-chip
                                                                ${canApply ? 'chip-eligible' : ''}
                                                                ${!rec.eligible ? 'chip-ineligible' : ''}
                                                                ${isApplied ? 'chip-applied' : ''}`}
                                                        >
                                                            <div className="chip-top">
                                                                <span className="chip-code">{rec.code}</span>
                                                                <span className="chip-badge">
                                                                    {rec.discount}% off
                                                                    {rec.maxDiscount > 0 && ` (up to ₹${rec.maxDiscount})`}
                                                                </span>
                                                            </div>
                                                            <div className="chip-body">
                                                                {isApplied ? (
                                                                    <span className="chip-status applied">✅ Applied — saving ₹{couponDiscount}</span>
                                                                ) : canApply ? (
                                                                    <span className="chip-status eligible">🟢 Save ₹{rec.saving} on this order</span>
                                                                ) : rec.eligible && !rec.meetsMinOrder ? (
                                                                    <span className="chip-status shortfall">🛒 Add ₹{rec.shortfall} more to unlock</span>
                                                                ) : (
                                                                    <span className="chip-status locked">🔒 {rec.reason}</span>
                                                                )}
                                                            </div>
                                                            {canApply && !isApplied && (
                                                                <button
                                                                    className="chip-apply-btn"
                                                                    onClick={() => {
                                                                        setCouponCode(rec.code);
                                                                        // small delay so state flushes before applyCoupon reads it
                                                                        setTimeout(() => {
                                                                            const cartSubtotal = checkoutData.items.reduce((s, i) => s + i.price * i.qty, 0);
                                                                            api('/api/coupon/validate', {
                                                                                method: 'POST',
                                                                                body: JSON.stringify({ code: rec.code, subtotal: cartSubtotal })
                                                                            }).then(r => {
                                                                                if (r.ok) {
                                                                                    setAppliedCoupon(rec.code);
                                                                                    setCouponDiscount(r.discount);
                                                                                    setCouponDiscountPercent(r.discountPercent);
                                                                                    showToast(`${rec.code} applied — you save ₹${r.discount}!`);
                                                                                    fetchCouponRecommendations(cartSubtotal);
                                                                                } else {
                                                                                    showToast(r.msg || 'Could not apply coupon');
                                                                                }
                                                                            });
                                                                        }, 0);
                                                                    }}
                                                                >
                                                                    Apply
                                                                </button>
                                                            )}
                                                            {isApplied && (
                                                                <button
                                                                    className="chip-remove-btn"
                                                                    onClick={() => {
                                                                        setAppliedCoupon('');
                                                                        setCouponDiscount(0);
                                                                        setCouponDiscountPercent(0);
                                                                        setCouponCode('');
                                                                        showToast('Coupon removed');
                                                                    }}
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                            <div className="chip-footer">
                                                                Min order: ₹{rec.minOrderVal}
                                                                {rec.isFirstOrderOnly && ' · First order only'}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {appliedCoupon && (
                                        <div className="coupon-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>
                                                Coupon <strong>{appliedCoupon}</strong> applied
                                                {couponDiscountPercent > 0 && <> — {couponDiscountPercent}% off</>}
                                                {couponDiscount > 0 && <> (saving ₹{couponDiscount})</>}
                                            </span>
                                            <button
                                                onClick={() => { setAppliedCoupon(''); setCouponDiscount(0); setCouponDiscountPercent(0); setCouponCode(''); showToast('Coupon removed'); }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#be185d', fontSize: '16px' }}
                                                title="Remove coupon"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    )}
                                    {(() => {
                                        const subtotal = checkoutData.items.reduce(
                                            (sum, item) => sum + item.price * item.qty,
                                            0
                                        );

                                        // couponDiscount is already a rupee amount
                                        const discount = couponDiscount || 0;

                                        const deliveryFee = calculateDeliveryFee(subtotal);

                                        const finalTotal = subtotal - discount + deliveryFee;

                                        return (
                                            <div className="checkout-breakdown">

                                                <div>
                                                    <span>Subtotal</span>
                                                    <span>₹{subtotal}</span>
                                                </div>

                                                <div>
                                                    <span>Discount</span>
                                                    <span>-₹{discount}</span>
                                                </div>

                                                <div>
                                                    <span>Delivery Fee</span>
                                                    <span>
                                                        {deliveryFee === 0 ? (
                                                            <span style={{ color: "green", fontWeight: "600" }}>
                                                                FREE 🎉
                                                            </span>
                                                        ) : (
                                                            `₹${deliveryFee}`
                                                        )}
                                                    </span>
                                                </div>

                                                <hr style={{ margin: "10px 0" }} />

                                                <div className="checkout-total">
                                                    <span>Total</span>
                                                    <strong>₹{finalTotal}</strong>
                                                </div>

                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="checkout-summary">
                                    <div className="summary-header">
                                        <h3>Shipping address</h3>
                                        <span>Pick delivery location</span>
                                    </div>
                                    <div className="address-grid">
                                        <input className="checkout-input" style={{ marginBottom: 0 }} value={shippingAddress.name} onChange={(e) => setShippingAddress((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full Name" />
                                        <button type="button" className="location-btn" onClick={fetchCurrentLocation} disabled={locationLoading}>
                                            {locationLoading ? 'Fetching location…' : 'Use current location'}
                                        </button>
                                    </div>
                                    {locationError && <p className="location-error">{locationError}</p>}
                                    <div className="map-card">
                                        <div className="map-search-container" style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Search for your address (e.g., Connaught Place, New Delhi)..."
                                                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            />
                                        </div>
                                        <div className="map-header">Tap anywhere on the map to pin the delivery address</div>
                                        <div ref={mapRef} className="map-picker" />
                                        <div className="map-hint">Selected location coordinates: {selectedPosition ? `${selectedPosition.lat.toFixed(5)}, ${selectedPosition.lng.toFixed(5)}` : 'None'}</div>
                                        {mapError && <p className="location-error">{mapError}</p>}
                                    </div>
                                    <div className="address-details">
                                        <strong>Complete your address</strong>
                                        <input
                                            className="checkout-input"
                                            value={shippingAddress.line1}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, line1: e.target.value }))}
                                            placeholder="House No, Building, Street (Line 1)"
                                        />
                                        <input
                                            className="checkout-input"
                                            value={shippingAddress.line2}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, line2: e.target.value }))}
                                            placeholder="Locality, Area (Line 2)"
                                        />
                                        <div className="address-grid-row">
                                            <input
                                                className="checkout-input"
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                                                placeholder="City"
                                            />
                                            <input
                                                className="checkout-input"
                                                value={shippingAddress.state}
                                                onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                                                placeholder="State"
                                            />
                                            <input
                                                className="checkout-input"
                                                value={shippingAddress.pincode}
                                                onChange={(e) => setShippingAddress(prev => ({ ...prev, pincode: e.target.value }))}
                                                placeholder="Pincode"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-panel">
                                    <h3>Payment method</h3>
                                    <div className="payment-options">
                                        <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                            Cash on Delivery
                                        </label>
                                        <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                                            UPI
                                        </label>
                                    </div>
                                    {paymentMethod === 'upi' && (
                                        <input
                                            className="upi-input"
                                            placeholder="Enter your UPI ID"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    )}
                                    <button className="checkout-btn" onClick={handleConfirmPayment} disabled={isPaymentProcessing}>
                                        {isPaymentProcessing ? 'Processing...' : paymentMethod === 'upi' ? 'Pay via UPI' : 'Place COD order'}
                                    </button>
                                    <br />
                                    <br />
                                    <h5 style={{ textAlign: "center" }}>Powered By : QuickCart</h5>
                                </div>

                                {paymentSuccess && (
                                    <div className="payment-success">
                                        <div className="success-badge">✓</div>
                                        <h3>Order confirmed!</h3>
                                        <p>Your order is on the way. Thank you for shopping with QuickCart.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="empty-state">No checkout details available. Return to cart and try again.</p>
                        )}
                    </section>
                )}

                {currentView === 'profile' && (
                    <section id="profilePage">
                        {!currentUser ? (
                            <div className="auth-stack">
                                <div className="auth-card">
                                    <div className="auth-toggle">
                                        <button className={`toggle-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>Login</button>
                                        <button className={`toggle-tab ${authMode === 'signup' ? 'active' : ''}`} onClick={() => setAuthMode('signup')}>Create account</button>
                                    </div>
                                    {authMode === 'login' ? (
                                        <form onSubmit={handleLogin}>
                                            <h2>Welcome back</h2>
                                            <p className="auth-text">Log in to continue shopping.</p>
                                            <input value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} type="email" placeholder="Email" required />
                                            <input value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} type="password" placeholder="Password" required />
                                            <button type="submit" className="submit-btn">Login</button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleSignup}>
                                            <h2>Create your account</h2>
                                            <p className="auth-text"></p>
                                            <input value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} type="email" placeholder="Email" required />
                                            <input value={signupForm.phone} onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })} type="number" placeholder="Phone Number" required />
                                            <input value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} type="password" placeholder="Password" required />
                                            <input value={signupForm.confirmPassword} onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} type="password" placeholder="Confirm Password" required />
                                            <button type="submit" className="submit-btn">Sign Up</button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="profile-dashboard-container">
                                <div className="dashboard-grid">
                                    <div className="dashboard-card profile-info-card">
                                        <div className="profile-avatar"><span>{currentUser.email.charAt(0).toUpperCase()}</span></div>
                                        <h2>Welcome Back</h2>
                                        <h3>{currentUser.email}</h3>
                                        <div className="profile-details-form">
                                            <div className="form-group">
                                                <label htmlFor="profilePhoneInput">Phone Number</label>
                                                <input id="profilePhoneInput" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} type="tel" placeholder="Add phone number" />
                                            </div>
                                            <button onClick={saveProfileChanges} className="save-btn">Update Phone</button>
                                        </div>
                                        <div className="profile-actions">
                                            <button onClick={() => setPasswordFormVisible((prev) => !prev)} className="action-btn outline">Change Password</button>
                                            <button onClick={logoutUser} className="action-btn danger">Logout</button>
                                        </div>

                                        {passwordFormVisible && (
                                            <div className="change-password-box">
                                                <h4>Change Password</h4>
                                                <input value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} type="password" placeholder="New Password" required />
                                                <input value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} type="password" placeholder="Confirm New Password" required />
                                                <div className="password-actions">
                                                    <button onClick={changeUserPassword} className="save-btn">Save Password</button>
                                                    <button onClick={() => setPasswordFormVisible(false)} className="cancel-btn">Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="dashboard-right">
                                        <div className="profile-tabs">
                                            <button className={`profile-tab ${profileTab === 'overview' ? 'active' : ''}`} onClick={() => setProfileTab('overview')}>Overview</button>
                                            <button className="profile-tab" onClick={() => setCurrentView('orders')}>Orders</button>
                                            <button className={`profile-tab ${profileTab === 'wishlist' ? 'active' : ''}`} onClick={() => setProfileTab('wishlist')}>Wishlist</button>
                                            {/* <button className={`profile-tab ${profileTab === 'account' ? 'active' : ''}`} onClick={() => setProfileTab('account')}>Account</button> */}
                                        </div>

                                        <div className="profile-tab-content">
                                            {profileTab === 'overview' && (
                                                <>
                                                    <div className="stats-grid">
                                                        <div className="stat-card" onClick={() => setCurrentView('orders')}>
                                                            <div className="stat-icon">📦</div>
                                                            <div className="stat-info">
                                                                <h4>{orders.length}</h4>
                                                                <p>Total Orders</p>
                                                            </div>
                                                        </div>
                                                        <div className="stat-card">
                                                            <div className="stat-icon">🛒</div>
                                                            <div className="stat-info">
                                                                <h4>{cart.reduce((sum, item) => sum + item.qty, 0)}</h4>
                                                                <p>Items in Cart</p>
                                                            </div>
                                                        </div>
                                                        <div className="stat-card" onClick={() => setProfileTab('wishlist')}>
                                                            <div className="stat-icon">💖</div>
                                                            <div className="stat-info">
                                                                <h4>{wishlist.length}</h4>
                                                                <p>Items in Wishlist</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="dashboard-card recent-orders-card">
                                                        <div className="card-header">
                                                            <h3>Recent Orders</h3>
                                                            <button className="view-all-btn" onClick={() => setCurrentView('orders')}>View All</button>
                                                        </div>
                                                        <div className="recent-orders-list">
                                                            {orders.length === 0 ? <p className="no-orders">You haven't placed any orders yet.</p> : orders.slice(0, 2).map((order) => {
                                                                const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                                                                const orderRef = order._id || order.id || order.createdAt || 'local-order';
                                                                return (
                                                                    <div key={orderRef} className="recent-order-item">
                                                                        <div className="ro-header">
                                                                            <span className="ro-id">Order #{orderRef.slice(-6).toUpperCase()}</span>
                                                                            <span className={`ro-status ${order.status?.toLowerCase()}`}>{order.status}</span>
                                                                        </div>
                                                                        <div className="ro-details">
                                                                            <p className="ro-items">{order.items.map((item) => `${item.name} (x${item.qty})`).join(', ')}</p>
                                                                            <div className="ro-meta">
                                                                                <span className="ro-total">₹{order.total}</span>
                                                                                <span className="ro-date">{formattedDate}</span>
                                                                            </div>
                                                                            <div className="ro-payment">Payment: {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {profileTab === 'orders' && (
                                                <div className="orders-list">
                                                    {orders.length === 0 ? <p className="empty-state">No orders yet.</p> : orders.map((order) => {
                                                        const orderRef = order._id || order.id || order.createdAt || 'local-order';
                                                        return (
                                                            <div key={orderRef} className="order-card">
                                                                <div className="order-header">
                                                                    <strong>Order #{orderRef.slice(-6).toUpperCase()}</strong>
                                                                    <span className={`ro-status ${order.status?.toLowerCase()}`}>{order.status}</span>
                                                                </div>
                                                                <p>{order.items.map((item) => `${item.name} ×${item.qty}`).join(', ')}</p>
                                                                <p>Total: ₹{order.total}</p>
                                                                <p className="order-payment">Payment: {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {profileTab === 'wishlist' && (
                                                <div className="wishlist-list">
                                                    {wishlist.length === 0 ? <p className="empty-state">Your wishlist is empty.</p> : wishlist.map((item) => (
                                                        <div key={item.id} className="product-card wishlist-card">
                                                            <div className="img-box"><img src={item.image} alt={item.name} /></div>
                                                            <div className="info">
                                                                <h3>{item.name}</h3>
                                                                <p>₹{item.price}</p>
                                                                <div className="wishlist-actions">
                                                                    <button className="add-cart-btn" onClick={() => addToCartFromWishlist(item)}>Add to cart</button>
                                                                    <button className="remove-wishlist" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {profileTab === 'account' && (
                                                <div className="account-settings">
                                                    <div className="profile-details-form">
                                                        <div className="form-group">
                                                            <label htmlFor="profilePhoneInput">Phone Number</label>
                                                            <input id="profilePhoneInput" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} type="tel" placeholder="Add phone number" />
                                                        </div>
                                                        <button onClick={saveProfileChanges} className="save-btn">Update Phone</button>
                                                    </div>
                                                    <div style={{ marginTop: 12 }}>
                                                        <button onClick={() => setPasswordFormVisible((prev) => !prev)} className="action-btn outline">Change Password</button>
                                                        <button onClick={logoutUser} className="action-btn danger">Logout</button>
                                                    </div>

                                                    {passwordFormVisible && (
                                                        <div className="change-password-box">
                                                            <h4>Change Password</h4>
                                                            <input value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} type="password" placeholder="New Password" required />
                                                            <input value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} type="password" placeholder="Confirm New Password" required />
                                                            <div className="password-actions">
                                                                <button onClick={changeUserPassword} className="save-btn">Save Password</button>
                                                                <button onClick={() => setPasswordFormVisible(false)} className="cancel-btn">Cancel</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {currentView === 'orders' && (
                    <section id="ordersPage">
                        <button className="back" onClick={() => setCurrentView('profile')}>↩</button>
                        <h2>My Orders</h2>
                        <div className="orders-list">
                            {orders.length === 0 ? <p className="empty-state">No orders yet.</p> : orders.map((order) => {
                                const orderRef = order._id || order.id || order.createdAt || 'local-order';
                                const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                                const subtotal = order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
                                const discount = order.couponDiscount ? Math.round((subtotal * order.couponDiscount) / 100) : 0;
                                return (
                                    <div key={orderRef} className="order-card" onClick={() => viewOrderDetails(order)}>
                                        <div className="order-header">
                                            <strong>Order #{orderRef.slice(-6).toUpperCase()}</strong>
                                            <span className={`ro-status ${order.status?.toLowerCase()}`}>{order.status}</span>
                                        </div>
                                        <div className="order-summary-row">
                                            <p>{order.items[0]?.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}</p>
                                            <span>₹{order.total}</span>
                                        </div>
                                        <div className="order-caption">
                                            <span>{formattedDate}</span>
                                            <span>{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</span>
                                        </div>
                                        <div className="order-footer">
                                            <span>{order.couponCode ? `Coupon: ${order.couponCode}` : 'No coupon'}</span>
                                            <span>{order.address?.city}, {order.address?.state}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {currentView === 'orderDetails' && selectedOrder && (
                    <section id="orderDetailPage" className="order-detail-page">
                        <button className="back" onClick={backToOrders}>↩</button>
                        <div className="order-detail-card">
                            <div className="order-header">
                                <div>
                                    <strong>Order #{selectedOrder._id.slice(-6).toUpperCase()}</strong>
                                    <p className="order-caption">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <span className={`order-status ${selectedOrder.status?.toLowerCase()}`}>{selectedOrder.status}</span>
                            </div>

                            <div className="order-detail-grid">
                                <div className="order-detail-section">
                                    <h4>Items</h4>
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={`${item.name}-${idx}`} className="order-item-row">
                                            <img src={item.image || '/assets/charger1.jpg'} alt={item.name} />
                                            <div>
                                                <strong>{item.name}</strong>
                                                <p>Qty: {item.qty}</p>
                                                <p>₹{item.price} each</p>
                                            </div>
                                            <span>₹{item.price * item.qty}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-detail-section order-billing">
                                    <h4>Payment & billing</h4>
                                    <div className="billing-row"><span>Payment mode</span><strong>{selectedOrder.paymentMethod ? selectedOrder.paymentMethod.toUpperCase() : 'COD'}</strong></div>
                                    {selectedOrder.paymentMethod === 'upi' && <div className="billing-row"><span>UPI</span><strong>{selectedOrder.upiId}</strong></div>}
                                    <div className="billing-row"><span>Subtotal</span><strong>₹{selectedOrder.subtotal || selectedOrder.total}</strong></div>
                                    <div className="billing-row"><span>Coupon</span><strong>{selectedOrder.couponCode || 'None'}</strong></div>
                                    <div className="billing-row"><span>Discount</span><strong>₹{selectedOrder.couponDiscount ? Math.round((selectedOrder.subtotal * selectedOrder.couponDiscount) / 100) : 0}</strong></div>
                                    <div className="billing-row">
                                        <span>Delivery Fee</span>
                                        <strong style={{ color: selectedOrder.deliveryFee === 0 ? "green" : "inherit" }}>
                                            {selectedOrder.deliveryFee === 0
                                                ? "FREE"
                                                : `₹${selectedOrder.deliveryFee || 0}`}
                                        </strong>
                                    </div>
                                    <div className="billing-row total"><span>Total paid</span><strong>₹{selectedOrder.total}</strong></div>
                                </div>

                                <div className="order-detail-section order-location">
                                    <h4>Delivery address</h4>
                                    <p>{selectedOrder.address?.name}</p>
                                    <p>{selectedOrder.address?.line1}</p>
                                    {selectedOrder.address?.line2 && <p>{selectedOrder.address.line2}</p>}
                                    <p>{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
                                    <p>{selectedOrder.address?.country}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ==================== ADMIN INVENTORY PAGE ==================== */}
                {currentView === 'admin' && (
                    <section id="adminPage" className="admin-page">
                        <div className="admin-header">
                            <div className="admin-title-row">
                                <div>
                                    <h2>🛡️ Admin Dashboard</h2>
                                    <p className="admin-subtitle">Manage stock levels for all products</p>
                                </div>
                                {isAdmin && (
                                    <div className="admin-header-actions">
                                        <button className="admin-refresh-btn" onClick={loadAdminProducts}>↻ Refresh</button>
                                        <button className="admin-logout-btn" onClick={() => { setIsAdmin(false); setAdminKey(''); setAdminKeyInput(''); }}>🔓 Lock</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isAdmin ? (
                            <div className="admin-unlock-container">
                                <div className="admin-unlock-card">
                                    <div className="admin-lock-icon">🔐</div>
                                    <h3>Admin Access Required</h3>
                                    <p>Enter your admin key to manage inventory.</p>
                                    <div className="admin-key-row">
                                        <input
                                            id="adminKeyInput"
                                            type="password"
                                            className="admin-key-input"
                                            placeholder="Enter admin key…"
                                            value={adminKeyInput}
                                            onChange={(e) => setAdminKeyInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && unlockAdmin()}
                                        />
                                        <button className="admin-unlock-btn" onClick={unlockAdmin}>Unlock</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="admin-inventory-container">

                                {/* ── Admin Tabs ── */}
                                <div className="admin-tabs">
                                    <button
                                        className={`admin-tab-btn${adminTab === 'inventory' ? ' active' : ''}`}
                                        onClick={() => setAdminTab('inventory')}
                                    >
                                        📦 Inventory
                                    </button>
                                    <button
                                        className={`admin-tab-btn${adminTab === 'add' ? ' active' : ''}`}
                                        onClick={() => setAdminTab('add')}
                                    >
                                        ➕ Add Product
                                    </button>
                                </div>

                                {/* ── INVENTORY TAB ── */}
                                {adminTab === 'inventory' && (<>
                                    {/* Summary cards */}
                                    <div className="admin-stats-row">
                                        <div className="admin-stat-card">
                                            <span className="admin-stat-icon">📦</span>
                                            <div>
                                                <strong>{adminProducts.length}</strong>
                                                <small>Total Products</small>
                                            </div>
                                        </div>
                                        <div className="admin-stat-card warn">
                                            <span className="admin-stat-icon">🟠</span>
                                            <div>
                                                <strong>{adminProducts.filter(p => p.stock > 0 && p.stock <= 5).length}</strong>
                                                <small>Low Stock (&le;5)</small>
                                            </div>
                                        </div>
                                        <div className="admin-stat-card danger">
                                            <span className="admin-stat-icon">🔴</span>
                                            <div>
                                                <strong>{adminProducts.filter(p => p.stock === 0).length}</strong>
                                                <small>Out of Stock</small>
                                            </div>
                                        </div>
                                        <div className="admin-stat-card success">
                                            <span className="admin-stat-icon">🟢</span>
                                            <div>
                                                <strong>{adminProducts.filter(p => p.stock > 5).length}</strong>
                                                <small>Well Stocked</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products table */}
                                    <div className="admin-table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Category</th>
                                                    <th>Price</th>
                                                    <th>Status</th>
                                                    <th>Stock</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adminProducts
                                                    .slice()
                                                    .sort((a, b) => a.stock - b.stock)
                                                    .map((product) => {
                                                        const currentEdit = adminStockEdits[product.id] ?? product.stock;
                                                        const isSaving = adminSaving[product.id];
                                                        const stockNum = Number(currentEdit);
                                                        const statusClass = stockNum === 0 ? 'oos' : stockNum <= 5 ? 'low' : 'ok';
                                                        return (
                                                            <tr key={product.id} className={`admin-row ${statusClass}`}>
                                                                <td className="admin-product-cell">
                                                                    <img src={product.image} alt={product.name} className="admin-product-img" />
                                                                    <span className="admin-product-name">{product.name}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="admin-category-tag">{product.category}</span>
                                                                    <br />
                                                                    <small className="admin-subcategory">{product.subcategory}</small>
                                                                </td>
                                                                <td className="admin-price">₹{product.price}</td>
                                                                <td>
                                                                    {stockNum === 0 ? (
                                                                        <span className="admin-status-badge oos-badge">🔴 Out of Stock</span>
                                                                    ) : stockNum <= 5 ? (
                                                                        <span className="admin-status-badge low-badge">🔥 Critical</span>
                                                                    ) : stockNum <= 10 ? (
                                                                        <span className="admin-status-badge warn-badge">🟠 Low</span>
                                                                    ) : (
                                                                        <span className="admin-status-badge ok-badge">🟢 Good</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        className="admin-stock-input"
                                                                        value={currentEdit}
                                                                        onChange={(e) => setAdminStockEdits(prev => ({ ...prev, [product.id]: e.target.value }))}
                                                                        onKeyDown={(e) => e.key === 'Enter' && saveAdminStock(product.id)}
                                                                    />
                                                                </td>
                                                                <td className="admin-actions-cell">
                                                                    <button
                                                                        className="admin-save-btn"
                                                                        onClick={() => saveAdminStock(product.id)}
                                                                        disabled={isSaving || Number(currentEdit) === product.stock}
                                                                    >
                                                                        {isSaving ? '…' : 'Save'}
                                                                    </button>
                                                                    <button
                                                                        className="admin-delete-btn"
                                                                        onClick={() => deleteProduct(product.id)}
                                                                        disabled={isSaving}
                                                                        title="Delete Product"
                                                                    >
                                                                        🗑️ Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>)}

                                {/* ── ADD PRODUCT TAB ── */}
                                {adminTab === 'add' && (
                                    <div className="add-product-panel">
                                        <h3 className="add-product-heading">➕ Add New Product</h3>

                                        {/* Image drop zone */}
                                        <div
                                            className={`image-drop-zone${isDraggingImage ? ' dragging' : ''}${newProduct.image ? ' has-image' : ''}`}
                                            onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                                            onDragLeave={() => setIsDraggingImage(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDraggingImage(false);
                                                handleImageFile(e.dataTransfer.files[0]);
                                            }}
                                            onClick={() => document.getElementById('productImageInput').click()}
                                        >
                                            {newProduct.image ? (
                                                <div className="drop-zone-preview">
                                                    <img src={newProduct.image} alt="Preview" className="drop-preview-img" />
                                                    <button
                                                        className="drop-clear-btn"
                                                        onClick={(e) => { e.stopPropagation(); setNewProduct(prev => ({ ...prev, image: '' })); }}
                                                    >✕ Clear</button>
                                                </div>
                                            ) : (
                                                <div className="drop-zone-placeholder">
                                                    <span className="drop-icon">🖼️</span>
                                                    <p>Drop image here or <u>click to browse</u></p>
                                                    <small>JPG, PNG, WebP · max 2 MB</small>
                                                </div>
                                            )}
                                            <input
                                                id="productImageInput"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleImageFile(e.target.files[0])}
                                            />
                                        </div>

                                        {/* Alternatively paste an image URL */}
                                        <div className="add-product-url-row">
                                            <span>Or paste image URL:</span>
                                            <input
                                                type="text"
                                                className="add-product-input"
                                                placeholder="https://example.com/image.jpg"
                                                value={newProduct.image && newProduct.image.startsWith('data:') ? '' : newProduct.image}
                                                onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                                            />
                                        </div>

                                        {/* Form fields */}
                                        <div className="add-product-grid">
                                            <div className="add-product-field">
                                                <label>Product Name *</label>
                                                <input
                                                    type="text"
                                                    className="add-product-input"
                                                    placeholder="e.g. Wireless Earbuds Pro"
                                                    value={newProduct.name}
                                                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                                />
                                            </div>
                                            <div className="add-product-field">
                                                <label>Price (₹) *</label>
                                                <input
                                                    type="number"
                                                    className="add-product-input"
                                                    placeholder="e.g. 499"
                                                    min="1"
                                                    value={newProduct.price}
                                                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                                                />
                                            </div>
                                            <div className="add-product-field">
                                                <label>Category *</label>
                                                <select
                                                    className="add-product-input"
                                                    value={newProduct.category}
                                                    onChange={(e) => {
                                                        const cat = e.target.value;
                                                        const subcats = categoryMap[cat] || [];
                                                        setNewProduct(prev => ({
                                                            ...prev,
                                                            category: cat,
                                                            subcategory: subcats[0] || ''
                                                        }));
                                                    }}
                                                >
                                                    <option value="">Select Category</option>
                                                    {Object.keys(categoryMap).map((catName) => (
                                                        <option key={catName} value={catName}>{catName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="add-product-field">
                                                <label>Subcategory *</label>
                                                <select
                                                    className="add-product-input"
                                                    value={newProduct.subcategory}
                                                    onChange={(e) => setNewProduct(prev => ({ ...prev, subcategory: e.target.value }))}
                                                    disabled={!newProduct.category}
                                                >
                                                    <option value="">Select Subcategory</option>
                                                    {(categoryMap[newProduct.category] || []).map((subName) => (
                                                        <option key={subName} value={subName}>{subName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="add-product-field">
                                                <label>Initial Stock</label>
                                                <input
                                                    type="number"
                                                    className="add-product-input"
                                                    placeholder="e.g. 50"
                                                    min="0"
                                                    value={newProduct.stock}
                                                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="add-product-actions">
                                            <button
                                                className="add-product-submit-btn"
                                                onClick={addProduct}
                                                disabled={isAddingProduct}
                                            >
                                                {isAddingProduct ? 'Adding…' : '➕ Add Product'}
                                            </button>
                                            <button
                                                className="add-product-reset-btn"
                                                onClick={() => setNewProduct({ name: '', price: '', category: '', subcategory: '', stock: '', image: '' })}
                                            >
                                                ↻ Reset
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </section>
                )}
            </main>

            {currentView === 'home' && (
                <footer id="footer">
                    <b>© QuickCart || Made with ❤️ || 2025</b>
                </footer>
            )}

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}

export default App;
