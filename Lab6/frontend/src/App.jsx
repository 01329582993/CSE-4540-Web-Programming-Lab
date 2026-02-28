import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Shirt, Sparkles, ShowerHead, PieChart, Settings,
    Plus, Trash2, WashingMachine, CheckCircle, X, Loader2
} from 'lucide-react';
import * as api from './api';

// --- Components ---

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
        { path: '/wardrobe', label: 'Wardrobe', icon: <Shirt size={20} /> },
        { path: '/outfits', label: 'Outfits', icon: <Sparkles size={20} /> },
    ];

    const orgLinks = [
        { path: '/laundry', label: 'Laundry', icon: <WashingMachine size={20} /> },
        { path: '/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    ];

    return (
        <nav className="sidebar">
            <div className="logo-container">
                <div className="logo-icon">S</div>
                <span className="logo-text">StyleSync</span>
            </div>

            <div className="nav-section-title">Main Menu</div>
            <div className="nav-links">
                {navLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`nav-item ${currentPath === link.path ? 'active' : ''}`}
                    >
                        {link.icon} <span>{link.label}</span>
                    </Link>
                ))}
            </div>

            <div className="nav-section-title">Organization</div>
            <div className="nav-links">
                {orgLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`nav-item ${currentPath === link.path ? 'active' : ''}`}
                    >
                        {link.icon} <span>{link.label}</span>
                    </Link>
                ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <div className="nav-section-title">Support</div>
                <div className="nav-links">
                    <Link to="/settings" className={`nav-item ${currentPath === '/settings' ? 'active' : ''}`}>
                        <Settings size={20} /> <span>Settings</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({ totalItems: 0 });
    const [suggestion, setSuggestion] = useState(null);
    const [laundry, setLaundry] = useState({ pending: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const [s, sug, l] = await Promise.all([
                api.fetchWardrobeStats(),
                api.fetchDailySuggestion(),
                api.fetchLaundryStats()
            ]);
            setStats(s);
            setSuggestion(sug);
            setLaundry(l);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="loader"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="view-content">
            <header className="header">
                <div className="welcome-section">
                    <h1>Dashboard</h1>
                    <p>Welcome back! Your wardrobe is synchronized and ready.</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/wardrobe')}>+ Add New Item</button>
            </header>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-title"><Shirt size={20} color="#6366f1" /> Wardrobe Status</div>
                    <div className="card-stats">{stats.totalItems}</div>
                    <p style={{ color: 'var(--text-muted)' }}>Total items in your collection</p>
                </div>

                <div className="card">
                    <div className="card-title"><Sparkles size={20} color="#8b5cf6" /> Daily Suggestion</div>
                    <div style={{ margin: '1rem 0' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{suggestion?.name}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>{suggestion?.description}</p>
                    </div>
                    {suggestion?.recommended && <div className="status-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>Recommended</div>}
                </div>

                <div className="card">
                    <div className="card-title"><WashingMachine size={20} color="#10b981" /> Laundry Queue</div>
                    <div className="card-stats">{laundry.pending}</div>
                    <p style={{ color: 'var(--text-muted)' }}>Items pending rotation</p>
                </div>
            </div>
        </div>
    );
};

const Wardrobe = ({ onOpenModal }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadItems = async () => {
        const data = await api.fetchClothes();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            await api.deleteClothesItem(id);
            loadItems();
        }
    };

    const handleLaundry = async (id) => {
        await api.createLaundrySession([id]);
        alert('Item moved to laundry queue!');
    };

    if (loading) return <div className="loader"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="view-content">
            <header className="header">
                <div className="welcome-section">
                    <h1>Wardrobe</h1>
                    <p>Total items: {items.length}</p>
                </div>
                <button className="btn-primary" onClick={onOpenModal}>+ Add New Item</button>
            </header>

            <div className="wardrobe-grid">
                {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Your wardrobe is empty. Add your first item!</p>}
                {items.map(item => item && (
                    <div key={item._id} className="item-card">
                        <div className="item-image-container">
                            <img src={item.images?.[0]?.url || 'https://via.placeholder.com/300'} className="item-image" alt={item.name} />
                        </div>
                        <div className="item-info">
                            <h3 className="item-name">{item.name}</h3>
                            <div className="item-meta">
                                <span className="tag">{item.category}</span>
                                {item.subcategory && <span className="tag">{item.subcategory}</span>}
                                <span className="tag">{item.color}</span>
                            </div>
                        </div>
                        <div className="item-actions">
                            <button className="btn-action" onClick={() => handleLaundry(item._id)} title="Add to Laundry">
                                <WashingMachine size={18} />
                            </button>
                            <button className="btn-action danger" onClick={() => handleDelete(item._id)} title="Delete Item">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Laundry = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadSessions = async () => {
        const data = await api.fetchLaundryItems();
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleDone = async (id) => {
        await api.updateLaundryStatus(id, 'done');
        loadSessions();
    };

    if (loading) return <div className="loader"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="view-content">
            <header className="header">
                <div className="welcome-section">
                    <h1>Laundry Queue</h1>
                    <p>Manage items currently in cleaning cycles.</p>
                </div>
            </header>

            <div className="laundry-container">
                {sessions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No active laundry sessions.</p>}
                {sessions.map(session => (
                    <div key={session._id} className="laundry-group">
                        <div className="laundry-header">
                            <div>
                                <span className="status-badge" style={{ background: session.status === 'done' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                                    {session.status}
                                </span>
                                <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>{new Date(session.createdAt).toLocaleDateString()}</span>
                            </div>
                            {session.status !== 'done' && (
                                <button className="btn-primary" onClick={() => handleDone(session._id)}>Mark as Finished</button>
                            )}
                        </div>
                        <div className="laundry-items-row">
                            {session.items && Array.isArray(session.items) && session.items.map(item => item && (
                                <div key={item._id} className="laundry-item-chip">
                                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} className="laundry-thumb" alt={item.name} />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Outfits = () => {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const loadOutfits = async () => {
        const data = await api.fetchOutfits();
        setOutfits(data);
        setLoading(false);
    };

    useEffect(() => {
        loadOutfits();
    }, []);

    const handleGenerate = async () => {
        try {
            setGenerating(true);
            await api.generateOutfit();
            await loadOutfits();
        } catch (error) {
            alert('Could not generate outfit. Ensure you have active clothes!');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="loader"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="view-content">
            <header className="header">
                <div className="welcome-section">
                    <h1>Outfit Generator</h1>
                    <p>Your personalized style combinations.</p>
                </div>
                <button className="btn-primary" onClick={handleGenerate} disabled={generating}>
                    {generating ? <Loader2 className="animate-spin" /> : '✨ Generate New Look'}
                </button>
            </header>

            <div className="outfit-grid">
                {outfits.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No outfits generated yet. Try generating your first look!</p>}
                {[...outfits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(outfit => outfit && (
                    <div key={outfit._id} className="item-card">
                        <div className="item-image-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                            {outfit.outfitImages && outfit.outfitImages.length > 0 ? (
                                <img src={outfit.outfitImages[0].url} style={{ gridColumn: 'span 2', width: '100%', height: '100%', objectFit: 'cover' }} alt={outfit.name} />
                            ) : (
                                outfit.clothingItems?.slice(0, 2).map(item => item && (
                                    <img key={item._id} src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                                ))
                            )}
                        </div>
                        <div className="item-info">
                            <h3 className="item-name">{outfit.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                Generated on {new Date(outfit.createdAt).toLocaleDateString()}
                            </p>
                            <div className="item-meta">
                                {outfit.clothingItems?.map(c => c && <span key={c._id} className="tag">{c.name}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const res = await api.fetchAnalytics();
            setData(res);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="loader"><Loader2 className="animate-spin" /></div>;
    if (!data || !data.success) return <div className="loader">Error loading analytics data. Please try again.</div>;

    return (
        <div className="view-content">
            <header className="header">
                <div className="welcome-section">
                    <h1>Wardrobe Insights</h1>
                    <p>Total items: {data.totalItems}. Understanding your style patterns.</p>
                </div>
            </header>

            <div className="analytics-grid">
                {/* Category Breakdown */}
                <section className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-title">📦 Category Breakdown</div>
                    <div className="category-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                        {Object.entries(data.categoryDistribution || {}).map(([cat, count]) => (
                            <div key={cat} className="category-stat-card" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>{count}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{cat}s</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="card">
                    <div className="card-title">🔥 Most Worn Items</div>
                    <div className="stat-list">
                        {data.mostUsed?.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No high-usage items found yet.</p>}
                        {data.mostUsed?.slice(0, 5).map(item => item && (
                            <div key={item._id} className="stat-item" style={{ marginBottom: '0.75rem' }}>
                                <div className="stat-info">
                                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} className="stat-thumb" alt={item.name} />
                                    <span>{item.name}</span>
                                </div>
                                <div className="stat-usage">
                                    <div className="usage-count">{item.wearCount}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>wears</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="card">
                    <div className="card-title">♻️ Donation Suggestions</div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Items you haven't worn in over a year.</p>
                    <div className="stat-list">
                        {data.donationSuggestions?.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Your wardrobe is perfectly rotated!</p>}
                        {data.donationSuggestions?.slice(0, 5).map(item => item && (
                            <div key={item._id} className="stat-item" style={{ marginBottom: '0.75rem' }}>
                                <div className="stat-info">
                                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} className="stat-thumb" alt={item.name} />
                                    <span>{item.name}</span>
                                </div>
                                <button className="btn-action danger" style={{ flex: 'none', padding: '0.4rem 1rem' }}>Donate</button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const AddItemModal = ({ isOpen, onClose, onRefresh }) => {
    const [submitting, setSubmitting] = useState(false);
    const [category, setCategory] = useState('top');

    const subcategories = {
        top: ['T-Shirt', 'Shirt', 'Hoodie', 'Sweater', 'Jacket', 'Coat'],
        bottom: ['Jeans', 'Trousers', 'Shorts', 'Skirt', 'Leggings'],
        shoes: ['Sneakers', 'Boots', 'Formal', 'Sandals', 'Heels'],
        accessories: ['Watch', 'Belt', 'Sunglasses', 'Bag', 'Hat', 'Scarf']
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            setSubmitting(true);
            await api.addClothesItem(formData);
            onRefresh();
            onClose();
        } catch (error) {
            alert(`Error adding item: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay active">
            <div className="modal-content">
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2>Add New Item</h2>
                    <button className="close-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}><X /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Item Name</label>
                        <input type="text" name="name" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            className="form-input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="shoes">Shoes</option>
                            <option value="accessories">Accessories</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Subcategory</label>
                        <select name="subcategory" className="form-input" required>
                            {subcategories[category].map(sub => (
                                <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Color</label>
                            <input type="text" name="color" className="form-input" required />
                        </div>
                        <div>
                            <label>Season</label>
                            <input type="text" name="season" className="form-input" placeholder="e.g. Summer" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image</label>
                        <input type="file" name="images" className="form-input" multiple />
                    </div>
                    <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main App Component ---

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wardrobe" element={<Wardrobe onOpenModal={() => setIsModalOpen(true)} />} />
                    <Route path="/laundry" element={<Laundry />} />
                    <Route path="/outfits" element={<Outfits />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<div><h1>Settings</h1><p>Coming soon...</p></div>} />
                </Routes>
            </main>

            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={() => {
                    // If we are on wardrobe page, we'd want to refresh. 
                    // Simplest way in this structure is window.location.reload() or passing refresh logic.
                    // For now, let's just navigate to wardrobe which will trigger reload if already there.
                    window.location.reload();
                }}
            />
        </>
    );
}

export default App;
