'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ShoppingCart, ArrowLeft, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ProductDetail({ product }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!session) {
      toast.error('Please sign in to add items to cart');
      router.push('/api/auth/signin');
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (response.ok) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      toast.error('Error adding to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ShopStack
            </Link>
            
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/cart">
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{session.user?.name}</span>
                  </div>
                  <Link href="/api/auth/signout">
                    <Button variant="ghost" size="sm" data-testid="signout-button">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/api/auth/signin">
                  <Button size="sm" data-testid="signin-button">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <div className="relative h-96 w-full bg-muted">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4" data-testid="product-name">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary mb-6" data-testid="product-price">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed" data-testid="product-description">
              {product.description}
            </p>
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isAdding}
              data-testid="add-to-cart-button"
              className="w-full md:w-auto"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>

            {/* Additional Info */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Free shipping on orders over $50</li>
                  <li>✓ 30-day money-back guarantee</li>
                  <li>✓ 1-year warranty included</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}