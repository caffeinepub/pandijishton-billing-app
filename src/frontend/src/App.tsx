import type { Shopkeeper } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  History,
  Loader2,
  Package,
  Pencil,
  Printer,
  RefreshCw,
  Save,
  Store,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

const CATEGORIES = ["तेल", "मसाला", "नमक", "चावल"];

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

// ─── Stock Manager Component ────────────────────────────────────────────────

interface StockMap {
  [productId: string]: number;
}

type StockAction = "add" | "set";

interface StockDialogState {
  open: boolean;
  action: StockAction;
  productId: string;
  productName: string;
  currentStock: number;
}

interface CostDialogState {
  open: boolean;
  productId: string;
  productName: string;
  currentCost: number;
}

function getStockStatus(qty: number): {
  label: string;
  color: string;
  bg: string;
  dot: string;
} {
  if (qty === 0)
    return {
      label: "स्टॉक खत्म",
      color: "text-red-700",
      bg: "bg-red-100 border-red-300",
      dot: "bg-red-500",
    };
  if (qty <= 10)
    return {
      label: "कम स्टॉक",
      color: "text-yellow-700",
      bg: "bg-yellow-100 border-yellow-300",
      dot: "bg-yellow-500",
    };
  return {
    label: "उपलब्ध",
    color: "text-green-700",
    bg: "bg-green-100 border-green-300",
    dot: "bg-green-500",
  };
}

interface StockManagerProps {
  actor: any;
}

function StockManager({ actor }: StockManagerProps) {
  const [stockMap, setStockMap] = useState<StockMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<StockDialogState>({
    open: false,
    action: "add",
    productId: "",
    productName: "",
    currentStock: 0,
  });
  const [inputQty, setInputQty] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [costMap, setCostMap] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("stock_costs") || "{}");
    } catch {
      return {};
    }
  });
  const [costDialog, setCostDialog] = useState<CostDialogState>({
    open: false,
    productId: "",
    productName: "",
    currentCost: 0,
  });
  const [costInput, setCostInput] = useState("");

  const saveCostMap = (newMap: Record<string, number>) => {
    setCostMap(newMap);
    localStorage.setItem("stock_costs", JSON.stringify(newMap));
  };

  const openCostDialog = (product: Product) => {
    const pid = String(product.id);
    setCostDialog({
      open: true,
      productId: pid,
      productName: product.name,
      currentCost: costMap[pid] ?? 0,
    });
    setCostInput(String(costMap[pid] ?? 0));
  };

  const handleCostSave = () => {
    const val = Number.parseFloat(costInput);
    if (Number.isNaN(val) || val < 0) {
      toast.error("सही लागत डालें");
      return;
    }
    const newMap = { ...costMap, [costDialog.productId]: val };
    saveCostMap(newMap);
    toast.success(`${costDialog.productName} — लागत ₹${val} सेट`);
    setCostDialog((prev) => ({ ...prev, open: false }));
  };

  const loadStock = useCallback(async () => {
    if (!actor) return;
    setIsLoading(true);
    try {
      const allStock = await actor.getAllStock();
      const map: StockMap = {};
      for (const item of allStock) {
        map[item.productId] = Number(item.qty);
      }
      setStockMap(map);
    } catch (err) {
      toast.error("स्टॉक लोड करने में त्रुटि");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  const openDialog = (
    action: StockAction,
    product: Product,
    currentStock: number,
  ) => {
    setDialog({
      open: true,
      action,
      productId: String(product.id),
      productName: product.name,
      currentStock,
    });
    setInputQty("");
  };

  const handleDialogSave = async () => {
    const qty = Number.parseInt(inputQty, 10);
    if (Number.isNaN(qty) || qty < 0) {
      toast.error("सही मात्रा डालें");
      return;
    }
    if (!actor) return;
    setIsSaving(true);
    try {
      if (dialog.action === "add") {
        await actor.addStock(dialog.productId, BigInt(qty));
        toast.success(`${dialog.productName} — ${qty} जोड़ा गया`);
      } else {
        await actor.setStock(dialog.productId, BigInt(qty));
        toast.success(`${dialog.productName} — स्टॉक ${qty} सेट किया`);
      }
      setDialog((prev) => ({ ...prev, open: false }));
      await loadStock();
    } catch (err) {
      toast.error("स्टॉक अपडेट में त्रुटि");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetStock = async (product: Product) => {
    if (!actor) return;
    if (
      !window.confirm(`क्या आप "${product.name}" का स्टॉक 0 पर रीसेट करना चाहते हैं?`)
    )
      return;
    try {
      await actor.resetStock(String(product.id));
      toast.success(`${product.name} — स्टॉक रीसेट किया गया`);
      await loadStock();
    } catch (err) {
      toast.error("स्टॉक रीसेट में त्रुटि");
      console.error(err);
    }
  };

  const totalProducts = INITIAL_PRODUCTS.length;
  const outOfStock = INITIAL_PRODUCTS.filter(
    (p) => (stockMap[String(p.id)] ?? 0) === 0,
  ).length;
  const lowStock = INITIAL_PRODUCTS.filter((p) => {
    const q = stockMap[String(p.id)] ?? 0;
    return q > 0 && q <= 10;
  }).length;

  return (
    <div className="px-4 py-5 sm:px-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div
          className="rounded-lg border border-border bg-card p-3 text-center"
          data-ocid="stock.total_card"
        >
          <div className="text-2xl font-bold text-foreground">
            {totalProducts}
          </div>
          <div className="hindi-text text-xs text-muted-foreground mt-1">
            कुल माल
          </div>
        </div>
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-center"
          data-ocid="stock.out_of_stock_card"
        >
          <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
          <div className="hindi-text text-xs text-red-600 mt-1">खत्म स्टॉक</div>
        </div>
        <div
          className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center"
          data-ocid="stock.low_stock_card"
        >
          <div className="text-2xl font-bold text-yellow-600">{lowStock}</div>
          <div className="hindi-text text-xs text-yellow-600 mt-1">कम स्टॉक</div>
        </div>
      </div>

      {/* Refresh button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={loadStock}
          disabled={isLoading}
          variant="outline"
          className="border-saffron-500 text-saffron-700 hover:bg-saffron-50 gap-2"
          data-ocid="stock.refresh_button"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="hindi-text">स्टॉक रिफ्रेश करें</span>
        </Button>
      </div>

      {isLoading && (
        <div
          className="flex items-center justify-center py-12"
          data-ocid="stock.loading_state"
        >
          <Loader2 className="h-8 w-8 animate-spin text-saffron-600" />
          <span className="hindi-text ml-3 text-muted-foreground">
            स्टॉक लोड हो रहा है...
          </span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-saffron-700 text-white">
                  <th className="hindi-text px-4 py-3 text-left font-semibold">
                    माल का नाम
                  </th>
                  <th className="hindi-text px-4 py-3 text-center font-semibold">
                    स्टॉक मात्रा
                  </th>
                  <th className="hindi-text px-4 py-3 text-center font-semibold">
                    लागत (₹)
                  </th>
                  <th className="hindi-text px-4 py-3 text-center font-semibold">
                    स्थिति
                  </th>
                  <th className="hindi-text px-4 py-3 text-center font-semibold">
                    कार्रवाई
                  </th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => {
                  const catProducts = INITIAL_PRODUCTS.filter(
                    (p) => p.category === cat,
                  );
                  return (
                    <>
                      <tr key={`cat-${cat}`} className="bg-saffron-50">
                        <td
                          colSpan={5}
                          className="hindi-text px-4 py-2 text-sm font-bold text-saffron-800 border-t border-saffron-200"
                        >
                          ▸ {cat}
                        </td>
                      </tr>
                      {catProducts.map((product, idx) => {
                        const stockQty = stockMap[String(product.id)] ?? 0;
                        const status = getStockStatus(stockQty);
                        const globalIdx = INITIAL_PRODUCTS.findIndex(
                          (p) => p.id === product.id,
                        );
                        return (
                          <tr
                            key={product.id}
                            className={
                              idx % 2 === 0 ? "bg-card" : "bg-secondary/30"
                            }
                            data-ocid={`stock.item.${globalIdx + 1}`}
                          >
                            <td className="px-4 py-3">
                              <span className="hindi-text font-semibold text-foreground">
                                {product.name}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-bold text-lg text-foreground">
                                {stockQty}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="font-semibold text-foreground">
                                  ₹{costMap[String(product.id)] ?? 0}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-muted-foreground hover:text-saffron-700"
                                  onClick={() => openCostDialog(product)}
                                  data-ocid={`stock.cost_edit_button.${globalIdx + 1}`}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${status.bg} ${status.color}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                />
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openDialog("add", product, stockQty)
                                  }
                                  className="h-8 bg-saffron-600 hover:bg-saffron-700 text-white text-xs hindi-text"
                                  data-ocid={`stock.add_button.${globalIdx + 1}`}
                                >
                                  माल जोड़ें
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    openDialog("set", product, stockQty)
                                  }
                                  className="h-8 border-saffron-400 text-saffron-700 hover:bg-saffron-50 text-xs hindi-text"
                                  data-ocid={`stock.set_button.${globalIdx + 1}`}
                                >
                                  सेट करें
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResetStock(product)}
                                  className="h-8 border-red-400 text-red-600 hover:bg-red-50 text-xs hindi-text"
                                  data-ocid={`stock.delete_button.${globalIdx + 1}`}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  रीसेट
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-4">
            {CATEGORIES.map((cat) => {
              const catProducts = INITIAL_PRODUCTS.filter(
                (p) => p.category === cat,
              );
              return (
                <div key={`mcat-stock-${cat}`}>
                  <div className="bg-saffron-100 rounded-md px-3 py-1.5 mb-2">
                    <span className="hindi-text text-sm font-bold text-saffron-800">
                      ▸ {cat}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {catProducts.map((product) => {
                      const stockQty = stockMap[String(product.id)] ?? 0;
                      const status = getStockStatus(stockQty);
                      const globalIdx = INITIAL_PRODUCTS.findIndex(
                        (p) => p.id === product.id,
                      );
                      return (
                        <div
                          key={product.id}
                          className="rounded-lg border border-border bg-card p-3"
                          data-ocid={`stock.item.${globalIdx + 1}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="hindi-text font-bold text-sm text-foreground">
                              {product.name}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${status.bg} ${status.color}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                              />
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <span className="hindi-text text-xs text-muted-foreground">
                                  स्टॉक:{" "}
                                </span>
                                <span className="font-bold text-xl text-foreground">
                                  {stockQty}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="hindi-text text-xs text-muted-foreground">
                                  लागत:
                                </span>
                                <span className="font-semibold text-sm text-foreground">
                                  ₹{costMap[String(product.id)] ?? 0}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-muted-foreground hover:text-saffron-700"
                                  onClick={() => openCostDialog(product)}
                                  data-ocid={`stock.cost_edit_button.${globalIdx + 1}`}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  openDialog("add", product, stockQty)
                                }
                                className="h-9 bg-saffron-600 hover:bg-saffron-700 text-white text-xs hindi-text px-3"
                                data-ocid={`stock.add_button.${globalIdx + 1}`}
                              >
                                माल जोड़ें
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openDialog("set", product, stockQty)
                                }
                                className="h-9 border-saffron-400 text-saffron-700 hover:bg-saffron-50 text-xs hindi-text px-3"
                                data-ocid={`stock.set_button.${globalIdx + 1}`}
                              >
                                सेट करें
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add/Set Stock Dialog */}
      <Dialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-sm" data-ocid="stock.dialog">
          <DialogHeader>
            <DialogTitle className="hindi-text text-saffron-800">
              {dialog.action === "add" ? "माल जोड़ें" : "स्टॉक सेट करें"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-saffron-50 border border-saffron-200 rounded-md px-3 py-2">
              <p className="hindi-text text-sm font-semibold text-saffron-800">
                {dialog.productName}
              </p>
              <p className="hindi-text text-xs text-muted-foreground mt-0.5">
                वर्तमान स्टॉक:{" "}
                <span className="font-bold text-foreground">
                  {dialog.currentStock}
                </span>
              </p>
            </div>
            <div>
              <label
                htmlFor="stock-qty-input"
                className="hindi-text text-sm font-semibold text-foreground block mb-1.5"
              >
                {dialog.action === "add"
                  ? "कितना माल जोड़ना है?"
                  : "नई स्टॉक मात्रा"}
              </label>
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="मात्रा डालें..."
                value={inputQty}
                onChange={(e) => setInputQty(e.target.value)}
                className="h-12 text-lg text-center"
                id="stock-qty-input"
                data-ocid="stock.input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDialogSave();
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setDialog((prev) => ({ ...prev, open: false }))}
                variant="outline"
                className="flex-1 hindi-text"
                data-ocid="stock.cancel_button"
              >
                रद्द करें
              </Button>
              <Button
                onClick={handleDialogSave}
                disabled={isSaving || !inputQty}
                className="flex-1 bg-saffron-700 hover:bg-saffron-800 text-white hindi-text"
                data-ocid="stock.confirm_button"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {dialog.action === "add" ? "जोड़ें" : "सेट करें"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cost Dialog */}
      <Dialog
        open={costDialog.open}
        onOpenChange={(open) => setCostDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-sm" data-ocid="stock.cost_dialog">
          <DialogHeader>
            <DialogTitle className="hindi-text text-saffron-800">
              लागत सेट करें
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-saffron-50 border border-saffron-200 rounded-md px-3 py-2">
              <p className="hindi-text text-sm font-semibold text-saffron-800">
                {costDialog.productName}
              </p>
              <p className="hindi-text text-xs text-muted-foreground mt-0.5">
                वर्तमान लागत:{" "}
                <span className="font-bold text-foreground">
                  ₹{costDialog.currentCost}
                </span>
              </p>
            </div>
            <div>
              <label
                htmlFor="cost-input"
                className="hindi-text text-sm font-semibold text-foreground block mb-1.5"
              >
                नई लागत राशि (₹)
              </label>
              <Input
                type="number"
                min="0"
                inputMode="decimal"
                placeholder="लागत डालें..."
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                className="h-12 text-lg text-center"
                id="cost-input"
                data-ocid="stock.cost_input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCostSave();
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() =>
                  setCostDialog((prev) => ({ ...prev, open: false }))
                }
                variant="outline"
                className="flex-1 hindi-text"
                data-ocid="stock.cost_cancel_button"
              >
                रद्द करें
              </Button>
              <Button
                onClick={handleCostSave}
                disabled={!costInput}
                className="flex-1 bg-saffron-700 hover:bg-saffron-800 text-white hindi-text"
                data-ocid="stock.cost_confirm_button"
              >
                सेट करें
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Shopkeeper Manager Component ───────────────────────────────────────────

interface ShopkeeperManagerProps {
  actor: any;
}

function ShopkeeperManager({ actor }: ShopkeeperManagerProps) {
  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [waDialog, setWaDialog] = useState<{
    type: "hisaab" | "message";
    sk: Shopkeeper;
  } | null>(null);
  const [waText, setWaText] = useState("");

  const loadShopkeepers = useCallback(async () => {
    if (!actor) return;
    setIsLoading(true);
    try {
      const list = await actor.getAllShopkeepers();
      setShopkeepers(list);
    } catch (err) {
      toast.error("दुकानदार सूची लोड नहीं हुई");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadShopkeepers();
  }, [loadShopkeepers]);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("दुकानदार का नाम डालें");
      return;
    }
    if (!shopName.trim()) {
      toast.error("दुकान का नाम डालें");
      return;
    }
    if (!phone.trim()) {
      toast.error("फोन नंबर डालें");
      return;
    }
    if (!actor) return;

    setIsAdding(true);
    try {
      const today = getTodayDate();
      await actor.addShopkeeper(
        name.trim(),
        shopName.trim(),
        phone.trim(),
        today,
      );
      toast.success(`${name.trim()} सफलतापूर्वक जोड़ा गया!`);
      setName("");
      setShopName("");
      setPhone("");
      await loadShopkeepers();
    } catch (err) {
      toast.error("दुकानदार जोड़ने में त्रुटि हुई");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const sendWhatsApp = () => {
    if (!waDialog) return;
    const phone = waDialog.sk.phone.replace(/\D/g, "");
    const msg = encodeURIComponent(waText);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    setWaDialog(null);
    setWaText("");
  };

  const openWaDialog = (type: "hisaab" | "message", sk: Shopkeeper) => {
    if (type === "hisaab") {
      setWaText(
        `नमस्ते ${sk.name} जी,\nआपकी दुकान ${sk.shopName} का हिसाब:\n\n[यहाँ हिसाब लिखें]\n\nधन्यवाद\nपंडित जी स्टोर`,
      );
    } else {
      setWaText("");
    }
    setWaDialog({ type, sk });
  };

  const handleDeleteShopkeeper = async (sk: Shopkeeper) => {
    if (!actor) return;
    if (!window.confirm(`क्या आप ${sk.name} को हटाना चाहते हैं?`)) return;
    try {
      await actor.deleteShopkeeper(BigInt(sk.id));
      toast.success(`${sk.name} को हटा दिया गया`);
      await loadShopkeepers();
    } catch (err) {
      toast.error("दुकानदार हटाने में त्रुटि");
      console.error(err);
    }
  };

  const count = shopkeepers.length;

  return (
    <div className="px-4 py-5 sm:px-6">
      {/* Summary Card */}
      <div
        className="mb-6 rounded-xl bg-gradient-to-br from-saffron-700 to-saffron-800 text-white px-6 py-5 flex items-center gap-5 shadow-md"
        data-ocid="shopkeeper.summary_card"
      >
        <div className="bg-white/20 rounded-full p-3">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <div className="text-4xl font-bold leading-none">{count}</div>
          <div className="hindi-text text-lg font-semibold mt-1 text-white/90">
            दुकानदार जुड़े हैं
          </div>
          <div className="hindi-text text-xs text-white/65 mt-0.5">
            अब तक कुल पंजीकृत दुकानदार
          </div>
        </div>
      </div>

      {/* Add Shopkeeper Form */}
      <div className="rounded-lg border border-saffron-200 bg-saffron-50 p-4 mb-6">
        <h2 className="hindi-text text-base font-bold text-saffron-800 mb-4 flex items-center gap-2">
          <span className="inline-block w-1 h-5 bg-saffron-600 rounded-full" />
          नया दुकानदार जोड़ें
        </h2>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="sk-name"
              className="hindi-text text-sm font-semibold text-foreground block mb-1"
            >
              दुकानदार का नाम *
            </label>
            <Input
              id="sk-name"
              type="text"
              placeholder="जैसे: राजेश कुमार"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 hindi-text"
              data-ocid="shopkeeper.name_input"
            />
          </div>
          <div>
            <label
              htmlFor="sk-shop"
              className="hindi-text text-sm font-semibold text-foreground block mb-1"
            >
              दुकान का नाम *
            </label>
            <Input
              id="sk-shop"
              type="text"
              placeholder="जैसे: राजेश जनरल स्टोर"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="h-11 hindi-text"
              data-ocid="shopkeeper.shop_name_input"
            />
          </div>
          <div>
            <label
              htmlFor="sk-phone"
              className="hindi-text text-sm font-semibold text-foreground block mb-1"
            >
              फोन नंबर *
            </label>
            <Input
              id="sk-phone"
              type="tel"
              inputMode="numeric"
              placeholder="जैसे: 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11"
              data-ocid="shopkeeper.phone_input"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={
              isAdding || !name.trim() || !shopName.trim() || !phone.trim()
            }
            className="w-full h-12 bg-saffron-700 hover:bg-saffron-800 text-white font-bold text-base hindi-text gap-2 mt-1"
            data-ocid="shopkeeper.add_button"
          >
            {isAdding ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Store className="h-5 w-5" />
            )}
            दुकानदार जोड़ें
          </Button>
        </div>
      </div>

      {/* Shopkeeper List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="hindi-text text-base font-bold text-foreground flex items-center gap-2">
            <span className="inline-block w-1 h-5 bg-saffron-600 rounded-full" />
            दुकानदार सूची
          </h2>
          <Button
            onClick={loadShopkeepers}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-saffron-400 text-saffron-700 hover:bg-saffron-50 gap-1.5 h-8"
            data-ocid="shopkeeper.refresh_button"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span className="hindi-text text-xs">रिफ्रेश</span>
          </Button>
        </div>

        {isLoading && (
          <div
            className="flex items-center justify-center py-12"
            data-ocid="shopkeeper.loading_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-saffron-600" />
            <span className="hindi-text ml-3 text-muted-foreground">
              लोड हो रहा है...
            </span>
          </div>
        )}

        {!isLoading && count === 0 && (
          <div
            className="text-center py-12 border-2 border-dashed border-saffron-200 rounded-lg"
            data-ocid="shopkeeper.empty_state"
          >
            <Users className="h-12 w-12 text-saffron-300 mx-auto mb-3" />
            <p className="hindi-text text-muted-foreground font-medium">
              अभी कोई दुकानदार नहीं जुड़ा है
            </p>
            <p className="hindi-text text-sm text-muted-foreground mt-1">
              ऊपर फॉर्म भरकर पहला दुकानदार जोड़ें
            </p>
          </div>
        )}

        {!isLoading && count > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-saffron-700 text-white">
                    <th className="hindi-text px-4 py-3 text-center font-semibold w-12">
                      क्र.
                    </th>
                    <th className="hindi-text px-4 py-3 text-left font-semibold">
                      दुकानदार का नाम
                    </th>
                    <th className="hindi-text px-4 py-3 text-left font-semibold">
                      दुकान का नाम
                    </th>
                    <th className="hindi-text px-4 py-3 text-center font-semibold">
                      फोन नंबर
                    </th>
                    <th className="hindi-text px-4 py-3 text-center font-semibold">
                      जुड़ने की तारीख
                    </th>
                    <th className="hindi-text px-4 py-3 text-center font-semibold">
                      WhatsApp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shopkeepers.map((sk, idx) => (
                    <tr
                      key={String(sk.id)}
                      className={idx % 2 === 0 ? "bg-card" : "bg-secondary/30"}
                      data-ocid={`shopkeeper.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 text-center text-muted-foreground font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="hindi-text font-semibold text-foreground">
                          {sk.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="hindi-text text-foreground">
                          {sk.shopName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <a
                          href={`tel:${sk.phone}`}
                          className="text-saffron-700 font-semibold hover:underline"
                        >
                          {sk.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {formatDisplayDate(sk.joinDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => openWaDialog("hisaab", sk)}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded font-medium hindi-text"
                            data-ocid={`shopkeeper.hisaab_button.${idx + 1}`}
                            title="हिसाब भेजें"
                          >
                            💰 हिसाब
                          </button>
                          <button
                            type="button"
                            onClick={() => openWaDialog("message", sk)}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded font-medium hindi-text"
                            data-ocid={`shopkeeper.message_button.${idx + 1}`}
                            title="संदेश भेजें"
                          >
                            💬 संदेश
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteShopkeeper(sk)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded font-medium"
                            data-ocid={`shopkeeper.delete_button.${idx + 1}`}
                            title="हटाएं"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {shopkeepers.map((sk, idx) => (
                <div
                  key={String(sk.id)}
                  className="rounded-lg border border-border bg-card p-4"
                  data-ocid={`shopkeeper.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="hindi-text font-bold text-base text-foreground">
                        {sk.name}
                      </div>
                      <div className="hindi-text text-sm text-muted-foreground mt-0.5">
                        {sk.shopName}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <a
                      href={`tel:${sk.phone}`}
                      className="text-saffron-700 font-semibold text-sm hover:underline"
                    >
                      📞 {sk.phone}
                    </a>
                    <span className="hindi-text text-xs text-muted-foreground">
                      {formatDisplayDate(sk.joinDate)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => openWaDialog("hisaab", sk)}
                      className="flex-1 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium hindi-text"
                      data-ocid={`shopkeeper.hisaab_button.${idx + 1}`}
                    >
                      💰 हिसाब भेजें
                    </button>
                    <button
                      type="button"
                      onClick={() => openWaDialog("message", sk)}
                      className="flex-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-medium hindi-text"
                      data-ocid={`shopkeeper.message_button.${idx + 1}`}
                    >
                      💬 संदेश भेजें
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteShopkeeper(sk)}
                      className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-medium flex items-center gap-1"
                      data-ocid={`shopkeeper.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* WhatsApp Dialog */}
      <Dialog
        open={!!waDialog}
        onOpenChange={(open) => {
          if (!open) {
            setWaDialog(null);
            setWaText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="hindi-text text-base flex items-center gap-2">
              <span className="text-green-600">📲</span>
              {waDialog?.type === "hisaab" ? "हिसाब भेजें" : "संदेश भेजें"} — WhatsApp
            </DialogTitle>
            {waDialog && (
              <p className="hindi-text text-sm text-muted-foreground">
                {waDialog.sk.name} · {waDialog.sk.shopName} · 📞{" "}
                {waDialog.sk.phone}
              </p>
            )}
          </DialogHeader>
          <div className="mt-2">
            <Textarea
              value={waText}
              onChange={(e) => setWaText(e.target.value)}
              placeholder="यहाँ संदेश लिखें..."
              className="hindi-text min-h-[140px] text-sm"
              data-ocid="shopkeeper.wa_textarea"
            />
          </div>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setWaDialog(null);
                setWaText("");
              }}
              className="hindi-text"
              data-ocid="shopkeeper.wa_cancel_button"
            >
              रद्द करें
            </Button>
            <Button
              onClick={sendWhatsApp}
              disabled={!waText.trim()}
              className="bg-green-600 hover:bg-green-700 text-white hindi-text gap-2"
              data-ocid="shopkeeper.wa_send_button"
            >
              <span>📲</span> WhatsApp पर भेजें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

interface BillHistoryProps {
  actor: any;
}

interface BillRecord {
  customerName: string;
  date: string;
  totalAmount: bigint;
  items: Array<{
    productName: string;
    rate: bigint;
    quantity: bigint;
    amount: bigint;
  }>;
}

function BillHistory({ actor }: BillHistoryProps) {
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const loadBills = useCallback(async () => {
    if (!actor) return;
    setIsLoading(true);
    try {
      const result = await actor.getAllBills();
      const sorted = [...result].sort((a: BillRecord, b: BillRecord) =>
        b.date.localeCompare(a.date),
      );
      setBills(sorted);
    } catch {
      toast.error("बिल हिस्ट्री लोड नहीं हुई");
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  return (
    <div className="px-4 py-5 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="hindi-text text-lg font-bold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-saffron-600" />
            बिल हिस्ट्री
          </h2>
          <p className="hindi-text text-sm text-muted-foreground mt-0.5">
            कुल{" "}
            <span className="font-bold text-saffron-700">{bills.length}</span>{" "}
            बिल सेव हैं
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadBills}
          disabled={isLoading}
          data-ocid="history.refresh_button"
          className="hindi-text border-saffron-300 text-saffron-700 hover:bg-saffron-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
          />
          ताज़ा करें
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex justify-center items-center py-10"
          data-ocid="history.loading_state"
        >
          <Loader2 className="h-6 w-6 animate-spin text-saffron-600" />
          <span className="hindi-text ml-3 text-muted-foreground">
            लोड हो रहा है...
          </span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && bills.length === 0 && (
        <div
          className="text-center py-14 bg-saffron-50 rounded-xl border border-saffron-200"
          data-ocid="history.empty_state"
        >
          <History className="h-10 w-10 text-saffron-300 mx-auto mb-3" />
          <p className="hindi-text text-base font-semibold text-saffron-700">
            कोई बिल सेव नहीं है
          </p>
          <p className="hindi-text text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            पहले बिल बनाएं और "बिल सेव करें" बटन दबाएं।
          </p>
        </div>
      )}

      {/* Bill list */}
      {!isLoading && bills.length > 0 && (
        <div className="space-y-3" data-ocid="history.list">
          {bills.map((bill, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: bills have no stable ID
            <div
              key={`bill-${bill.date}-${idx}`}
              className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
              data-ocid={`history.item.${idx + 1}`}
            >
              {/* Card header */}
              <button
                type="button"
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-saffron-50 transition-colors"
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                data-ocid={`history.toggle.${idx + 1}`}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="hindi-text font-bold text-foreground text-base truncate">
                    {bill.customerName || "—"}
                  </span>
                  <span className="hindi-text text-xs text-muted-foreground">
                    📅 {formatDisplayDate(bill.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3 ml-3 shrink-0">
                  <span className="hindi-text font-bold text-saffron-700 text-base">
                    {formatCurrency(Number(bill.totalAmount))}
                  </span>
                  <span className="text-muted-foreground text-lg">
                    {expandedIdx === idx ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded items */}
              {expandedIdx === idx && (
                <div className="border-t border-border bg-secondary/30 px-4 py-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="hindi-text text-left py-1 font-semibold">
                          माल
                        </th>
                        <th className="hindi-text text-right py-1 font-semibold">
                          दर
                        </th>
                        <th className="hindi-text text-right py-1 font-semibold">
                          मात्रा
                        </th>
                        <th className="hindi-text text-right py-1 font-semibold">
                          राशि
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.items.map((item, iIdx) => (
                        <tr
                          key={`${item.productName}-${iIdx}`}
                          className="border-t border-border/50"
                        >
                          <td className="hindi-text py-1.5 text-foreground">
                            {item.productName}
                          </td>
                          <td className="hindi-text py-1.5 text-right text-muted-foreground">
                            {formatCurrency(Number(item.rate))}
                          </td>
                          <td className="hindi-text py-1.5 text-right text-muted-foreground">
                            {Number(item.quantity)}
                          </td>
                          <td className="hindi-text py-1.5 text-right font-semibold text-saffron-700">
                            {formatCurrency(Number(item.amount))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-saffron-300">
                        <td
                          colSpan={3}
                          className="hindi-text pt-2 text-right font-bold text-saffron-800"
                        >
                          कुल:
                        </td>
                        <td className="hindi-text pt-2 text-right font-bold text-saffron-800">
                          {formatCurrency(Number(bill.totalAmount))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        let msg = "🧾 *पंडित जी स्टोर*\n";
                        msg += "सरसों तेल एवं माप तेल\n";
                        msg += "━━━━━━━━━━━━━━━\n";
                        if (bill.customerName?.trim()) {
                          msg += `👤 फर्म: *${bill.customerName.trim()}*\n`;
                        }
                        msg += `📅 दिनांक: ${formatDisplayDate(bill.date)}\n`;
                        msg += "━━━━━━━━━━━━━━━\n";
                        bill.items.forEach((item, i) => {
                          msg += `${i + 1}. ${item.productName} — दर: ₹${Number(item.rate)} × मात्रा: ${Number(item.quantity)} = *₹${Number(item.amount)}*\n`;
                        });
                        msg += "━━━━━━━━━━━━━━━\n";
                        msg += `💰 *कुल राशि: ${formatCurrency(Number(bill.totalAmount))}*\n`;
                        msg += "\n📌 नियम: 7 दिन उधारी | इससे अधिक पर 2% ब्याज";
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(msg)}`,
                          "_blank",
                        );
                      }}
                      data-ocid="bill_history.whatsapp_button"
                      className="hindi-text flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 active:scale-95 transition-all"
                    >
                      <span>📲</span> WhatsApp पर भेजें
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

          {/* TABS */}
          <Tabs defaultValue="bill" className="w-full">
            <div className="bg-saffron-50 border-b border-saffron-200 px-4 pt-3 no-print">
              <TabsList className="bg-transparent gap-1 h-auto p-0">
                <TabsTrigger
                  value="bill"
                  className="hindi-text font-semibold px-4 py-2 rounded-t-md rounded-b-none border-0 data-[state=active]:bg-card data-[state=active]:text-saffron-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-saffron-600 text-muted-foreground"
                  data-ocid="nav.bill_tab"
                >
                  🧾 बिल बनाएं
                </TabsTrigger>
                <TabsTrigger
                  value="stock"
                  className="hindi-text font-semibold px-4 py-2 rounded-t-md rounded-b-none border-0 data-[state=active]:bg-card data-[state=active]:text-saffron-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-saffron-600 text-muted-foreground"
                  data-ocid="nav.stock_tab"
                >
                  <Package className="h-4 w-4 mr-1.5" />
                  स्टॉक
                </TabsTrigger>
                <TabsTrigger
                  value="shopkeeper"
                  className="hindi-text font-semibold px-4 py-2 rounded-t-md rounded-b-none border-0 data-[state=active]:bg-card data-[state=active]:text-saffron-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-saffron-600 text-muted-foreground"
                  data-ocid="nav.shopkeeper_tab"
                >
                  <Store className="h-4 w-4 mr-1.5" />
                  दुकानदार
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="hindi-text font-semibold px-4 py-2 rounded-t-md rounded-b-none border-0 data-[state=active]:bg-card data-[state=active]:text-saffron-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-saffron-600 text-muted-foreground"
                  data-ocid="nav.history_tab"
                >
                  <History className="h-4 w-4 mr-1.5" />
                  बिल हिस्ट्री
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── BILLING TAB ── */}
            <TabsContent value="bill" className="mt-0">
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
                    <span className="hindi-text font-bold text-base">
                      कुल राशि:
                    </span>
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
            </TabsContent>

            {/* ── STOCK TAB ── */}
            <TabsContent value="stock" className="mt-0">
              <StockManager actor={actor} />
            </TabsContent>

            {/* ── SHOPKEEPER TAB ── */}
            <TabsContent value="shopkeeper" className="mt-0">
              <ShopkeeperManager actor={actor} />
            </TabsContent>

            {/* ── BILL HISTORY TAB ── */}
            <TabsContent value="history" className="mt-0">
              <BillHistory actor={actor} />
            </TabsContent>
          </Tabs>

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
