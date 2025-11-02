import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Returns & Refunds</h2>
            <p>
              At Leadshine, we want you to be completely satisfied with your purchase. If you're not happy with your order,
              we offer a hassle-free return and refund policy within 30 days of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Eligibility for Returns</h2>
            <p>To be eligible for a return, your item must be:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unused and in the same condition that you received it</li>
              <li>In the original packaging with all tags attached</li>
              <li>Accompanied by the original receipt or proof of purchase</li>
              <li>Returned within 30 days of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Non-Returnable Items</h2>
            <p>Certain items cannot be returned, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personalized or customized products</li>
              <li>Items marked as final sale</li>
              <li>Gift cards</li>
              <li>Downloadable products or digital content</li>
              <li>Opened hygiene products for safety reasons</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Process</h2>
            <p>Once we receive your returned item, we will:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Inspect the item to ensure it meets our return criteria</li>
              <li>Process your refund within 5-7 business days</li>
              <li>Send you an email confirmation when the refund has been processed</li>
              <li>Credit the refund to your original payment method within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Shipping Costs</h2>
            <p>
              Original shipping charges are non-refundable. If you receive a refund, the cost of return shipping will be
              deducted from your refund, unless the return is due to our error (wrong item, defective product, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Exchanges</h2>
            <p>
              We only replace items if they are defective or damaged. If you need to exchange an item for the same product,
              please contact our customer service team and we'll arrange for a replacement to be sent as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Initiate a Return</h2>
            <p>To start a return:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact our customer service team with your order number</li>
              <li>Provide the reason for the return</li>
              <li>Wait for return authorization and instructions</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Ship the item to the address provided in the return authorization</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>
              If you have any questions about our refund policy, please contact our customer service team. We're here to help
              make your shopping experience as smooth as possible.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
