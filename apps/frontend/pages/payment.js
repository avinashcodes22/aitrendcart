import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function PaymentPage() {
  const { token } = useAuth();

  useEffect(() => {
    // 🔒 DEV MODE BYPASS (NO RAZORPAY KEYS NEEDED)
    if (process.env.NEXT_PUBLIC_RAZORPAY_ENABLED !== "true") {
      console.log("Razorpay disabled — dev mode");

      // simulate async behavior
      setTimeout(() => {
        window.location.href = "/payment-success";
      }, 800);

      return;
    }

    // 🔐 REAL PAYMENT FLOW
    const orderId = localStorage.getItem("aitrendcart_order_id");
    if (!orderId || !token) return;

    fetch("http://localhost:5000/api/payments/create-razorpay-order", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ orderId })
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to create Razorpay order");
        return r.json();
      })
      .then(openRazorpay)
      .catch((err) => {
        console.error(err);
        window.location.href = "/payment-failed";
      });
  }, [token]);

  function openRazorpay(data) {
    const options = {
      key: data.razorpayKey,
      amount: data.amount * 100,
      currency: "INR",
      name: "AItrendcart",
      order_id: data.razorpayOrderId,

      handler: async function (response) {
        try {
          await fetch("http://localhost:5000/api/payments/verify-razorpay", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(response)
          });

          window.location.href = "/payment-success";
        } catch (err) {
          console.error(err);
          window.location.href = "/payment-failed";
        }
      },

      modal: {
        ondismiss: () => {
          window.location.href = "/payment-failed";
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div className="p-6 text-center">
      Opening payment gateway…
    </div>
  );
}
