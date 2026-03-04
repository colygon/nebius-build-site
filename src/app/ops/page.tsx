"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Plus, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SponsorshipTransaction = {
  id?: string;
  sponsor_name: string;
  sponsor_email: string | null;
  sponsor_package: string;
  pledged_usd: number | null;
  paid_usd: number | null;
  status: string;
  notes: string | null;
  created_at?: string;
};

type FoodVendor = {
  id?: string;
  name: string;
  category: string;
  contact_name: string | null;
  contact_email: string | null;
  phone: string | null;
  website: string | null;
  notes: string | null;
};

type FoodOrder = {
  id?: string;
  vendor_id: string;
  vendor_name?: string;
  order_reference: string | null;
  items: string;
  quantity: number;
  unit_cost_usd: number | null;
  total_cost_usd: number | null;
  event_time: string | null;
  status: "planned" | "ordered" | "delivered";
  notes: string | null;
  created_at?: string;
};

const PACKAGE_OPTIONS = [
  {
    name: "Community",
    price: 1000,
    details: "Logo on stage slides + social shoutout.",
  },
  {
    name: "Growth",
    price: 2500,
    details: "Community + booth + 1 speaking minute + social campaign.",
  },
  {
    name: "Partner",
    price: 5000,
    details: "Growth + hosted session + event branding + speaker mention.",
  },
  {
    name: "Title",
    price: 10000,
    details: "Partner + headline mention + VIP hospitality.",
  },
];

export default function OpsTrackerPage() {
  const [transactions, setTransactions] = useState<SponsorshipTransaction[]>([]);
  const [vendors, setVendors] = useState<FoodVendor[]>([]);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [txForm, setTxForm] = useState({
    sponsor_name: "",
    sponsor_email: "",
    sponsor_package: "Community",
    pledged_usd: "",
    paid_usd: "",
    status: "pledged",
    notes: "",
  });

  const [vendorForm, setVendorForm] = useState({
    name: "",
    category: "Food",
    contact_name: "",
    contact_email: "",
    phone: "",
    website: "",
    notes: "",
  });

  const [orderForm, setOrderForm] = useState({
    vendor_id: "",
    order_reference: "",
    items: "",
    quantity: "1",
    unit_cost_usd: "",
    total_cost_usd: "",
    event_time: "",
    status: "planned" as FoodOrder["status"],
    notes: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setSubmitError(null);

    const [{ data: txData, error: txErr }, { data: vendorData, error: vendorErr }, { data: orderData, error: orderErr }] = await Promise.all([
      supabase.from("sponsorship_transactions").select("*").order("created_at", { ascending: false }),
      supabase.from("food_vendors").select("*").order("name", { ascending: true }),
      supabase.from("food_orders").select("id,vendor_id,order_reference,items,quantity,unit_cost_usd,total_cost_usd,event_time,status,notes,created_at").order("created_at", { ascending: false }),
    ]);

    if (txErr || vendorErr || orderErr) {
      setSubmitError("Some Ops tracking tables are not set up yet. Please run the SQL schema notes in docs/FINANCE_AND_VENDORS_NOTES.md.");
      setLoading(false);
      return;
    }

    setTransactions((txData || []) as SponsorshipTransaction[]);
    setVendors((vendorData || []) as FoodVendor[]);

    const vendorNameMap = new Map<string, string>((vendorData || []).map((v: FoodVendor) => [v.id as string, v.name] as [string, string]));
    const normalizedOrders = (orderData || []).map((order: any) => ({
      ...order,
      status: order.status || "planned",
      vendor_name: vendorNameMap.get(order.vendor_id),
      quantity: order.quantity ?? 0,
      unit_cost_usd: order.unit_cost_usd ?? null,
      total_cost_usd: order.total_cost_usd ?? null,
    }));
    setOrders(normalizedOrders as FoodOrder[]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setTimeout(() => setSuccessMessage(""), 2500);
  }, [successMessage]);

  const totalPledged = useMemo(
    () => transactions.reduce((sum, tx) => sum + (tx.pledged_usd || 0), 0),
    [transactions]
  );
  const totalPaid = useMemo(
    () => transactions.reduce((sum, tx) => sum + (tx.paid_usd || 0), 0),
    [transactions]
  );
  const totalFood = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total_cost_usd || 0), 0),
    [orders]
  );

  const saveTransaction = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError(null);
    setSuccessMessage("");

    const row = {
      sponsor_name: txForm.sponsor_name,
      sponsor_email: txForm.sponsor_email || null,
      sponsor_package: txForm.sponsor_package,
      pledged_usd: txForm.pledged_usd ? Number(txForm.pledged_usd) : null,
      paid_usd: txForm.paid_usd ? Number(txForm.paid_usd) : 0,
      status: txForm.status,
      notes: txForm.notes || null,
    };

    const { error } = await supabase.from("sponsorship_transactions").insert(row);
    setSaving(false);

    if (error) {
      setSubmitError(`Could not save sponsorship transaction: ${error.message}`);
      return;
    }

    setTxForm({
      sponsor_name: "",
      sponsor_email: "",
      sponsor_package: "Community",
      pledged_usd: "",
      paid_usd: "",
      status: "pledged",
      notes: "",
    });
    setSuccessMessage("Sponsorship entry added.");
    loadData();
  };

  const saveVendor = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError(null);

    const row = {
      name: vendorForm.name,
      category: vendorForm.category,
      contact_name: vendorForm.contact_name || null,
      contact_email: vendorForm.contact_email || null,
      phone: vendorForm.phone || null,
      website: vendorForm.website || null,
      notes: vendorForm.notes || null,
    };

    const { error } = await supabase.from("food_vendors").insert(row);
    setSaving(false);

    if (error) {
      setSubmitError(`Could not save vendor: ${error.message}`);
      return;
    }

    setVendorForm({
      name: "",
      category: "Food",
      contact_name: "",
      contact_email: "",
      phone: "",
      website: "",
      notes: "",
    });
    setSuccessMessage("Vendor added.");
    loadData();
  };

  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError(null);

    if (!orderForm.vendor_id) {
      setSubmitError("Select a vendor before placing an order.");
      setSaving(false);
      return;
    }

    const unit = orderForm.unit_cost_usd ? Number(orderForm.unit_cost_usd) : null;
    const quantity = Number(orderForm.quantity || 0);
    const total = orderForm.total_cost_usd
      ? Number(orderForm.total_cost_usd)
      : unit !== null
        ? unit * quantity
        : null;

    const row = {
      vendor_id: orderForm.vendor_id,
      order_reference: orderForm.order_reference || null,
      items: orderForm.items,
      quantity,
      unit_cost_usd: unit,
      total_cost_usd: total,
      event_time: orderForm.event_time || null,
      status: orderForm.status,
      notes: orderForm.notes || null,
    };

    const { error } = await supabase.from("food_orders").insert(row);
    setSaving(false);

    if (error) {
      setSubmitError(`Could not place food order: ${error.message}`);
      return;
    }

    setOrderForm({
      vendor_id: "",
      order_reference: "",
      items: "",
      quantity: "1",
      unit_cost_usd: "",
      total_cost_usd: "",
      event_time: "",
      status: "planned",
      notes: "",
    });

    setSuccessMessage("Food order logged.");
    loadData();

    if (process.env.NEXT_PUBLIC_FOOD_ORDER_WEBHOOK_URL) {
      fetch(process.env.NEXT_PUBLIC_FOOD_ORDER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "agenthack_ops",
          type: "food_order",
          payload: row,
        }),
      }).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="sticky top-0 z-20 bg-[#0a0a0a]/90 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-sm text-white/70 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Nebius.Build
          </Link>
          <div className="text-sm text-white/60">Ops Tracker</div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[#c8ff00] text-sm uppercase tracking-[0.2em]">Nebius.Build Ops</p>
            <h1 className="text-4xl font-bold">Sponsorship & Food Ops Tracker</h1>
            <p className="text-white/60 mt-2">
              Track money, sponsorship packages, food vendors, and place orders from one dashboard.
            </p>
          </div>
          <div className="text-right text-sm text-white/70 space-y-1">
            <div>Total Pledged: <span className="text-white">${totalPledged.toFixed(2)}</span></div>
            <div>Total Paid: <span className="text-emerald-400">${totalPaid.toFixed(2)}</span></div>
            <div>Food Spend: <span className="text-amber-300">${totalFood.toFixed(2)}</span></div>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 border border-red-500/40 text-red-300 text-sm">{submitError}</div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 border border-emerald-400/40 text-emerald-200 text-sm flex items-center gap-3">
            <Check className="w-4 h-4" /> {successMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="border border-white/20 p-6">
            <h2 className="text-xl font-semibold mb-4">Track sponsorship package money</h2>
            <form onSubmit={saveTransaction} className="space-y-4">
              <input
                required
                value={txForm.sponsor_name}
                onChange={(e) => setTxForm((prev) => ({ ...prev, sponsor_name: e.target.value }))}
                placeholder="Sponsor / Org name"
                className="w-full border border-white/20 bg-transparent px-4 py-3"
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  value={txForm.sponsor_email}
                  onChange={(e) => setTxForm((prev) => ({ ...prev, sponsor_email: e.target.value }))}
                  placeholder="Contact email"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
                <select
                  value={txForm.sponsor_package}
                  onChange={(e) => setTxForm((prev) => ({ ...prev, sponsor_package: e.target.value }))}
                  className="border border-white/20 bg-transparent px-4 py-3 text-white"
                >
                  {PACKAGE_OPTIONS.map((pkg) => (
                    <option key={pkg.name} value={pkg.name}>
                      {pkg.name} (${pkg.price})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  value={txForm.pledged_usd}
                  onChange={(e) => setTxForm((prev) => ({ ...prev, pledged_usd: e.target.value }))}
                  placeholder="Pledged amount"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
                <input
                  type="number"
                  value={txForm.paid_usd}
                  onChange={(e) => setTxForm((prev) => ({ ...prev, paid_usd: e.target.value }))}
                  placeholder="Amount paid (optional)"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
              </div>
              <select
                value={txForm.status}
                onChange={(e) => setTxForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full border border-white/20 bg-transparent px-4 py-3 text-white"
              >
                <option value="pledged">Pledged</option>
                <option value="confirmed">Confirmed</option>
                <option value="paid">Paid</option>
                <option value="invoice_sent">Invoice sent</option>
              </select>
              <textarea
                value={txForm.notes}
                onChange={(e) => setTxForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full border border-white/20 bg-transparent px-4 py-3 h-24"
                placeholder="Notes / obligations / package perks"
              />
              <button
                disabled={saving}
                type="submit"
                className="bg-white text-black w-full py-3 font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save sponsorship entry"}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-white/60 mb-2">Current package list</p>
              <ul className="space-y-2">
                {PACKAGE_OPTIONS.map((pkg) => (
                  <li key={pkg.name} className="text-sm border border-white/10 p-3">
                    <div className="font-semibold">{pkg.name} — ${pkg.price}</div>
                    <div className="text-white/60">{pkg.details}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="border border-white/20 p-6">
            <h2 className="text-xl font-semibold mb-4">Vendor directory (food)</h2>
            <form onSubmit={saveVendor} className="space-y-4">
              <input
                required
                value={vendorForm.name}
                onChange={(e) => setVendorForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Vendor name"
                className="w-full border border-white/20 bg-transparent px-4 py-3"
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  value={vendorForm.category}
                  onChange={(e) => setVendorForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Category"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
                <input
                  value={vendorForm.contact_name}
                  onChange={(e) => setVendorForm((prev) => ({ ...prev, contact_name: e.target.value }))}
                  placeholder="Contact name"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <input
                  value={vendorForm.contact_email}
                  onChange={(e) => setVendorForm((prev) => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="Email"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
                <input
                  value={vendorForm.phone}
                  onChange={(e) => setVendorForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
                <input
                  value={vendorForm.website}
                  onChange={(e) => setVendorForm((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="Website / menu / ordering link"
                  className="border border-white/20 bg-transparent px-4 py-3"
                />
              </div>
              <textarea
                value={vendorForm.notes}
                onChange={(e) => setVendorForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full border border-white/20 bg-transparent px-4 py-3 h-20"
                placeholder="Vendor notes and ordering policy"
              />
              <button
                disabled={saving}
                type="submit"
                className="border border-[#c8ff00]/50 text-[#c8ff00] w-full py-3 font-semibold hover:bg-[#c8ff00] hover:text-black transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save vendor"}
              </button>
            </form>

            <div className="mt-6 space-y-2">
              {vendors.length === 0 ? (
                <p className="text-sm text-white/50">No vendors yet.</p>
              ) : (
                vendors.map((vendor) => (
                  <div key={vendor.id} className="border border-white/10 p-3 text-sm">
                    <div className="font-semibold">{vendor.name} ({vendor.category})</div>
                    <div className="text-white/60">
                      {vendor.contact_name || vendor.contact_email || vendor.phone || vendor.website || "No contact details"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-8 border border-white/20 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Place food orders
          </h2>

          <form onSubmit={placeOrder} className="space-y-4">
            <select
              required
              value={orderForm.vendor_id}
              onChange={(e) => setOrderForm((prev) => ({ ...prev, vendor_id: e.target.value }))}
              className="w-full border border-white/20 bg-transparent px-4 py-3 text-white"
            >
              <option value="">Select food vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>

            <input
              required
              value={orderForm.items}
              onChange={(e) => setOrderForm((prev) => ({ ...prev, items: e.target.value }))}
              placeholder="Order details (eg: Pizza x 80, energy drinks x 20)"
              className="w-full border border-white/20 bg-transparent px-4 py-3"
            />

            <div className="grid sm:grid-cols-4 gap-3">
              <input
                type="number"
                min={1}
                value={orderForm.quantity}
                onChange={(e) => setOrderForm((prev) => ({ ...prev, quantity: e.target.value }))}
                placeholder="Qty"
                className="border border-white/20 bg-transparent px-4 py-3"
              />
              <input
                type="number"
                step="0.01"
                value={orderForm.unit_cost_usd}
                onChange={(e) => setOrderForm((prev) => ({ ...prev, unit_cost_usd: e.target.value }))}
                placeholder="Unit cost"
                className="border border-white/20 bg-transparent px-4 py-3"
              />
              <input
                type="number"
                step="0.01"
                value={orderForm.total_cost_usd}
                onChange={(e) => setOrderForm((prev) => ({ ...prev, total_cost_usd: e.target.value }))}
                placeholder="Total cost override"
                className="border border-white/20 bg-transparent px-4 py-3"
              />
              <input
                type="datetime-local"
                value={orderForm.event_time}
                onChange={(e) => setOrderForm((prev) => ({ ...prev, event_time: e.target.value }))}
                className="border border-white/20 bg-transparent px-4 py-3"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={orderForm.order_reference}
                onChange={(e) => setOrderForm((prev) => ({ ...prev, order_reference: e.target.value }))}
                placeholder="Reference / invoice / ticket"
                className="border border-white/20 bg-transparent px-4 py-3"
              />
              <select
                value={orderForm.status}
                onChange={(e) => setOrderForm((prev) => ({ ...prev, status: e.target.value as FoodOrder["status"] }))}
                className="border border-white/20 bg-transparent px-4 py-3 text-white"
              >
                <option value="planned">Planned</option>
                <option value="ordered">Ordered</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <textarea
              value={orderForm.notes}
              onChange={(e) => setOrderForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full border border-white/20 bg-transparent px-4 py-3 h-20"
              placeholder="Delivery notes + dietary notes"
            />

            <button
              disabled={saving || vendors.length === 0}
              type="submit"
              className="bg-[#c8ff00] text-black px-4 py-3 font-semibold hover:bg-[#c8ff00]/80 transition-colors disabled:opacity-50"
            >
              {saving ? "Placing..." : "Log and place food order"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {orders.length === 0 ? (
              <p className="text-sm text-white/50">No food orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-white/10 p-3 text-sm">
                  <div className="font-semibold">
                    {order.vendor_name || "Vendor"} — {order.status}
                  </div>
                  <div className="text-white/60">{order.items}</div>
                  <div className="text-white/60">
                    Qty {order.quantity} • Unit ${order.unit_cost_usd ?? "-"} • Total ${order.total_cost_usd ?? "-"}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 border border-white/20 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent sponsorship entries</h3>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-sm text-white/50">No sponsorship entries yet.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="border border-white/10 p-3 text-sm">
                  <div className="font-semibold">{tx.sponsor_name}</div>
                  <div className="text-white/60">
                    {tx.sponsor_package} • pledged ${tx.pledged_usd || 0} • paid ${tx.paid_usd || 0} • {tx.status}
                  </div>
                  <div className="text-white/50 text-xs">{tx.notes || "No notes"}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>

      <footer className="border-t border-white/10 mt-8 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/30 text-sm">
          <p>Nebius.Build 2026 · Ops tracker</p>
        </div>
      </footer>
    </main>
  );
}
