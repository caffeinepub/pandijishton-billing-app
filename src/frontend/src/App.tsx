import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { Printer, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  rate: number;
  qty: number;
}

const INITIAL_PRODUCTS: Product[] = [
  // Oil products
  { id: 1, name: "200 ml", category: "तेल", rate: 25, qty: 0 },
  { id: 2, name: "500 ml", category: "तेल", rate: 60, qty: 0 },
  { id: 3, name: "1 लीटर", category: "तेल", rate: 110, qty: 0 },
  { id: 4, name: "2 लीटर", category: "तेल", rate: 210, qty: 0 },
  { id: 5, name: "5 लीटर", category: "तेल", rate: 520, qty: 0 },
  { id: 6, name: "20 KG", category: "तेल", rate: 1900, qty: 0 },
  { id: 17, name: "केरी नौलका", category: "तेल", rate: 0, qty: 0 },
  { id: 18, name: "1/8 काला", category: "तेल", rate: 0, qty: 0 },
  { id: 19, name: "1/4 काला", category: "तेल", rate: 0, qty: 0 },
  // Satjug Masala
  { id: 7, name: "Satjug बिरयानी मसाला", category: "मसाला", rate: 0, qty: 0 },
  { id: 8, name: "Satjug छोले मसाला", category: "मसाला", rate: 0, qty: 0 },
  { id: 9, name: "Satjug राजमा मसाला", category: "मसाला", rate: 0, qty: 0 },
  { id: 10, name: "Satjug आलू मसाला", category: "मसाला", rate: 0, qty: 0 },
  {
    id: 11,
    name: "Satjug शाही पनीर मसाला",
    category: "मसाला",
    rate: 0,
    qty: 0,
  },
  {
    id: 12,
    name: "Satjug कढ़ाई पनीर मसाला",
    category: "मसाला",
    rate: 0,
    qty: 0,
  },
  // Satjug Sendha Namak
  { id: 13, name: "Satjug सेंधा नमक 500g", category: "नमक", rate: 0, qty: 0 },
  { id: 14, name: "Satjug सेंधा नमक 1kg", category: "नमक", rate: 0, qty: 0 },
  // Satjug Rice
  { id: 15, name: "Satjug Green Rice 1kg", category: "चावल", rate: 0, qty: 0 },
  { id: 16, name: "Satjug Pink Rice 1kg", category: "चावल", rate: 0, qty: 0 },
];

function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("hi-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

const WHATSAPP_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    role="img"
    aria-label="WhatsApp"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CATEGORIES = ["तेल", "मसाला", "नमक", "चावल"];

export default function App() {
  const [date, setDate] = useState(getTodayDate());
  const [firmName, setFirmName] = useState("");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isSaving, setIsSaving] = useState(false);
  const { actor } = useActor();

  const totalAmount = products.reduce((sum, p) => sum + p.rate * p.qty, 0);

  const updateRate = (id: number, value: string) => {
    const num = Number.parseFloat(value) || 0;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rate: num } : p)),
    );
  };

  const updateQty = (id: number, value: string) => {
    const num = Number.parseInt(value, 10) || 0;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(0, num) } : p)),
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const items = products.filter((p) => p.qty > 0);
    if (items.length === 0) {
      toast.error("पहले मात्रा भरें");
      return;
    }
    const displayDate = formatDisplayDate(date);
    let msg = "🧾 *पंडित जी स्टोर*\n";
    msg += "सरसों तेल एवं माप तेल\n";
    msg += "━━━━━━━━━━━━━━━\n";
    if (firmName.trim()) {
      msg += `👤 फर्म: *${firmName.trim()}*\n`;
    }
    msg += `📅 दिनांक: ${displayDate}\n`;
    msg += "━━━━━━━━━━━━━━━\n";
    items.forEach((p, i) => {
      msg += `${i + 1}. ${p.name} — दर: ₹${p.rate} × मात्रा: ${p.qty} = *₹${p.rate * p.qty}*\n`;
    });
    msg += "━━━━━━━━━━━━━━━\n";
    msg += `💰 *कुल राशि: ${formatCurrency(totalAmount)}*\n`;
    msg += "\n📌 नियम: 7 दिन उधारी | इससे अधिक पर 2% ब्याज";
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleSave = async () => {
    if (!firmName.trim()) {
      toast.error("फर्म का नाम दर्ज करें");
      return;
    }
    if (!actor) {
      toast.error("बैकएंड से कनेक्ट नहीं हो पाया");
      return;
    }
    setIsSaving(true);
    try {
      const billItems = products
        .filter((p) => p.qty > 0)
        .map((p) => ({
          productName: p.name,
          rate: BigInt(Math.round(p.rate)),
          quantity: BigInt(p.qty),
          amount: BigInt(Math.round(p.rate * p.qty)),
        }));
      const bill = {
        customerName: firmName,
        date,
        totalAmount: BigInt(Math.round(totalAmount)),
        items: billItems,
      };
      const billId = BigInt(Date.now());
      await actor.saveBill(billId, bill);
      toast.success("बिल सफलतापूर्वक सेव हो गया!");
    } catch (err) {
      toast.error("बिल सेव करने में त्रुटि हुई");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderProductRows = (category: string, startIndex: number) => {
    const catProducts = products.filter((p) => p.category === category);
    return catProducts.map((product) => {
      const index = products.findIndex((p) => p.id === product.id);
      const amount = product.rate * product.qty;
      const rateId = `rate-${product.id}`;
      const qtyId = `qty-${product.id}`;
      return (
        <tr
          key={product.id}
          className={index % 2 === 0 ? "bg-card" : "bg-secondary/30"}
          data-ocid={`bill.product.row.${index + 1}`}
        >
          <td className="px-3 py-2 text-center text-muted-foreground font-medium">
            {startIndex + catProducts.indexOf(product) + 1}
          </td>
          <td className="px-3 py-2">
            <span className="hindi-text font-semibold text-foreground">
              {product.name}
            </span>
          </td>
          <td className="px-3 py-2">
            <label htmlFor={rateId} className="sr-only">
              दर
            </label>
            <input
              id={rateId}
              type="number"
              value={product.rate || ""}
              onChange={(e) => updateRate(product.id, e.target.value)}
              data-ocid={`bill.product.rate_input.${index + 1}`}
              className="w-24 text-right h-9 rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring ml-auto block"
              min="0"
              step="0.5"
            />
          </td>
          <td className="px-3 py-2">
            <label htmlFor={qtyId} className="sr-only">
              मात्रा
            </label>
            <input
              id={qtyId}
              type="number"
              value={product.qty || ""}
              onChange={(e) => updateQty(product.id, e.target.value)}
              data-ocid={`bill.product.qty_input.${index + 1}`}
              className="w-20 text-right h-9 rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring ml-auto block"
              min="0"
              placeholder="0"
            />
          </td>
          <td className="px-3 py-2 text-right font-semibold text-foreground">
            {amount > 0 ? formatCurrency(amount) : "—"}
          </td>
        </tr>
      );
    });
  };

  const renderMobileCards = (category: string, startIndex: number) => {
    const catProducts = products.filter((p) => p.category === category);
    return catProducts.map((product) => {
      const index = products.findIndex((p) => p.id === product.id);
      const amount = product.rate * product.qty;
      const mRateId = `m-rate-${product.id}`;
      const mQtyId = `m-qty-${product.id}`;
      return (
        <div
          key={product.id}
          className="rounded-md border border-border bg-card p-3"
          data-ocid={`bill.product.row.${index + 1}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="hindi-text font-bold text-base text-foreground">
              {startIndex + catProducts.indexOf(product) + 1}. {product.name}
            </span>
            <span className="font-bold text-saffron-700">
              {amount > 0 ? formatCurrency(amount) : "₹0"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={mRateId}
                className="hindi-text text-xs text-muted-foreground mb-1 block"
              >
                दर (₹)
              </label>
              <input
                id={mRateId}
                type="number"
                value={product.rate || ""}
                onChange={(e) => updateRate(product.id, e.target.value)}
                data-ocid={`bill.product.rate_input.${index + 1}`}
                className="w-full h-11 rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
                step="0.5"
                inputMode="decimal"
              />
            </div>
            <div>
              <label
                htmlFor={mQtyId}
                className="hindi-text text-xs text-muted-foreground mb-1 block"
              >
                मात्रा
              </label>
              <input
                id={mQtyId}
                type="number"
                value={product.qty || ""}
                onChange={(e) => updateQty(product.id, e.target.value)}
                data-ocid={`bill.product.qty_input.${index + 1}`}
                className="w-full h-11 rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
                placeholder="0"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="print-container mx-auto max-w-3xl px-3 py-6 sm:px-6">
        <div className="invoice-card rounded-lg bg-card shadow-invoice border border-border overflow-hidden">
          {/* HEADER */}
          <div className="page-header bg-gradient-to-br from-saffron-700 to-saffron-800 px-6 py-6 text-white">
            <div className="border border-white/30 rounded px-5 py-4 text-center">
              <h1 className="company-heading text-3xl sm:text-4xl font-bold tracking-wide text-white">
                पंडित जी स्टोर
              </h1>
              <p className="hindi-text mt-1 text-sm sm:text-base text-white/85 font-medium">
                सरसों तेल एवं माप तेल
              </p>
              <p className="mt-0.5 text-xs text-white/65 tracking-widest uppercase">
                Pandit Ji Store
              </p>
            </div>
          </div>

          {/* BILL INFO */}
          <div className="px-5 py-5 bg-secondary/40 border-b border-border">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <div className="flex flex-col gap-1.5 flex-1">
                <label
                  htmlFor="bill-date"
                  className="hindi-text text-sm font-semibold text-foreground"
                >
                  दिनांक:
                </label>
                <input
                  id="bill-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  data-ocid="bill.date_input"
                  className="h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="hidden">{formatDisplayDate(date)}</span>
              </div>
              <div className="flex flex-col gap-1.5 flex-[2]">
                <label
                  htmlFor="bill-firm"
                  className="hindi-text text-sm font-semibold text-foreground"
                >
                  फर्म का नाम:
                </label>
                <Input
                  id="bill-firm"
                  type="text"
                  placeholder="ग्राहक / फर्म का नाम लिखें..."
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  data-ocid="bill.firm_name_input"
                  className="h-11 text-base hindi-text placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <div className="px-4 py-4 sm:px-6">
            <h2 className="hindi-text text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="inline-block w-1 h-5 bg-saffron-600 rounded-full" />
              माल विवरण
            </h2>

            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-saffron-700 text-white">
                    <th className="hindi-text px-3 py-2.5 text-center font-semibold rounded-tl-md">
                      क्र.सं.
                    </th>
                    <th className="hindi-text px-3 py-2.5 text-left font-semibold">
                      माल का नाम
                    </th>
                    <th className="hindi-text px-3 py-2.5 text-right font-semibold">
                      दर (₹)
                    </th>
                    <th className="hindi-text px-3 py-2.5 text-right font-semibold">
                      मात्रा
                    </th>
                    <th className="hindi-text px-3 py-2.5 text-right font-semibold rounded-tr-md">
                      राशि (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat) => {
                    const _catProducts = products.filter(
                      (p) => p.category === cat,
                    );
                    const startIndex = products.filter((p) => {
                      const catIdx = CATEGORIES.indexOf(p.category);
                      return catIdx < CATEGORIES.indexOf(cat);
                    }).length;
                    return (
                      <>
                        <tr key={`cat-${cat}`} className="bg-saffron-50">
                          <td
                            colSpan={5}
                            className="hindi-text px-3 py-1.5 text-sm font-bold text-saffron-800 border-t border-saffron-200"
                          >
                            ▸ {cat}
                          </td>
                        </tr>
                        {renderProductRows(cat, startIndex)}
                      </>
                    );
                  })}
                  <tr className="bg-saffron-50 border-t-2 border-saffron-700">
                    <td
                      colSpan={4}
                      className="hindi-text px-3 py-3 text-right font-bold text-saffron-800 text-base"
                    >
                      कुल राशि:
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-saffron-800 text-base">
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-4">
              {CATEGORIES.map((cat) => {
                const startIndex = products.filter((p) => {
                  const catIdx = CATEGORIES.indexOf(p.category);
                  return catIdx < CATEGORIES.indexOf(cat);
                }).length;
                return (
                  <div key={`mcat-${cat}`}>
                    <div className="bg-saffron-100 rounded-md px-3 py-1.5 mb-2">
                      <span className="hindi-text text-sm font-bold text-saffron-800">
                        ▸ {cat}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {renderMobileCards(cat, startIndex)}
                    </div>
                  </div>
                );
              })}
              <div className="rounded-md bg-saffron-700 text-white px-4 py-3 flex justify-between items-center">
                <span className="hindi-text font-bold text-base">कुल राशि:</span>
                <span className="font-bold text-xl">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <Separator className="mx-5" />

          {/* TERMS */}
          <div className="px-5 py-5" data-ocid="bill.terms_section">
            <h3 className="hindi-text text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
              <span className="inline-block w-1 h-4 bg-saffron-600 rounded-full" />
              नियम एवं शर्तें
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 space-y-1.5">
              <p className="hindi-text text-sm text-foreground">
                • 7 दिन की उधारी होगी।
              </p>
              <p className="hindi-text text-sm text-foreground">
                • इससे ज़्यादा के लिए 2% ब्याज देना होगा।
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="no-print px-5 pb-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handlePrint}
              data-ocid="bill.pdf_button"
              className="flex-1 h-12 bg-saffron-700 hover:bg-saffron-800 text-white font-semibold text-base gap-2"
            >
              <Printer className="h-5 w-5" />
              <span className="hindi-text">PDF डाउनलोड करें</span>
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              data-ocid="bill.whatsapp_button"
              className="flex-1 h-12 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-base gap-2"
            >
              {WHATSAPP_ICON}
              <span className="hindi-text">WhatsApp पर भेजें</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              data-ocid="bill.save_button"
              variant="outline"
              className="flex-1 h-12 border-saffron-600 text-saffron-700 hover:bg-saffron-50 font-semibold text-base gap-2"
            >
              <Save className="h-5 w-5" />
              <span className="hindi-text">
                {isSaving ? "सेव हो रहा है..." : "बिल सेव करें"}
              </span>
            </Button>
          </div>

          {/* FOOTER */}
          <div className="bg-saffron-800 px-5 py-3 text-center">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-white/80 hover:text-white"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
