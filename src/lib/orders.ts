import fs from "fs";
import path from "path";
import { FrameConfig } from "@/data/product";

export interface Order {
  id: string;
  createdAt: string;
  status: "paid" | "shipped";
  config: FrameConfig;
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  amount: number;
  sessionId: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "orders.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
}

export function getOrders(): Order[] {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  ensure();
  const orders = getOrders();
  orders.unshift(order);
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 2));
}

export function updateStatus(id: string, status: Order["status"]) {
  ensure();
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].status = status;
    fs.writeFileSync(FILE, JSON.stringify(orders, null, 2));
  }
}

export function getOrderBySession(sessionId: string): Order | undefined {
  return getOrders().find((o) => o.sessionId === sessionId);
}
