'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
export default function Home() {
  const [stats, setStats] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api('/reports/daily-sales').then(setStats).catch(e => setError(e.message)); }, []);
  return <main className="shell"><header className="topbar"><div><p className="eyebrow">RESTAURANT MANAGEMENT</p><h1>Restaurant POS</h1></div><button className="secondary" onClick={() => { localStorage.removeItem('pos_token'); location.href='/login'; }}>Log out</button></header>
    <nav className="nav"><Link href="/">Dashboard</Link><Link href="/menu">Menu management</Link><Link href="/orders">Orders & billing</Link></nav>
    <section className="welcome"><div><p className="eyebrow">TODAY AT A GLANCE</p><h2>Good service starts here.</h2><p>Manage your menu, create orders and record payments from one place.</p></div><span className="food-icon">☕</span></section>
    {error && <p className="notice">{error} — <Link href="/login">Log in</Link> if you have not logged in.</p>}
    <section className="stats"><article className="stat"><span>Total orders today</span><strong>{stats?.totalOrders ?? '—'}</strong></article><article className="stat"><span>Completed orders</span><strong>{stats?.completedOrders ?? '—'}</strong></article><article className="stat"><span>Paid sales today</span><strong>{stats ? `₹${Number(stats.dailySales).toFixed(2)}` : '—'}</strong></article></section>
    <section className="panel"><h3>Recent orders</h3>{stats?.recentOrders?.length ? <div className="table-wrap"><table><thead><tr><th>Order</th><th>Type</th><th>Status</th><th>Total</th></tr></thead><tbody>{stats.recentOrders.map(o=><tr key={o._id}><td>{o.orderNumber}</td><td>{o.orderType}</td><td><span className="pill">{o.status}</span></td><td>₹{o.total.toFixed(2)}</td></tr>)}</tbody></table></div> : <p className="muted">Your recent orders will appear here.</p>}</section>
  </main>;
}
